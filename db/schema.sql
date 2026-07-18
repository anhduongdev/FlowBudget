-- ╔════════════════════════════════════════════════════════════════════════════╗
-- ║  ỨNG DỤNG QUẢN LÝ CHI TIÊU THEO CHU KỲ LƯƠNG                               ║
-- ║  Database Schema — PostgreSQL 14+                                          ║
-- ║  Version : 1.0.0 (MVP)                                                     ║
-- ║  Charset : UTF-8                                                           ║
-- ╠════════════════════════════════════════════════════════════════════════════╣
-- ║  TRIẾT LÝ THIẾT KẾ                                                         ║
-- ║  1. salary_cycles là trục xoay của toàn hệ thống. Mọi con số trên          ║
-- ║     dashboard đều được cắt theo chu kỳ, không cắt theo tháng dương lịch.   ║
-- ║  2. Tách bạch 3 lớp tiền:                                                  ║
-- ║       (a) CHI BẮT BUỘC   -> cycle_fixed_expenses  (giữ lại ngay đầu kỳ)    ║
-- ║       (b) NGÂN SÁCH SINH HOẠT -> daily_plans      (sinh từ mẫu)           ║
-- ║       (c) THỰC TẾ        -> transactions          (sự thật duy nhất)       ║
-- ║  3. transactions là SOURCE OF TRUTH cho số dư. wallets.current_balance     ║
-- ║     chỉ là cache do trigger duy trì, luôn có hàm đối soát lại được.        ║
-- ║  4. Soft delete (deleted_at) cho các bảng nghiệp vụ để không mất lịch sử.  ║
-- ║  5. Mọi ràng buộc nghiệp vụ quan trọng đặt ở DB, không tin tưởng app layer.║
-- ╚════════════════════════════════════════════════════════════════════════════╝

-- ============================================================================
-- 00. EXTENSIONS & SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- EXCLUDE constraint chống chồng chu kỳ
CREATE EXTENSION IF NOT EXISTS citext;      -- email không phân biệt hoa thường
CREATE EXTENSION IF NOT EXISTS unaccent;    -- tìm kiếm tiếng Việt không dấu

CREATE SCHEMA IF NOT EXISTS app;
SET search_path = app, public;


-- ============================================================================
-- 01. ENUM TYPES
-- ============================================================================

-- Loại ví
CREATE TYPE wallet_type AS ENUM (
    'CASH',         -- Tiền mặt
    'BANK',         -- Tài khoản ngân hàng (MB, Techcombank...)
    'EWALLET',      -- Ví điện tử (MoMo, ZaloPay...)
    'CREDIT_CARD',  -- Thẻ tín dụng (số dư có thể âm)
    'SAVINGS',      -- Ví tiết kiệm
    'INVESTMENT',   -- Đầu tư
    'OTHER'
);

-- Danh mục thuộc nhóm thu hay chi
CREATE TYPE category_kind AS ENUM ('INCOME', 'EXPENSE');

-- Trạng thái chu kỳ lương
CREATE TYPE cycle_status AS ENUM (
    'DRAFT',    -- Chu kỳ tương lai, đang lên kế hoạch
    'ACTIVE',   -- Chu kỳ đang chạy
    'CLOSED'    -- Đã chốt sổ
);

-- Trạng thái quyết toán của khoản chi bắt buộc / thu dự kiến
CREATE TYPE settlement_status AS ENUM (
    'PENDING',  -- Chưa chi / Chưa nhận
    'PARTIAL',  -- Đã chi một phần
    'DONE',     -- Đã chi / Đã nhận
    'SKIPPED'   -- Bỏ qua kỳ này (VD: tháng này không dùng Netflix)
);

-- Chế độ mẫu chi tiêu hằng ngày
CREATE TYPE spending_template_mode AS ENUM (
    'FLAT',        -- Chế độ 1: giống nhau mỗi ngày
    'BY_WEEKDAY'   -- Chế độ 2: theo từng thứ trong tuần
);

-- Nguồn gốc của một dòng kế hoạch ngày
CREATE TYPE plan_source AS ENUM (
    'TEMPLATE',  -- Do hệ thống sinh từ mẫu
    'MANUAL'     -- Người dùng chỉnh tay riêng cho ngày đó -> không bị mẫu ghi đè
);

-- Chiều của giao dịch
CREATE TYPE txn_direction AS ENUM ('INCOME', 'EXPENSE');

