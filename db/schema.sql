-- =====================================================================
--  DATABASE: QUẢN LÝ CHI TIÊU CÁ NHÂN  (Personal Finance Web App)
--  Engine  : MySQL 8.0.16+  |  InnoDB  |  utf8mb4
--  Nguyên tắc vàng:
--     Số dư tài khoản KHÔNG nhập tay -> luôn tính từ giao dịch
--     (trigger tự cập nhật current_balance) => dữ liệu nhất quán.
--
--  Lưu ý: database `expense_management` đã được tạo sẵn bởi container
--  Docker (biến MYSQL_DATABASE trong docker-compose.yml) — không
--  DROP/CREATE DATABASE ở đây để không phá huỷ dữ liệu khi chạy lại.
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+07:00';

USE expense_management;


-- =====================================================================
-- 1. USERS  (để sẵn cho nhiều người dùng / đăng nhập. App 1 người vẫn dùng 1 dòng)
-- =====================================================================
CREATE TABLE users (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(100)  NOT NULL,
  email          VARCHAR(190)  NOT NULL,
  password_hash  VARCHAR(255)  NOT NULL,
  currency       CHAR(3)       NOT NULL DEFAULT 'VND',
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
-- 2. ACCOUNTS  (Tài khoản: Tiền mặt, Thẻ, Momo...)  -> Mục 2
--    Tên | Loại | Số dư | Màu/Icon
-- =====================================================================
CREATE TABLE accounts (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(100) NOT NULL,                    -- Tên: "Thẻ Vietcombank"
  type            ENUM('cash','bank','ewallet','credit_card','savings','other')
                    NOT NULL DEFAULT 'other',               -- Loại tài khoản
  initial_balance DECIMAL(15,2) NOT NULL DEFAULT 0,         -- Số dư lúc mở (nhập 1 lần)
  current_balance DECIMAL(15,2) NOT NULL DEFAULT 0,         -- Số dư hiện tại (TRIGGER tự tính)
  icon            VARCHAR(50)  NULL,                        -- tên icon
  color           CHAR(7)      NULL,                        -- màu hex #RRGGBB
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order      INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_accounts_user (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
-- 3. CATEGORIES  (Danh mục Thu/Chi)  -> Mục 3
--    Tên | Icon | Màu | Loại (Thu/Chi).  parent_id: hỗ trợ danh mục con.
-- =====================================================================
CREATE TABLE categories (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  parent_id   BIGINT UNSIGNED NULL,                         -- danh mục cha (tùy chọn)
  name        VARCHAR(100) NOT NULL,
  type        ENUM('income','expense') NOT NULL,            -- Thu / Chi
  icon        VARCHAR(50) NULL,
  color       CHAR(7) NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_user   FOREIGN KEY (user_id)   REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
  KEY idx_categories_user_type (user_id, type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
-- 4. TRANSACTIONS  (Giao dịch)  -> Mục 4 & 6  (màn hình quan trọng nhất)
--    Loại | Danh mục | Tài khoản | Số tiền | Ngày | Ghi chú
--    Hỗ trợ thêm 'transfer' (chuyển khoản giữa 2 tài khoản).
-- =====================================================================
CREATE TABLE transactions (
  id               BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  type             ENUM('income','expense','transfer') NOT NULL,  -- Thu / Chi / Chuyển
  account_id       BIGINT UNSIGNED NOT NULL,                      -- tài khoản nguồn
  to_account_id    BIGINT UNSIGNED NULL,                          -- CHỈ dùng khi transfer
  category_id      BIGINT UNSIGNED NULL,                          -- NULL khi transfer
  amount           DECIMAL(15,2) NOT NULL,                        -- luôn > 0
  transaction_date DATE NOT NULL,                                 -- ngày nghiệp vụ (19/07...)
  note             VARCHAR(255) NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- dùng sắp xếp trong ngày
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tx_user     FOREIGN KEY (user_id)       REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_tx_account  FOREIGN KEY (account_id)    REFERENCES accounts(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_tx_toacc    FOREIGN KEY (to_account_id) REFERENCES accounts(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_tx_category FOREIGN KEY (category_id)   REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT chk_tx_amount  CHECK (amount > 0),
  CONSTRAINT chk_tx_transfer CHECK (
      (type = 'transfer' AND to_account_id IS NOT NULL AND to_account_id <> account_id)
   OR (type <> 'transfer' AND to_account_id IS NULL)
  ),
  KEY idx_tx_user_date  (user_id, transaction_date),   -- lọc theo KỲ (mục 5)
  KEY idx_tx_account    (account_id),
  KEY idx_tx_to_account (to_account_id),               -- bổ sung: cần cho sp_recalculate_balances
  KEY idx_tx_category   (category_id),
  KEY idx_tx_type_date  (user_id, type, transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
-- 5. TRIGGERS  -> tự động cập nhật số dư (Mục 7)
-- =====================================================================
DELIMITER $$

-- Khi tạo tài khoản: current_balance khởi tạo = initial_balance
CREATE TRIGGER trg_accounts_bi BEFORE INSERT ON accounts
FOR EACH ROW
BEGIN
  SET NEW.current_balance = NEW.initial_balance;
END$$

-- Thêm giao dịch
CREATE TRIGGER trg_tx_ai AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
  IF NEW.type = 'income' THEN
    UPDATE accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.account_id;
  ELSEIF NEW.type = 'expense' THEN
    UPDATE accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
  ELSEIF NEW.type = 'transfer' THEN
    UPDATE accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
    UPDATE accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.to_account_id;
  END IF;
END$$

-- Xoá giao dịch: hoàn tác ảnh hưởng
CREATE TRIGGER trg_tx_ad AFTER DELETE ON transactions
FOR EACH ROW
BEGIN
  IF OLD.type = 'income' THEN
    UPDATE accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.account_id;
  ELSEIF OLD.type = 'expense' THEN
    UPDATE accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
  ELSEIF OLD.type = 'transfer' THEN
    UPDATE accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
    UPDATE accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.to_account_id;
  END IF;
END$$

-- Sửa giao dịch: hoàn tác bản CŨ rồi áp bản MỚI (xử lý cả khi đổi tài khoản/loại/số tiền)
CREATE TRIGGER trg_tx_au AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
  -- (1) hoàn tác OLD
  IF OLD.type = 'income' THEN
    UPDATE accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.account_id;
  ELSEIF OLD.type = 'expense' THEN
    UPDATE accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
  ELSEIF OLD.type = 'transfer' THEN
    UPDATE accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
    UPDATE accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.to_account_id;
  END IF;
  -- (2) áp NEW
  IF NEW.type = 'income' THEN
    UPDATE accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.account_id;
  ELSEIF NEW.type = 'expense' THEN
    UPDATE accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
  ELSEIF NEW.type = 'transfer' THEN
    UPDATE accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
    UPDATE accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.to_account_id;
  END IF;
END$$

DELIMITER ;


-- =====================================================================
-- 6. STORED PROCEDURE  -> tính lại toàn bộ số dư (an toàn / phòng lệch)
--    Gọi: CALL sp_recalculate_balances(NULL);   -- tất cả user
--         CALL sp_recalculate_balances(1);      -- 1 user
-- =====================================================================
DELIMITER $$
CREATE PROCEDURE sp_recalculate_balances(IN p_user_id BIGINT UNSIGNED)
BEGIN
  UPDATE accounts a
  SET a.current_balance = a.initial_balance + (
     SELECT COALESCE(SUM(
        CASE
          WHEN t.type='income'   AND t.account_id    = a.id THEN  t.amount
          WHEN t.type='expense'  AND t.account_id    = a.id THEN -t.amount
          WHEN t.type='transfer' AND t.account_id    = a.id THEN -t.amount
          WHEN t.type='transfer' AND t.to_account_id = a.id THEN  t.amount
          ELSE 0
        END), 0)
     FROM transactions t
     WHERE t.account_id = a.id OR t.to_account_id = a.id
  )
  WHERE (p_user_id IS NULL OR a.user_id = p_user_id);
END$$
DELIMITER ;


-- =====================================================================
-- 7. VIEWS  -> tiện cho Sidebar / Giao dịch / Dashboard
-- =====================================================================

-- Tổng tài sản + chia theo Tiền mặt / Thẻ (Sidebar - mục 1)
CREATE OR REPLACE VIEW v_asset_summary AS
SELECT
  user_id,
  SUM(current_balance)                                             AS total_assets,
  SUM(CASE WHEN type = 'cash' THEN current_balance ELSE 0 END)     AS cash_total,
  SUM(CASE WHEN type <> 'cash' THEN current_balance ELSE 0 END)    AS card_total
FROM accounts
WHERE is_active = 1
GROUP BY user_id;

-- Giao dịch đã "nối tên" tài khoản + danh mục (dùng cho màn Giao dịch / Báo cáo)
CREATE OR REPLACE VIEW v_transactions_detail AS
SELECT
  t.id, t.user_id, t.type, t.transaction_date, t.amount, t.note, t.created_at,
  a.name  AS account_name,  a.type AS account_type,
  ta.name AS to_account_name,
  c.name  AS category_name, c.type AS category_type,
  c.icon  AS category_icon, c.color AS category_color
FROM transactions t
JOIN accounts a       ON a.id  = t.account_id
LEFT JOIN accounts ta ON ta.id = t.to_account_id
LEFT JOIN categories c ON c.id = t.category_id;


-- =====================================================================
-- 8. SEED DATA  -> tài khoản & danh mục mặc định (mục 2 & 3)
-- =====================================================================
INSERT INTO users (name, email, password_hash)
VALUES ('Demo', 'demo@example.com', '$2y$10$replace_with_real_hash');
SET @uid = LAST_INSERT_ID();

-- Tài khoản mặc định: Tiền mặt + Thẻ (số dư ví dụ 11.857.000)
INSERT INTO accounts (user_id, name, type, initial_balance, icon, color, sort_order) VALUES
(@uid, 'Tiền mặt', 'cash', 0,        'cash', '#22c55e', 1),
(@uid, 'Thẻ',      'bank', 11857000, 'card', '#3b82f6', 2);

-- Danh mục CHI
INSERT INTO categories (user_id, name, type, icon, color, sort_order) VALUES
(@uid, 'Bách hóa',  'expense', 'basket',   '#f97316', 1),
(@uid, 'Ăn uống',   'expense', 'food',     '#ef4444', 2),
(@uid, 'Điện nước', 'expense', 'bolt',     '#eab308', 3),
(@uid, 'Xăng xe',   'expense', 'fuel',     '#84cc16', 4),
(@uid, 'Phòng trọ', 'expense', 'home',     '#06b6d4', 5),
(@uid, 'Mua sắm',   'expense', 'bag',      '#ec4899', 6),
(@uid, 'Giải trí',  'expense', 'game',     '#a855f7', 7);

-- Danh mục THU
INSERT INTO categories (user_id, name, type, icon, color, sort_order) VALUES
(@uid, 'Lương',     'income', 'salary', '#16a34a', 1),
(@uid, 'Thưởng',    'income', 'gift',   '#0ea5e9', 2),
(@uid, 'Làm thêm',  'income', 'work',   '#14b8a6', 3),
(@uid, 'Bán đồ',    'income', 'sell',   '#f59e0b', 4),
(@uid, 'Được cho',  'income', 'heart',  '#f43f5e', 5);


-- =====================================================================
-- 9. MỞ RỘNG (tùy chọn - GIAI ĐOẠN SAU, không cần dùng ngay)
--     Tạo sẵn để sau khỏi phải migrate: Ngân sách & Giao dịch định kỳ.
-- =====================================================================
CREATE TABLE budgets (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL,                 -- NULL = ngân sách tổng
  amount      DECIMAL(15,2) NOT NULL,
  period      ENUM('monthly','weekly','yearly') NOT NULL DEFAULT 'monthly',
  start_date  DATE NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_budget_cat  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recurring_transactions (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  type         ENUM('income','expense') NOT NULL,
  account_id   BIGINT UNSIGNED NOT NULL,
  category_id  BIGINT UNSIGNED NULL,
  amount       DECIMAL(15,2) NOT NULL,
  frequency    ENUM('daily','weekly','monthly','yearly') NOT NULL,
  next_run     DATE NOT NULL,
  note         VARCHAR(255) NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recur_user FOREIGN KEY (user_id)    REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_recur_acc  FOREIGN KEY (account_id) REFERENCES accounts(id)   ON DELETE CASCADE,
  CONSTRAINT fk_recur_cat  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
