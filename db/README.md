# Ghi chú về `db/schema.sql` vs Prisma Migration

`prisma/migrations/0_init/` đã được baseline để khớp với DB đang chạy (tạo bằng `prisma migrate diff` + `prisma migrate resolve --applied`). Từ giờ, mọi thay đổi bảng/cột/index đi qua `npx prisma migrate dev`.

**Ngoại lệ có chủ đích**: các object sau trong `db/schema.sql` **không** và **không thể** nằm trong lịch sử Prisma Migration, vì cú pháp `DELIMITER $$ ... END$$` (dùng để định nghĩa trigger/procedure nhiều câu lệnh) là cú pháp riêng của MySQL CLI client, không phải SQL hợp lệ mà Prisma's migration engine hiểu được:

- Trigger: `trg_accounts_bi`, `trg_tx_ai`, `trg_tx_ad`, `trg_tx_au`
- Stored procedure: `sp_recalculate_balances`
- View: `v_asset_summary`, `v_transactions_detail`

Các object này đã được áp dụng 1 lần bằng tay vào container Docker (`docker exec ... mysql ... < db/schema.sql`). Nếu cần sửa chúng sau này, phải sửa trực tiếp trong `db/schema.sql` rồi áp dụng lại bằng tay theo cách tương tự — **không** đưa vào `prisma migrate dev`.