-- Tần suất lặp của khoản chi bắt buộc
CREATE TYPE recurrence_unit AS ENUM ('ONE_TIME', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');


-- ============================================================================
-- 02. HÀM TIỆN ÍCH DÙNG CHUNG
-- ============================================================================

-- Tự động cập nhật updated_at trên mọi bảng
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- Trả về ngày lương của tháng chứa p_month, tự kẹp về ngày cuối tháng.
-- VD: payday = 31, tháng 2/2026 -> 28/02/2026
CREATE OR REPLACE FUNCTION fn_payday_of_month(p_month date, p_payday int)
RETURNS date
LANGUAGE sql IMMUTABLE STRICT AS $$
    SELECT (date_trunc('month', p_month)::date)
         + (LEAST(
               p_payday,
               EXTRACT(DAY FROM (date_trunc('month', p_month) + interval '1 month - 1 day'))::int
           ) - 1);
$$;

-- Tính biên chu kỳ lương chứa ngày p_ref.
-- VD: p_ref = 2026-03-15, payday = 10 -> (2026-03-10, 2026-04-09)
--     p_ref = 2026-03-05, payday = 10 -> (2026-02-10, 2026-03-09)
CREATE OR REPLACE FUNCTION fn_cycle_bounds(p_ref date, p_payday int)
RETURNS TABLE (start_date date, end_date date)
LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    v_start date;
    v_end   date;
BEGIN
    v_start := fn_payday_of_month(p_ref, p_payday);

    -- Nếu ngày tham chiếu còn trước ngày lương của tháng này -> thuộc chu kỳ tháng trước
    IF p_ref < v_start THEN
        v_start := fn_payday_of_month((date_trunc('month', p_ref) - interval '1 month')::date, p_payday);
    END IF;

    v_end := fn_payday_of_month((date_trunc('month', v_start) + interval '1 month')::date, p_payday) - 1;

    RETURN QUERY SELECT v_start, v_end;
END;
$$;


-- ============================================================================
-- 03. NGƯỜI DÙNG & PHIÊN ĐĂNG NHẬP
-- ============================================================================

CREATE TABLE users (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email                 citext NOT NULL,
    password_hash         text   NOT NULL,
    full_name             text,
    avatar_url            text,

    -- Cấu hình cá nhân
    timezone              text        NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    currency              char(3)     NOT NULL DEFAULT 'VND',
    locale                text        NOT NULL DEFAULT 'vi-VN',

    -- Cấu hình chu kỳ lương mặc định — dùng để sinh chu kỳ mới tự động
    payday_day            smallint      NOT NULL DEFAULT 10,
    default_salary        numeric(15,2) NOT NULL DEFAULT 0,
    default_savings_goal  numeric(15,2) NOT NULL DEFAULT 0,

    email_verified_at     timestamptz,
    last_login_at         timestamptz,
    is_active             boolean     NOT NULL DEFAULT true,

    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    deleted_at            timestamptz,

    CONSTRAINT ck_users_payday        CHECK (payday_day BETWEEN 1 AND 31),
    CONSTRAINT ck_users_salary        CHECK (default_salary >= 0),
    CONSTRAINT ck_users_savings_goal  CHECK (default_savings_goal >= 0),
    CONSTRAINT ck_users_email_format  CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

-- Email chỉ unique trong phạm vi tài khoản chưa bị xóa
CREATE UNIQUE INDEX uq_users_email_alive ON users (email) WHERE deleted_at IS NULL;

COMMENT ON COLUMN users.payday_day IS
    'Ngày nhận lương hàng tháng (1-31). Tự kẹp về ngày cuối tháng nếu tháng ngắn hơn.';


CREATE TABLE user_sessions (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash text NOT NULL,          -- KHÔNG BAO GIỜ lưu token thô
    user_agent         text,
    ip_address         inet,
    expires_at         timestamptz NOT NULL,
    revoked_at         timestamptz,
    created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_sessions_user   ON user_sessions (user_id);
CREATE UNIQUE INDEX uq_user_sessions_token ON user_sessions (refresh_token_hash);
CREATE INDEX idx_user_sessions_expiry ON user_sessions (expires_at) WHERE revoked_at IS NULL;


-- ============================================================================
-- 04. VÍ  (Mục 3 trong đặc tả)
-- ============================================================================

CREATE TABLE wallets (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name             text        NOT NULL,
    type             wallet_type NOT NULL DEFAULT 'CASH',
    icon             text,
    color            text,

    -- Số dư khai báo lúc tạo ví. Số dư hiện tại = initial_balance + tổng giao dịch.
    initial_balance  numeric(15,2) NOT NULL DEFAULT 0,

    -- Cache do trigger duy trì. Đối soát bằng fn_recalc_wallet_balances().
    current_balance  numeric(15,2) NOT NULL DEFAULT 0,

    credit_limit     numeric(15,2),   -- chỉ dùng cho CREDIT_CARD

    is_savings       boolean NOT NULL DEFAULT false,  -- Ví tiết kiệm
    include_in_total boolean NOT NULL DEFAULT true,   -- Có cộng vào "Tổng số dư" không
    allow_negative   boolean NOT NULL DEFAULT false,  -- Cho phép âm (thẻ tín dụng)
    is_default       boolean NOT NULL DEFAULT false,

    sort_order       int     NOT NULL DEFAULT 0,
    is_active        boolean NOT NULL DEFAULT true,
    note             text,

    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),
    deleted_at       timestamptz,

    CONSTRAINT ck_wallets_name         CHECK (length(btrim(name)) > 0),
    CONSTRAINT ck_wallets_credit_limit CHECK (credit_limit IS NULL OR credit_limit >= 0),
    CONSTRAINT ck_wallets_credit_type  CHECK (type = 'CREDIT_CARD' OR credit_limit IS NULL)
);

CREATE UNIQUE INDEX uq_wallets_name_per_user
    ON wallets (user_id, lower(btrim(name))) WHERE deleted_at IS NULL;

-- Mỗi user chỉ có đúng 1 ví mặc định
CREATE UNIQUE INDEX uq_wallets_one_default
    ON wallets (user_id) WHERE is_default AND deleted_at IS NULL;

CREATE INDEX idx_wallets_user ON wallets (user_id) WHERE deleted_at IS NULL;

COMMENT ON COLUMN wallets.include_in_total IS
    'Ví tiết kiệm thường đặt false để không làm "Tổng số dư khả dụng" bị thổi phồng.';


-- ============================================================================
-- 05. DANH MỤC THU / CHI  (Mục 4)
-- ============================================================================

CREATE TABLE categories (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id    uuid REFERENCES categories(id) ON DELETE SET NULL,

    kind         category_kind NOT NULL,
    name         text          NOT NULL,
    icon         text,
    color        text,

    -- Đánh dấu danh mục thiết yếu (Tiền trọ, Điện, Nước...) để phân tích về sau
    is_essential boolean NOT NULL DEFAULT false,
    is_system    boolean NOT NULL DEFAULT false,  -- danh mục seed mặc định, không cho xóa

    sort_order   int     NOT NULL DEFAULT 0,
    is_active    boolean NOT NULL DEFAULT true,

    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    deleted_at   timestamptz,

    CONSTRAINT ck_categories_name      CHECK (length(btrim(name)) > 0),
    CONSTRAINT ck_categories_no_self   CHECK (parent_id IS DISTINCT FROM id)
);

CREATE UNIQUE INDEX uq_categories_name_per_user
    ON categories (user_id, kind, coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(btrim(name)))
    WHERE deleted_at IS NULL;

CREATE INDEX idx_categories_user_kind ON categories (user_id, kind) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_parent    ON categories (parent_id) WHERE parent_id IS NOT NULL;

-- Danh mục cha phải cùng user và cùng kind với con
CREATE OR REPLACE FUNCTION fn_check_category_parent()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_parent categories%ROWTYPE;
BEGIN
    IF NEW.parent_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT * INTO v_parent FROM categories WHERE id = NEW.parent_id;

    IF v_parent.user_id <> NEW.user_id THEN
        RAISE EXCEPTION 'Danh mục cha thuộc user khác (category=%)', NEW.id
            USING ERRCODE = 'check_violation';
    END IF;

    IF v_parent.kind <> NEW.kind THEN
        RAISE EXCEPTION 'Danh mục cha có kind=% khác con kind=%', v_parent.kind, NEW.kind
            USING ERRCODE = 'check_violation';
    END IF;

    IF v_parent.parent_id IS NOT NULL THEN
        RAISE EXCEPTION 'Chỉ hỗ trợ tối đa 2 cấp danh mục'
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_categories_check_parent
    BEFORE INSERT OR UPDATE OF parent_id, kind ON categories
    FOR EACH ROW EXECUTE FUNCTION fn_check_category_parent();


-- ============================================================================
-- 06. CHU KỲ LƯƠNG  (Mục 2) — TRÁI TIM CỦA HỆ THỐNG
-- ============================================================================

CREATE TABLE salary_cycles (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name            text,          -- VD: "Chu kỳ 03/2026"
    start_date      date NOT NULL, -- Ngày nhận lương
    end_date        date NOT NULL, -- Ngày trước kỳ lương kế tiếp

    salary_amount   numeric(15,2) NOT NULL DEFAULT 0,  -- Số tiền lương nhận
    savings_goal    numeric(15,2) NOT NULL DEFAULT 0,  -- Mục tiêu tiết kiệm

    -- Snapshot số dư tại thời điểm mở kỳ — cần cho việc chốt sổ về sau
    opening_balance numeric(15,2) NOT NULL DEFAULT 0,
    closing_balance numeric(15,2),  -- chỉ điền khi status = CLOSED

    status          cycle_status NOT NULL DEFAULT 'ACTIVE',
    note            text,

    closed_at       timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_cycles_range        CHECK (end_date >= start_date),
    CONSTRAINT ck_cycles_salary       CHECK (salary_amount >= 0),
    CONSTRAINT ck_cycles_goal         CHECK (savings_goal  >= 0),
    CONSTRAINT ck_cycles_closed       CHECK (
        (status = 'CLOSED' AND closed_at IS NOT NULL AND closing_balance IS NOT NULL)
        OR (status <> 'CLOSED' AND closed_at IS NULL)
    ),

    -- ĐÂY LÀ RÀNG BUỘC QUAN TRỌNG NHẤT CỦA CẢ SCHEMA:
    -- hai chu kỳ của cùng một user tuyệt đối không được đè lên nhau,
    -- nếu không mọi giao dịch sẽ rơi vào trạng thái mơ hồ.
    CONSTRAINT ex_cycles_no_overlap EXCLUDE USING gist (
        user_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
    )
);

-- Mỗi user chỉ có 1 chu kỳ ACTIVE tại một thời điểm
CREATE UNIQUE INDEX uq_cycles_one_active
    ON salary_cycles (user_id) WHERE status = 'ACTIVE';

CREATE INDEX idx_cycles_user_dates ON salary_cycles (user_id, start_date DESC);
CREATE INDEX idx_cycles_range_gist ON salary_cycles USING gist (daterange(start_date, end_date, '[]'));

COMMENT ON CONSTRAINT ex_cycles_no_overlap ON salary_cycles IS
    'Chống chồng lấn chu kỳ. Cần extension btree_gist vì user_id là uuid.';


-- ============================================================================
-- 07. THU NHẬP DỰ KIẾN TRONG KỲ (lương, thưởng, freelance đã hẹn)
--     Cần thiết để dự báo "tiền cuối kỳ" cho chính xác.
-- ============================================================================

CREATE TABLE planned_incomes (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id       uuid NOT NULL REFERENCES salary_cycles(id) ON DELETE CASCADE,
    category_id    uuid REFERENCES categories(id) ON DELETE SET NULL,
    wallet_id      uuid REFERENCES wallets(id)    ON DELETE SET NULL,

    name           text          NOT NULL,          -- "Lương tháng 3", "Thưởng dự án X"
    planned_amount numeric(15,2) NOT NULL,
    expected_date  date,

    actual_amount  numeric(15,2) NOT NULL DEFAULT 0,  -- tổng do trigger cộng từ transactions
    received_date  date,
    status         settlement_status NOT NULL DEFAULT 'PENDING',

    note           text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_planned_incomes_amount CHECK (planned_amount > 0),
    CONSTRAINT ck_planned_incomes_actual CHECK (actual_amount >= 0)
);

CREATE INDEX idx_planned_incomes_cycle ON planned_incomes (cycle_id, status);


-- ============================================================================
-- 08. CHI BẮT BUỘC  (Mục 5)
--     Tách 2 lớp:
--       fixed_expense_templates -> khai báo 1 lần, dùng cho mọi kỳ (Netflix, trọ)
--       cycle_fixed_expenses    -> bản thể hiện thực tế của từng kỳ
-- ============================================================================

CREATE TABLE fixed_expense_templates (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id    uuid REFERENCES categories(id) ON DELETE SET NULL,
    wallet_id      uuid REFERENCES wallets(id)    ON DELETE SET NULL,

    name           text          NOT NULL,   -- "Tiền trọ", "Internet", "Spotify"
    default_amount numeric(15,2) NOT NULL,   -- Số tiền dự kiến mặc định

    recurrence     recurrence_unit NOT NULL DEFAULT 'MONTHLY',
    due_day        smallint,                 -- ngày trong tháng dự kiến phải chi

    -- true = tự động bơm vào mỗi chu kỳ mới khi gọi fn_apply_fixed_expense_templates()
    auto_add       boolean NOT NULL DEFAULT true,

    is_active      boolean NOT NULL DEFAULT true,
    sort_order     int     NOT NULL DEFAULT 0,
    note           text,

    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    deleted_at     timestamptz,

    CONSTRAINT ck_fet_amount CHECK (default_amount >= 0),
    CONSTRAINT ck_fet_dueday CHECK (due_day IS NULL OR due_day BETWEEN 1 AND 31),
    CONSTRAINT ck_fet_name   CHECK (length(btrim(name)) > 0)
);

CREATE INDEX idx_fet_user ON fixed_expense_templates (user_id)
    WHERE deleted_at IS NULL AND is_active;


CREATE TABLE cycle_fixed_expenses (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id       uuid NOT NULL REFERENCES salary_cycles(id) ON DELETE CASCADE,
    template_id    uuid REFERENCES fixed_expense_templates(id) ON DELETE SET NULL,
    category_id    uuid REFERENCES categories(id) ON DELETE SET NULL,
    wallet_id      uuid REFERENCES wallets(id)    ON DELETE SET NULL,

    name           text          NOT NULL,
    planned_amount numeric(15,2) NOT NULL,   -- Số tiền dự kiến
    due_date       date,                     -- Ngày dự kiến chi

    -- Số tiền thực tế + ngày chi thực tế: do trigger đồng bộ từ transactions,
    -- người dùng cũng có thể tự đánh dấu thủ công.
    actual_amount  numeric(15,2) NOT NULL DEFAULT 0,
    paid_date      date,
    status         settlement_status NOT NULL DEFAULT 'PENDING',

    note           text,
    sort_order     int NOT NULL DEFAULT 0,

    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_cfe_planned CHECK (planned_amount >= 0),
    CONSTRAINT ck_cfe_actual  CHECK (actual_amount  >= 0),
    CONSTRAINT ck_cfe_name    CHECK (length(btrim(name)) > 0),
    CONSTRAINT ck_cfe_done    CHECK (status <> 'DONE' OR paid_date IS NOT NULL)
);

CREATE INDEX idx_cfe_cycle        ON cycle_fixed_expenses (cycle_id, status);
CREATE INDEX idx_cfe_cycle_due    ON cycle_fixed_expenses (cycle_id, due_date);
CREATE UNIQUE INDEX uq_cfe_tpl_per_cycle
    ON cycle_fixed_expenses (cycle_id, template_id) WHERE template_id IS NOT NULL;

COMMENT ON TABLE cycle_fixed_expenses IS
    'Ngay khi mở chu kỳ, tổng planned_amount ở đây = số tiền phải "khóa" lại, '
    'không được đưa vào ngân sách sinh hoạt.';


-- ============================================================================
-- 09. MẪU CHI TIÊU HẰNG NGÀY  (Mục 6)
-- ============================================================================

CREATE TABLE spending_templates (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- cycle_id NULL  => mẫu mặc định của user, áp cho mọi chu kỳ mới
    -- cycle_id có giá trị => mẫu riêng, ghi đè mẫu mặc định cho đúng chu kỳ đó
    cycle_id    uuid REFERENCES salary_cycles(id) ON DELETE CASCADE,

    name        text NOT NULL DEFAULT 'Mẫu chi tiêu',
    mode        spending_template_mode NOT NULL DEFAULT 'FLAT',

    -- Chế độ 1: dùng flat_amount cho mọi ngày
    flat_amount numeric(15,2),

    is_default  boolean NOT NULL DEFAULT false,

    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_st_flat_amount CHECK (
        (mode = 'FLAT'       AND flat_amount IS NOT NULL AND flat_amount >= 0)
     OR (mode = 'BY_WEEKDAY')
    )
);

-- Mỗi chu kỳ nhiều nhất 1 mẫu riêng
CREATE UNIQUE INDEX uq_st_one_per_cycle
    ON spending_templates (cycle_id) WHERE cycle_id IS NOT NULL;

-- Mỗi user nhiều nhất 1 mẫu mặc định
CREATE UNIQUE INDEX uq_st_one_default
    ON spending_templates (user_id) WHERE cycle_id IS NULL AND is_default;

CREATE INDEX idx_st_user ON spending_templates (user_id);


-- Chế độ 2: mỗi thứ trong tuần một mức
-- weekday theo chuẩn ISO: 1 = Thứ 2, 2 = Thứ 3, ..., 6 = Thứ 7, 7 = Chủ nhật
-- (khớp trực tiếp với EXTRACT(ISODOW FROM date))
CREATE TABLE spending_template_rules (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid NOT NULL REFERENCES spending_templates(id) ON DELETE CASCADE,
    weekday     smallint      NOT NULL,
    amount      numeric(15,2) NOT NULL,

    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_str_weekday CHECK (weekday BETWEEN 1 AND 7),
    CONSTRAINT ck_str_amount  CHECK (amount >= 0),
    CONSTRAINT uq_str_weekday UNIQUE (template_id, weekday)
);

COMMENT ON COLUMN spending_template_rules.weekday IS
    'ISO-8601: 1=Thứ 2 ... 7=Chủ nhật. Khớp với EXTRACT(ISODOW FROM d).';


-- ============================================================================
-- 10. KẾ HOẠCH CHI TIÊU TỪNG NGÀY  (sinh ra từ mẫu, cho phép chỉnh tay)
-- ============================================================================

CREATE TABLE daily_plans (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id       uuid NOT NULL REFERENCES salary_cycles(id) ON DELETE CASCADE,

    plan_date      date          NOT NULL,
    planned_amount numeric(15,2) NOT NULL DEFAULT 0,

    -- MANUAL = người dùng đã chỉnh riêng ngày này -> fn_generate_daily_plans()
    -- sẽ KHÔNG ghi đè trừ khi truyền p_overwrite = true.
    source         plan_source NOT NULL DEFAULT 'TEMPLATE',
    note           text,

    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT ck_dp_amount CHECK (planned_amount >= 0),
    CONSTRAINT uq_dp_cycle_date UNIQUE (cycle_id, plan_date)
);

CREATE INDEX idx_dp_cycle_date ON daily_plans (cycle_id, plan_date);

-- plan_date bắt buộc phải nằm trong biên chu kỳ
CREATE OR REPLACE FUNCTION fn_check_daily_plan_date()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_start date;
    v_end   date;
BEGIN
    SELECT start_date, end_date INTO v_start, v_end
      FROM salary_cycles WHERE id = NEW.cycle_id;

    IF NEW.plan_date < v_start OR NEW.plan_date > v_end THEN
        RAISE EXCEPTION 'Ngày kế hoạch % nằm ngoài chu kỳ (% .. %)', NEW.plan_date, v_start, v_end
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_dp_check_date
    BEFORE INSERT OR UPDATE OF plan_date, cycle_id ON daily_plans
    FOR EACH ROW EXECUTE FUNCTION fn_check_daily_plan_date();


-- ============================================================================
-- 11. CHUYỂN TIỀN GIỮA CÁC VÍ
--     Một lần chuyển sinh ra 2 dòng transactions (1 EXPENSE + 1 INCOME)
--     được đánh dấu is_excluded = true để không làm sai thống kê thu/chi.
-- ============================================================================

CREATE TABLE transfers (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
    to_wallet_id   uuid NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,

    amount         numeric(15,2) NOT NULL,
    fee            numeric(15,2) NOT NULL DEFAULT 0,  -- phí chuyển khoản
    transfer_date  date          NOT NULL DEFAULT CURRENT_DATE,
    note           text,

    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    deleted_at     timestamptz,

    CONSTRAINT ck_tr_amount   CHECK (amount > 0),
    CONSTRAINT ck_tr_fee      CHECK (fee >= 0),
    CONSTRAINT ck_tr_wallets  CHECK (from_wallet_id <> to_wallet_id)
);

CREATE INDEX idx_transfers_user_date ON transfers (user_id, transfer_date DESC)
    WHERE deleted_at IS NULL;


-- ============================================================================
-- 12. GIAO DỊCH THỰC TẾ  (Mục 7) — SOURCE OF TRUTH
-- ============================================================================

CREATE TABLE transactions (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Tự động điền bởi trigger dựa trên txn_date. Cho phép NULL với giao dịch
    -- rơi ngoài mọi chu kỳ đã tạo (dữ liệu import cũ chẳng hạn).
    cycle_id          uuid REFERENCES salary_cycles(id) ON DELETE SET NULL,

    wallet_id         uuid NOT NULL REFERENCES wallets(id)    ON DELETE RESTRICT,
    category_id       uuid REFERENCES categories(id)          ON DELETE SET NULL,

    -- Liên kết ngược: giao dịch này là để trả khoản chi bắt buộc / nhận thu dự kiến nào
    fixed_expense_id  uuid REFERENCES cycle_fixed_expenses(id) ON DELETE SET NULL,
    planned_income_id uuid REFERENCES planned_incomes(id)      ON DELETE SET NULL,
    transfer_id       uuid REFERENCES transfers(id)            ON DELETE CASCADE,

    direction         txn_direction NOT NULL,
    amount            numeric(15,2) NOT NULL,   -- LUÔN DƯƠNG, chiều nằm ở direction

    txn_date          date        NOT NULL DEFAULT CURRENT_DATE,
    txn_at            timestamptz NOT NULL DEFAULT now(),

    note              text,

    -- true => bỏ khỏi mọi thống kê thu/chi (chân của transfer, điều chỉnh số dư...)
    is_excluded       boolean NOT NULL DEFAULT false,

    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    deleted_at        timestamptz,

    CONSTRAINT ck_txn_amount CHECK (amount > 0),
    CONSTRAINT ck_txn_fixed_is_expense CHECK (
        fixed_expense_id IS NULL OR direction = 'EXPENSE'
    ),
    CONSTRAINT ck_txn_income_link CHECK (
        planned_income_id IS NULL OR direction = 'INCOME'
    ),
    CONSTRAINT ck_txn_transfer_excluded CHECK (
        transfer_id IS NULL OR is_excluded = true
    )
);

-- Chỉ mục phục vụ dashboard: đây là truy vấn chạy nhiều nhất của app.
CREATE INDEX idx_txn_cycle_date ON transactions (cycle_id, txn_date)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_user_date  ON transactions (user_id, txn_date DESC)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_wallet     ON transactions (wallet_id)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_category   ON transactions (category_id, txn_date)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_fixed      ON transactions (fixed_expense_id)
    WHERE fixed_expense_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_txn_planned_income ON transactions (planned_income_id)
    WHERE planned_income_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_txn_transfer   ON transactions (transfer_id)
    WHERE transfer_id IS NOT NULL;

-- unaccent() mặc định là STABLE nên không dùng trực tiếp trong index expression
-- được (Postgres yêu cầu IMMUTABLE). Bọc lại bằng wrapper IMMUTABLE theo khuyến
-- nghị chính thức của Postgres wiki cho use-case này.
CREATE OR REPLACE FUNCTION fn_immutable_unaccent(text)
RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT AS $$
    SELECT unaccent('unaccent', $1);
$$;

-- Tìm kiếm ghi chú tiếng Việt không dấu
CREATE INDEX idx_txn_note_search ON transactions
    USING gin (to_tsvector('simple', fn_immutable_unaccent(coalesce(note, ''))));

COMMENT ON COLUMN transactions.amount IS
    'Luôn lưu số dương. Chiều tiền quyết định bởi cột direction. '
    'Quy ước này giúp mọi CHECK và mọi báo cáo đọc dễ hơn hẳn so với việc lưu số âm.';


-- ============================================================================
-- 13. NHẬT KÝ THAY ĐỔI (audit)
-- ============================================================================

CREATE TABLE audit_logs (
    id          bigserial PRIMARY KEY,
    user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
    table_name  text NOT NULL,
    record_id   uuid NOT NULL,
    action      text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data    jsonb,
    new_data    jsonb,
    changed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_record ON audit_logs (table_name, record_id, changed_at DESC);
CREATE INDEX idx_audit_user   ON audit_logs (user_id, changed_at DESC);


-- ============================================================================
-- 14. TRIGGER NGHIỆP VỤ
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 14.1 Toàn vẹn giao dịch: ví/danh mục phải cùng chủ, kind phải khớp direction
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_txn_validate()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_wallet_owner uuid;
    v_cat          categories%ROWTYPE;
BEGIN
    SELECT user_id INTO v_wallet_owner FROM wallets WHERE id = NEW.wallet_id;
    IF v_wallet_owner IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'Ví % không thuộc về user %', NEW.wallet_id, NEW.user_id
            USING ERRCODE = 'check_violation';
    END IF;

    IF NEW.category_id IS NOT NULL THEN
        SELECT * INTO v_cat FROM categories WHERE id = NEW.category_id;

        IF v_cat.user_id IS DISTINCT FROM NEW.user_id THEN
            RAISE EXCEPTION 'Danh mục % không thuộc về user %', NEW.category_id, NEW.user_id
                USING ERRCODE = 'check_violation';
        END IF;

        -- Danh mục THU không thể gắn vào giao dịch CHI và ngược lại
        IF v_cat.kind::text <> NEW.direction::text THEN
            RAISE EXCEPTION 'Danh mục "%" thuộc nhóm % nhưng giao dịch là %',
                v_cat.name, v_cat.kind, NEW.direction
                USING ERRCODE = 'check_violation';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_txn_validate
    BEFORE INSERT OR UPDATE OF wallet_id, category_id, direction, user_id ON transactions
    FOR EACH ROW EXECUTE FUNCTION fn_txn_validate();


-- ---------------------------------------------------------------------------
-- 14.2 Tự gán cycle_id theo txn_date  (người dùng không cần biết chu kỳ nào)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_txn_resolve_cycle()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.cycle_id IS NULL
       OR (TG_OP = 'UPDATE' AND NEW.txn_date IS DISTINCT FROM OLD.txn_date) THEN

        SELECT c.id INTO NEW.cycle_id
          FROM salary_cycles c
         WHERE c.user_id = NEW.user_id
           AND NEW.txn_date BETWEEN c.start_date AND c.end_date
         LIMIT 1;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_txn_resolve_cycle
    BEFORE INSERT OR UPDATE OF txn_date, user_id ON transactions
    FOR EACH ROW EXECUTE FUNCTION fn_txn_resolve_cycle();


-- ---------------------------------------------------------------------------
-- 14.3 Duy trì cache wallets.current_balance
--      Xử lý đủ 3 tình huống: INSERT / UPDATE (kể cả đổi ví) / DELETE
--      và coi soft-delete (deleted_at) như một lần xóa thật.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_txn_apply_balance()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_old_effect numeric(15,2) := 0;
    v_new_effect numeric(15,2) := 0;
BEGIN
    -- Tác động của bản ghi CŨ (nếu nó từng "sống")
    IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.deleted_at IS NULL THEN
        v_old_effect := CASE WHEN OLD.direction = 'INCOME' THEN OLD.amount ELSE -OLD.amount END;
        UPDATE wallets SET current_balance = current_balance - v_old_effect
         WHERE id = OLD.wallet_id;
    END IF;

    -- Tác động của bản ghi MỚI (nếu nó đang "sống")
    IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.deleted_at IS NULL THEN
        v_new_effect := CASE WHEN NEW.direction = 'INCOME' THEN NEW.amount ELSE -NEW.amount END;
        UPDATE wallets SET current_balance = current_balance + v_new_effect
         WHERE id = NEW.wallet_id;
    END IF;

    RETURN NULL;  -- AFTER trigger
END;
$$;

CREATE TRIGGER trg_txn_apply_balance
    AFTER INSERT OR UPDATE OF amount, direction, wallet_id, deleted_at OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION fn_txn_apply_balance();


-- ---------------------------------------------------------------------------
-- 14.4 Chặn ví đi vào số dư âm nếu ví không cho phép
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_wallet_guard_negative()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.current_balance < 0 AND NOT NEW.allow_negative THEN
        RAISE EXCEPTION 'Ví "%" sẽ bị âm (%). Bật allow_negative nếu đây là thẻ tín dụng.',
            NEW.name, NEW.current_balance
            USING ERRCODE = 'check_violation';
    END IF;

    IF NEW.type = 'CREDIT_CARD' AND NEW.credit_limit IS NOT NULL
       AND NEW.current_balance < -NEW.credit_limit THEN
        RAISE EXCEPTION 'Vượt hạn mức tín dụng của ví "%"', NEW.name
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_wallet_guard_negative
    BEFORE UPDATE OF current_balance ON wallets
    FOR EACH ROW EXECUTE FUNCTION fn_wallet_guard_negative();


-- ---------------------------------------------------------------------------
-- 14.5 Đồng bộ trạng thái khoản chi bắt buộc từ giao dịch thực tế
--      Người dùng chỉ cần ghi 1 giao dịch gắn fixed_expense_id, hệ thống tự
--      chuyển "Chưa chi" -> "Đã chi" và điền số tiền + ngày chi thực tế.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sync_fixed_expense()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_ids  uuid[];
    v_id   uuid;
BEGIN
    v_ids := ARRAY(
        SELECT DISTINCT x FROM unnest(ARRAY[
            CASE WHEN TG_OP <> 'INSERT' THEN OLD.fixed_expense_id END,
            CASE WHEN TG_OP <> 'DELETE' THEN NEW.fixed_expense_id END
        ]) AS x WHERE x IS NOT NULL
    );

    FOREACH v_id IN ARRAY v_ids LOOP
        UPDATE cycle_fixed_expenses cfe
           SET actual_amount = agg.total,
               paid_date     = agg.last_date,
               status        = CASE
                                   WHEN agg.total <= 0                     THEN 'PENDING'
                                   WHEN agg.total < cfe.planned_amount     THEN 'PARTIAL'
                                   ELSE 'DONE'
                               END,
               updated_at    = now()
          FROM (
                SELECT COALESCE(SUM(t.amount), 0) AS total,
                       MAX(t.txn_date)            AS last_date
                  FROM transactions t
                 WHERE t.fixed_expense_id = v_id
                   AND t.deleted_at IS NULL
               ) agg
         WHERE cfe.id = v_id
           AND cfe.status <> 'SKIPPED';   -- tôn trọng lựa chọn "bỏ qua kỳ này"
    END LOOP;

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_fixed_expense
    AFTER INSERT OR UPDATE OF fixed_expense_id, amount, txn_date, deleted_at OR DELETE
    ON transactions
    FOR EACH ROW EXECUTE FUNCTION fn_sync_fixed_expense();


-- ---------------------------------------------------------------------------
-- 14.6 Đồng bộ trạng thái thu nhập dự kiến
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sync_planned_income()
RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    v_ids uuid[];
    v_id  uuid;
BEGIN
    v_ids := ARRAY(
        SELECT DISTINCT x FROM unnest(ARRAY[
            CASE WHEN TG_OP <> 'INSERT' THEN OLD.planned_income_id END,
            CASE WHEN TG_OP <> 'DELETE' THEN NEW.planned_income_id END
        ]) AS x WHERE x IS NOT NULL
    );

    FOREACH v_id IN ARRAY v_ids LOOP
        UPDATE planned_incomes pi
           SET actual_amount = agg.total,
               received_date = agg.last_date,
               status        = CASE
                                   WHEN agg.total <= 0                   THEN 'PENDING'
                                   WHEN agg.total < pi.planned_amount    THEN 'PARTIAL'
                                   ELSE 'DONE'
                               END,
               updated_at    = now()
          FROM (
                SELECT COALESCE(SUM(t.amount), 0) AS total,
                       MAX(t.txn_date)            AS last_date
                  FROM transactions t
                 WHERE t.planned_income_id = v_id
                   AND t.deleted_at IS NULL
               ) agg
         WHERE pi.id = v_id
           AND pi.status <> 'SKIPPED';
    END LOOP;

    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_planned_income
    AFTER INSERT OR UPDATE OF planned_income_id, amount, txn_date, deleted_at OR DELETE
    ON transactions
    FOR EACH ROW EXECUTE FUNCTION fn_sync_planned_income();


-- ---------------------------------------------------------------------------
-- 14.7 Gắn trigger updated_at cho toàn bộ bảng có cột này
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT c.table_name
          FROM information_schema.columns c
         WHERE c.table_schema = 'app'
           AND c.column_name  = 'updated_at'
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON app.%I
             FOR EACH ROW EXECUTE FUNCTION app.fn_set_updated_at()',
            r.table_name, r.table_name
        );
    END LOOP;
END;
$$;


-- ============================================================================
-- 15. HÀM NGHIỆP VỤ (API cho tầng ứng dụng gọi)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 15.1 Sinh kế hoạch chi tiêu từng ngày từ mẫu  (Mục 6)
--      Ưu tiên: mẫu riêng của chu kỳ -> mẫu mặc định của user.
--      Không đụng vào các ngày người dùng đã chỉnh tay (source = MANUAL),
--      trừ khi p_overwrite = true.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_generate_daily_plans(
    p_cycle_id  uuid,
    p_overwrite boolean DEFAULT false
)
RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
    v_cycle salary_cycles%ROWTYPE;
    v_tpl   spending_templates%ROWTYPE;
    v_count integer := 0;
BEGIN
    SELECT * INTO v_cycle FROM salary_cycles WHERE id = p_cycle_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy chu kỳ %', p_cycle_id;
    END IF;

    -- Mẫu riêng cho chu kỳ này?
    SELECT * INTO v_tpl FROM spending_templates WHERE cycle_id = p_cycle_id;

    -- Nếu không có, dùng mẫu mặc định của user
    IF NOT FOUND THEN
        SELECT * INTO v_tpl
          FROM spending_templates
         WHERE user_id = v_cycle.user_id AND cycle_id IS NULL AND is_default;
    END IF;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User % chưa thiết lập mẫu chi tiêu hằng ngày', v_cycle.user_id;
    END IF;

    INSERT INTO daily_plans AS dp (cycle_id, plan_date, planned_amount, source)
    SELECT p_cycle_id,
           d::date,
           CASE
               WHEN v_tpl.mode = 'FLAT' THEN COALESCE(v_tpl.flat_amount, 0)
               ELSE COALESCE(
                        (SELECT r.amount
                           FROM spending_template_rules r
                          WHERE r.template_id = v_tpl.id
                            AND r.weekday = EXTRACT(ISODOW FROM d)::smallint),
                        0)
           END,
           'TEMPLATE'
      FROM generate_series(v_cycle.start_date::timestamp,
                           v_cycle.end_date::timestamp,
                           interval '1 day') AS d
    ON CONFLICT (cycle_id, plan_date) DO UPDATE
       SET planned_amount = EXCLUDED.planned_amount,
           source         = 'TEMPLATE'
     WHERE p_overwrite OR dp.source = 'TEMPLATE';

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

COMMENT ON FUNCTION fn_generate_daily_plans IS
    'Sinh daily_plans cho toàn chu kỳ. Gọi lại mỗi khi người dùng sửa mẫu chi tiêu.';


-- ---------------------------------------------------------------------------
-- 15.2 Bơm các khoản chi bắt buộc từ template vào chu kỳ  (Mục 5)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_apply_fixed_expense_templates(p_cycle_id uuid)
RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
    v_cycle salary_cycles%ROWTYPE;
    v_count integer := 0;
BEGIN
    SELECT * INTO v_cycle FROM salary_cycles WHERE id = p_cycle_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy chu kỳ %', p_cycle_id;
    END IF;

    INSERT INTO cycle_fixed_expenses
        (cycle_id, template_id, category_id, wallet_id, name, planned_amount, due_date, sort_order)
    SELECT p_cycle_id,
           t.id,
           t.category_id,
           t.wallet_id,
           t.name,
           t.default_amount,
           -- Tìm ngày đến hạn rơi vào trong biên chu kỳ
           CASE
               WHEN t.due_day IS NULL THEN NULL
               WHEN fn_payday_of_month(v_cycle.start_date, t.due_day)
                    BETWEEN v_cycle.start_date AND v_cycle.end_date
                    THEN fn_payday_of_month(v_cycle.start_date, t.due_day)
               ELSE fn_payday_of_month(
                        (date_trunc('month', v_cycle.start_date) + interval '1 month')::date,
                        t.due_day)
           END,
           t.sort_order
      FROM fixed_expense_templates t
     WHERE t.user_id    = v_cycle.user_id
       AND t.is_active
       AND t.auto_add
       AND t.deleted_at IS NULL
       AND t.recurrence IN ('MONTHLY', 'ONE_TIME')
    ON CONFLICT (cycle_id, template_id) DO NOTHING;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;


-- ---------------------------------------------------------------------------
-- 15.3 Mở một chu kỳ lương mới — hàm "một phát ăn ngay"
--      Tự tính biên chu kỳ, snapshot số dư đầu kỳ, bơm chi bắt buộc,
--      sinh kế hoạch ngày, và đóng chu kỳ cũ.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_open_cycle(
    p_user_id      uuid,
    p_ref_date     date          DEFAULT CURRENT_DATE,
    p_salary       numeric(15,2) DEFAULT NULL,
    p_savings_goal numeric(15,2) DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql AS $$
DECLARE
    v_user     users%ROWTYPE;
    v_start    date;
    v_end      date;
    v_balance  numeric(15,2);
    v_cycle_id uuid;
BEGIN
    SELECT * INTO v_user FROM users WHERE id = p_user_id AND deleted_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy user %', p_user_id;
    END IF;

    SELECT b.start_date, b.end_date INTO v_start, v_end
      FROM fn_cycle_bounds(p_ref_date, v_user.payday_day) b;

    -- Đóng chu kỳ đang chạy (nếu có) trước khi mở kỳ mới
    UPDATE salary_cycles
       SET status          = 'CLOSED',
           closed_at       = now(),
           closing_balance = (
               SELECT COALESCE(SUM(w.current_balance), 0)
                 FROM wallets w
                WHERE w.user_id = p_user_id AND w.deleted_at IS NULL
           )
     WHERE user_id = p_user_id
       AND status  = 'ACTIVE'
       AND end_date < v_start;

    -- Số dư đầu kỳ = tổng số dư hiện tại của mọi ví
    SELECT COALESCE(SUM(w.current_balance), 0) INTO v_balance
      FROM wallets w
     WHERE w.user_id = p_user_id AND w.deleted_at IS NULL;

    INSERT INTO salary_cycles
        (user_id, name, start_date, end_date, salary_amount, savings_goal, opening_balance, status)
    VALUES (
        p_user_id,
        'Chu kỳ ' || to_char(v_start, 'DD/MM/YYYY') || ' - ' || to_char(v_end, 'DD/MM/YYYY'),
        v_start,
        v_end,
        COALESCE(p_salary,       v_user.default_salary),
        COALESCE(p_savings_goal, v_user.default_savings_goal),
        v_balance,
        'ACTIVE'
    )
    RETURNING id INTO v_cycle_id;

    PERFORM fn_apply_fixed_expense_templates(v_cycle_id);
    PERFORM fn_generate_daily_plans(v_cycle_id);

    RETURN v_cycle_id;
END;
$$;


-- ---------------------------------------------------------------------------
-- 15.4 Ghi một lần chuyển tiền giữa 2 ví (sinh 2 chân giao dịch)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_create_transfer(
    p_user_id   uuid,
    p_from      uuid,
    p_to        uuid,
    p_amount    numeric(15,2),
    p_fee       numeric(15,2) DEFAULT 0,
    p_date      date          DEFAULT CURRENT_DATE,
    p_note      text          DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql AS $$
DECLARE
    v_transfer_id uuid;
BEGIN
    INSERT INTO transfers (user_id, from_wallet_id, to_wallet_id, amount, fee, transfer_date, note)
    VALUES (p_user_id, p_from, p_to, p_amount, p_fee, p_date, p_note)
    RETURNING id INTO v_transfer_id;

    -- Chân ĐI: trừ ví nguồn cả tiền gốc lẫn phí
    INSERT INTO transactions
        (user_id, wallet_id, transfer_id, direction, amount, txn_date, note, is_excluded)
    VALUES (p_user_id, p_from, v_transfer_id, 'EXPENSE', p_amount + p_fee, p_date,
            COALESCE(p_note, 'Chuyển tiền đi'), true);

    -- Chân ĐẾN: cộng ví đích đúng tiền gốc
    INSERT INTO transactions
        (user_id, wallet_id, transfer_id, direction, amount, txn_date, note, is_excluded)
    VALUES (p_user_id, p_to, v_transfer_id, 'INCOME', p_amount, p_date,
            COALESCE(p_note, 'Nhận tiền chuyển'), true);

    RETURN v_transfer_id;
END;
$$;


-- ---------------------------------------------------------------------------
-- 15.5 Đối soát lại cache số dư ví (chạy định kỳ hoặc khi nghi ngờ lệch)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_recalc_wallet_balances(p_user_id uuid DEFAULT NULL)
RETURNS TABLE (wallet_id uuid, wallet_name text, old_balance numeric, new_balance numeric)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH truth AS (
        SELECT w.id,
               w.name,
               w.current_balance AS old_bal,
               w.initial_balance + COALESCE(SUM(
                   CASE WHEN t.direction = 'INCOME' THEN t.amount ELSE -t.amount END
               ), 0) AS new_bal
          FROM wallets w
          LEFT JOIN transactions t
                 ON t.wallet_id = w.id AND t.deleted_at IS NULL
         WHERE w.deleted_at IS NULL
           AND (p_user_id IS NULL OR w.user_id = p_user_id)
         GROUP BY w.id, w.name, w.current_balance, w.initial_balance
    ),
    fixed AS (
        UPDATE wallets w
           SET current_balance = truth.new_bal
          FROM truth
         WHERE w.id = truth.id
           AND w.current_balance IS DISTINCT FROM truth.new_bal
        RETURNING w.id
    )
    SELECT t.id, t.name, t.old_bal, t.new_bal
      FROM truth t
     WHERE t.id IN (SELECT id FROM fixed);
END;
$$;

COMMENT ON FUNCTION fn_recalc_wallet_balances IS
    'Đối soát cache. Nếu hàm này trả về dòng nào -> trigger đã bị bypass ở đâu đó, cần điều tra.';


-- ============================================================================
-- 16. VIEWS — TẦNG ĐỌC CHO ỨNG DỤNG
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 16.1 Số dư ví (kèm cột đối chiếu cache vs sự thật)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_wallet_balances AS
SELECT w.id                AS wallet_id,
       w.user_id,
       w.name,
       w.type,
       w.is_savings,
       w.include_in_total,
       w.initial_balance,
       w.current_balance   AS cached_balance,
       w.initial_balance + COALESCE(SUM(
           CASE WHEN t.direction = 'INCOME' THEN t.amount ELSE -t.amount END
       ), 0)               AS computed_balance,
       w.current_balance - (w.initial_balance + COALESCE(SUM(
           CASE WHEN t.direction = 'INCOME' THEN t.amount ELSE -t.amount END
       ), 0))              AS drift,
       COUNT(t.id)         AS txn_count,
       MAX(t.txn_date)     AS last_txn_date
  FROM wallets w
  LEFT JOIN transactions t
         ON t.wallet_id = w.id AND t.deleted_at IS NULL
 WHERE w.deleted_at IS NULL
 GROUP BY w.id;

COMMENT ON VIEW v_wallet_balances IS
    'drift <> 0 nghĩa là cache lệch khỏi sự thật -> chạy fn_recalc_wallet_balances().';


-- ---------------------------------------------------------------------------
-- 16.2 ĐỐI CHIẾU KẾ HOẠCH vs THỰC TẾ THEO NGÀY  (Mục 8)
--      Lưu ý: chỉ so ngân sách SINH HOẠT. Các khoản chi bắt buộc và chân
--      chuyển ví bị loại ra, vì chúng không thuộc mẫu chi tiêu hằng ngày.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_daily_comparison AS
WITH cycle_days AS (
    SELECT c.id AS cycle_id,
           c.user_id,
           d::date AS day
      FROM salary_cycles c
      CROSS JOIN LATERAL generate_series(
          c.start_date::timestamp, c.end_date::timestamp, interval '1 day'
      ) AS d
),
actual AS (
    SELECT t.cycle_id,
           t.txn_date AS day,
           SUM(t.amount) FILTER (
               WHERE t.direction = 'EXPENSE' AND t.fixed_expense_id IS NULL
           ) AS living_expense,
           SUM(t.amount) FILTER (
               WHERE t.direction = 'EXPENSE' AND t.fixed_expense_id IS NOT NULL
           ) AS fixed_expense,
           SUM(t.amount) FILTER (WHERE t.direction = 'INCOME') AS income,
           COUNT(*)                                            AS txn_count
      FROM transactions t
     WHERE t.deleted_at IS NULL
       AND t.is_excluded = false
       AND t.cycle_id IS NOT NULL
     GROUP BY t.cycle_id, t.txn_date
)
SELECT cd.cycle_id,
       cd.user_id,
       cd.day,
       to_char(cd.day, 'Dy')                       AS weekday_short,
       EXTRACT(ISODOW FROM cd.day)::smallint       AS weekday_iso,
       COALESCE(dp.planned_amount, 0)              AS planned_amount,
       COALESCE(dp.source, 'TEMPLATE')             AS plan_source,
       COALESCE(a.living_expense, 0)               AS actual_amount,
       COALESCE(a.fixed_expense,  0)               AS fixed_amount,
       COALESCE(a.income,         0)               AS income_amount,
       COALESCE(a.txn_count,      0)               AS txn_count,

       -- variance > 0 : tiết kiệm được | variance < 0 : vượt kế hoạch
       COALESCE(dp.planned_amount, 0) - COALESCE(a.living_expense, 0) AS variance,

       CASE
           WHEN cd.day > CURRENT_DATE                                        THEN 'FUTURE'
           WHEN COALESCE(a.living_expense, 0) >  COALESCE(dp.planned_amount, 0) THEN 'OVER'
           WHEN COALESCE(a.living_expense, 0) <  COALESCE(dp.planned_amount, 0) THEN 'UNDER'
           ELSE 'ON_TRACK'
       END AS status,

       -- Lũy kế để vẽ đường "kế hoạch vs thực tế"
       SUM(COALESCE(dp.planned_amount, 0))
           OVER (PARTITION BY cd.cycle_id ORDER BY cd.day)  AS cum_planned,
       SUM(COALESCE(a.living_expense, 0))
           OVER (PARTITION BY cd.cycle_id ORDER BY cd.day)  AS cum_actual,
       SUM(COALESCE(dp.planned_amount, 0) - COALESCE(a.living_expense, 0))
           OVER (PARTITION BY cd.cycle_id ORDER BY cd.day)  AS cum_variance
  FROM cycle_days cd
  LEFT JOIN daily_plans dp ON dp.cycle_id = cd.cycle_id AND dp.plan_date = cd.day
  LEFT JOIN actual     a   ON a.cycle_id  = cd.cycle_id AND a.day       = cd.day;


-- ---------------------------------------------------------------------------
-- 16.3 DASHBOARD  (Mục 9 + Mục 10) — view quan trọng nhất
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_cycle_dashboard AS
SELECT
    c.id            AS cycle_id,
    c.user_id,
    c.name          AS cycle_name,
    c.start_date,
    c.end_date,
    c.status,
    c.salary_amount,
    c.savings_goal,
    c.opening_balance,

    -- Tiến độ thời gian
    (c.end_date - c.start_date + 1)                       AS days_total,
    GREATEST(LEAST(CURRENT_DATE, c.end_date) - c.start_date + 1, 0) AS days_elapsed,
    CASE
        WHEN CURRENT_DATE > c.end_date   THEN 0
        WHEN CURRENT_DATE < c.start_date THEN (c.end_date - c.start_date + 1)
        ELSE (c.end_date - CURRENT_DATE + 1)
    END                                                   AS days_remaining,

    -- Tổng số dư hiện tại (chỉ ví có include_in_total)
    bal.total_balance,
    bal.savings_balance,

    -- Chi bắt buộc
    fx.fixed_planned_total,
    fx.fixed_paid_total,
    fx.fixed_remaining,          -- số tiền còn phải giữ lại cho chi bắt buộc

    -- Thu nhập dự kiến chưa về
    inc.income_pending,

    -- Ngân sách sinh hoạt (từ mẫu chi tiêu)
    pl.living_budget_total,
    pl.living_planned_to_date,
    pl.living_planned_remaining,

    -- Thực tế đã phát sinh
    act.total_spent,             -- tổng chi (gồm cả chi bắt buộc)
    act.living_spent,            -- chỉ chi sinh hoạt
    act.fixed_spent,
    act.total_income,

    -- Đối chiếu kế hoạch tính đến hôm nay
    (pl.living_planned_to_date - act.living_spent)        AS variance_to_date,
    CASE
        WHEN act.living_spent > pl.living_planned_to_date THEN 'OVER'
        WHEN act.living_spent < pl.living_planned_to_date THEN 'UNDER'
        ELSE 'ON_TRACK'
    END                                                   AS pace_status,

    -- Dự báo tiền cuối kỳ
    --    = tiền đang có
    --    + thu nhập dự kiến chưa về
    --    − chi bắt buộc chưa trả
    --    − ngân sách sinh hoạt còn lại của các ngày chưa tới
    (bal.total_balance
        + inc.income_pending
        - fx.fixed_remaining
        - pl.living_planned_remaining
        - GREATEST(today.today_planned - today.today_spent, 0)) AS projected_end_balance,

    -- Đánh giá mục tiêu tiết kiệm
    (bal.total_balance + inc.income_pending - fx.fixed_remaining
        - pl.living_planned_remaining
        - GREATEST(today.today_planned - today.today_spent, 0)
        - c.savings_goal)                                 AS goal_gap,
    CASE
        WHEN c.savings_goal = 0 THEN 'NO_GOAL'
        WHEN (bal.total_balance + inc.income_pending - fx.fixed_remaining
              - pl.living_planned_remaining
              - GREATEST(today.today_planned - today.today_spent, 0))
             >  c.savings_goal THEN 'EXCEEDED'
        WHEN (bal.total_balance + inc.income_pending - fx.fixed_remaining
              - pl.living_planned_remaining
              - GREATEST(today.today_planned - today.today_spent, 0))
             >= c.savings_goal THEN 'ON_TARGET'
        ELSE 'BEHIND'
    END                                                   AS goal_status,

    -- "Hôm nay còn được tiêu bao nhiêu?"
    --    Chia đều phần tiền tự do còn lại cho số ngày còn lại của kỳ.
    CASE
        WHEN CURRENT_DATE > c.end_date OR CURRENT_DATE < c.start_date THEN NULL
        ELSE ROUND(
            GREATEST(bal.total_balance + inc.income_pending
                     - fx.fixed_remaining - c.savings_goal, 0)
            / NULLIF(c.end_date - CURRENT_DATE + 1, 0), 0)
    END                                                   AS safe_to_spend_per_day,

    today.today_planned,
    today.today_spent,
    (today.today_planned - today.today_spent)             AS today_remaining

FROM salary_cycles c

-- Số dư ví
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(w.current_balance) FILTER (WHERE w.include_in_total), 0) AS total_balance,
           COALESCE(SUM(w.current_balance) FILTER (WHERE w.is_savings),       0) AS savings_balance
      FROM wallets w
     WHERE w.user_id = c.user_id AND w.deleted_at IS NULL
) bal ON true

-- Chi bắt buộc
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(f.planned_amount) FILTER (WHERE f.status <> 'SKIPPED'), 0) AS fixed_planned_total,
           COALESCE(SUM(f.actual_amount), 0)                                       AS fixed_paid_total,
           COALESCE(SUM(GREATEST(f.planned_amount - f.actual_amount, 0))
                    FILTER (WHERE f.status IN ('PENDING', 'PARTIAL')), 0)          AS fixed_remaining
      FROM cycle_fixed_expenses f
     WHERE f.cycle_id = c.id
) fx ON true

-- Thu nhập dự kiến chưa nhận
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(GREATEST(p.planned_amount - p.actual_amount, 0))
                    FILTER (WHERE p.status IN ('PENDING', 'PARTIAL')), 0) AS income_pending
      FROM planned_incomes p
     WHERE p.cycle_id = c.id
) inc ON true

-- Kế hoạch sinh hoạt
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(d.planned_amount), 0)                                          AS living_budget_total,
           COALESCE(SUM(d.planned_amount) FILTER (WHERE d.plan_date <= CURRENT_DATE), 0) AS living_planned_to_date,  -- gồm cả hôm nay
           COALESCE(SUM(d.planned_amount) FILTER (WHERE d.plan_date >  CURRENT_DATE), 0) AS living_planned_remaining
      FROM daily_plans d
     WHERE d.cycle_id = c.id
) pl ON true

-- Thực tế
LEFT JOIN LATERAL (
    SELECT COALESCE(SUM(t.amount) FILTER (WHERE t.direction = 'EXPENSE'), 0) AS total_spent,
           COALESCE(SUM(t.amount) FILTER (WHERE t.direction = 'EXPENSE'
                                            AND t.fixed_expense_id IS NULL), 0) AS living_spent,
           COALESCE(SUM(t.amount) FILTER (WHERE t.direction = 'EXPENSE'
                                            AND t.fixed_expense_id IS NOT NULL), 0) AS fixed_spent,
           COALESCE(SUM(t.amount) FILTER (WHERE t.direction = 'INCOME'), 0)  AS total_income
      FROM transactions t
     WHERE t.cycle_id = c.id AND t.deleted_at IS NULL AND t.is_excluded = false
) act ON true

-- Riêng hôm nay
LEFT JOIN LATERAL (
    SELECT COALESCE((SELECT d.planned_amount FROM daily_plans d
                      WHERE d.cycle_id = c.id AND d.plan_date = CURRENT_DATE), 0) AS today_planned,
           COALESCE((SELECT SUM(t.amount) FROM transactions t
                      WHERE t.cycle_id = c.id AND t.txn_date = CURRENT_DATE
                        AND t.direction = 'EXPENSE' AND t.fixed_expense_id IS NULL
                        AND t.deleted_at IS NULL AND t.is_excluded = false), 0)   AS today_spent
) today ON true;

COMMENT ON VIEW v_cycle_dashboard IS
    'Một dòng = toàn bộ màn hình Dashboard của một chu kỳ. '
    'Frontend chỉ cần: SELECT * FROM v_cycle_dashboard WHERE user_id = $1 AND status = ''ACTIVE'';';


-- ---------------------------------------------------------------------------
-- 16.4 Phân bố chi tiêu theo danh mục trong chu kỳ
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_category_breakdown AS
SELECT t.cycle_id,
       t.user_id,
       t.direction,
       cat.id                       AS category_id,
       COALESCE(cat.name, '(Chưa phân loại)') AS category_name,
       cat.icon,
       cat.color,
       COUNT(*)                     AS txn_count,
       SUM(t.amount)                AS total_amount,
       ROUND(100.0 * SUM(t.amount) / NULLIF(SUM(SUM(t.amount))
             OVER (PARTITION BY t.cycle_id, t.direction), 0), 2) AS pct_of_cycle,
       ROUND(AVG(t.amount), 0)      AS avg_amount,
       MAX(t.amount)                AS max_amount
  FROM transactions t
  LEFT JOIN categories cat ON cat.id = t.category_id
 WHERE t.deleted_at IS NULL
   AND t.is_excluded = false
   AND t.cycle_id IS NOT NULL
 GROUP BY t.cycle_id, t.user_id, t.direction, cat.id, cat.name, cat.icon, cat.color;


-- ============================================================================
-- 17. ROW LEVEL SECURITY
--     Lớp phòng thủ cuối: dù backend có lỡ quên WHERE user_id, DB vẫn chặn.
--     App phải SET app.current_user_id = '<uuid>' đầu mỗi transaction.
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_current_user_id()
RETURNS uuid
LANGUAGE sql STABLE AS $$
    SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

-- Bảng có cột user_id trực tiếp
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT unnest(ARRAY[
            'wallets', 'categories', 'salary_cycles', 'fixed_expense_templates',
            'spending_templates', 'transactions', 'transfers', 'user_sessions'
        ]) AS t
    LOOP
        EXECUTE format('ALTER TABLE app.%I ENABLE ROW LEVEL SECURITY', r.t);
        EXECUTE format(
            'CREATE POLICY p_%I_own ON app.%I
             USING (user_id = app.fn_current_user_id())
             WITH CHECK (user_id = app.fn_current_user_id())',
            r.t, r.t
        );
    END LOOP;
END;
$$;

-- Bảng con: kế thừa quyền qua chu kỳ cha
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_daily_plans_own ON daily_plans
    USING (EXISTS (SELECT 1 FROM salary_cycles c
                    WHERE c.id = daily_plans.cycle_id
                      AND c.user_id = fn_current_user_id()));

ALTER TABLE cycle_fixed_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_cfe_own ON cycle_fixed_expenses
    USING (EXISTS (SELECT 1 FROM salary_cycles c
                    WHERE c.id = cycle_fixed_expenses.cycle_id
                      AND c.user_id = fn_current_user_id()));

ALTER TABLE planned_incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_planned_incomes_own ON planned_incomes
    USING (EXISTS (SELECT 1 FROM salary_cycles c
                    WHERE c.id = planned_incomes.cycle_id
                      AND c.user_id = fn_current_user_id()));

ALTER TABLE spending_template_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_str_own ON spending_template_rules
    USING (EXISTS (SELECT 1 FROM spending_templates st
                    WHERE st.id = spending_template_rules.template_id
                      AND st.user_id = fn_current_user_id()));


-- ============================================================================
-- 18. SEED — DANH MỤC MẶC ĐỊNH CHO USER MỚI  (Mục 4)
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_seed_default_categories(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = app, public AS $$
BEGIN
    INSERT INTO categories (user_id, kind, name, icon, is_essential, is_system, sort_order)
    VALUES
        -- Danh mục THU
        (p_user_id, 'INCOME',  'Lương',      '💰', false, true, 1),
        (p_user_id, 'INCOME',  'Thưởng',     '🎁', false, true, 2),
        (p_user_id, 'INCOME',  'Freelance',  '💻', false, true, 3),
        (p_user_id, 'INCOME',  'Hoàn tiền',  '↩️', false, true, 4),
        (p_user_id, 'INCOME',  'Thu khác',   '📥', false, true, 99),
        -- Danh mục CHI
        (p_user_id, 'EXPENSE', 'Ăn uống',    '🍜', false, true, 1),
        (p_user_id, 'EXPENSE', 'Cafe',       '☕', false, true, 2),
        (p_user_id, 'EXPENSE', 'Xăng xe',    '⛽', false, true, 3),
        (p_user_id, 'EXPENSE', 'Tiền trọ',   '🏠', true,  true, 4),
        (p_user_id, 'EXPENSE', 'Điện',       '💡', true,  true, 5),
        (p_user_id, 'EXPENSE', 'Nước',       '🚿', true,  true, 6),
        (p_user_id, 'EXPENSE', 'Internet',   '📶', true,  true, 7),
        (p_user_id, 'EXPENSE', 'Giải trí',   '🎬', false, true, 8),
        (p_user_id, 'EXPENSE', 'Mua sắm',    '🛍️', false, true, 9),
        (p_user_id, 'EXPENSE', 'Sức khỏe',   '🏥', false, true, 10),
        (p_user_id, 'EXPENSE', 'Khác',       '📦', false, true, 99)
    ON CONFLICT DO NOTHING;
END;
$$;

-- Tự seed danh mục ngay khi tạo user
-- SECURITY DEFINER: lúc đăng ký, app.current_user_id chưa được set nên RLS sẽ
-- chặn insert danh mục. Hàm này chạy bằng quyền owner để vượt qua.
CREATE OR REPLACE FUNCTION fn_after_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = app, public AS $$
BEGIN
    PERFORM fn_seed_default_categories(NEW.id);
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_user_seed_categories
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION fn_after_user_created();
