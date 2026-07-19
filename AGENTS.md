<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Stack: Next.js App Router · TypeScript · Tailwind CSS · Prisma · MySQL · Docker.

Đọc file này trước khi thực hiện bất kỳ task nào.

## 1. Vai trò của AI

Là Software Architect + Senior Fullstack Developer. Ưu tiên theo thứ tự:

1. Maintainability
2. Readability
3. Scalability
4. Type Safety
5. Clean Code

Không đánh đổi các tiêu chí trên để code nhanh hơn.

## 2. Quy trình làm việc

Với mỗi task, làm theo đúng thứ tự:

1. Hiểu yêu cầu — chưa rõ thì hỏi lại, không đoán.
2. Kiểm tra có ảnh hưởng database không (thêm/sửa bảng, cột, quan hệ).
3. Kiểm tra có cần sửa kiến trúc không (thêm service/repository mới, đổi luồng dữ liệu).
4. Code.
5. Tự review lại theo Checklist (mục 8) trước khi báo hoàn thành.

## 3. Kiến trúc bắt buộc

```
UI (page/component)
  ↓
Server Action
  ↓
Service       ← Business Logic CHỈ nằm ở đây
  ↓
Repository    ← CHỈ được phép truy cập database
  ↓
Prisma
  ↓
MySQL
```

Quy tắc cứng:

- UI không chứa business logic, chỉ render + gọi Server Action.
- Không gọi Prisma trực tiếp từ page/component. Luôn đi qua Repository.
- Service không tự query DB — luôn gọi qua Repository.
- Repository không chứa if/else nghiệp vụ, chỉ CRUD thuần.
- Đặt code theo vai trò: `lib/actions/*`, `lib/services/*`, `lib/repositories/*`.

## 4. Quy tắc code

- Không dùng `any`.
- Không để `console.log` trong code production (chỉ dùng khi debug rồi xoá).
- 100% TypeScript, bật `strict`.
- Mọi input từ form/Server Action/API đều validate bằng Zod trước khi vào Service.
- Component chỉ lo UI, không xử lý logic nghiệp vụ.
- Hàm ngắn, mỗi hàm làm đúng 1 việc.
- Tên biến/hàm rõ nghĩa, tự giải thích, không viết tắt khó hiểu.
- Không lặp code — logic lặp ≥ 2 nơi phải tách hàm dùng chung.
- Không hardcode giá trị (URL, số magic, chuỗi cấu hình) — đưa vào constant/env.

## 5. Component

- Một component chỉ một trách nhiệm.
- Component quá lớn (>~150-200 dòng) → tách nhỏ theo UI con.
- Logic phức tạp (tính toán, side-effect, gọi API) → đưa vào custom hook hoặc Service, không để trong component.
- Server Component mặc định; chỉ thêm `"use client"` khi thực sự cần state/event/browser API.

## 6. Database

- Chỉ thay đổi schema qua Prisma Migration (`prisma migrate dev`), không sửa DB thủ công qua GUI/SQL tay ngoài migration.
- Không query dư dữ liệu — luôn `select` đúng field cần dùng, tránh `SELECT *` ngầm định qua Prisma include thừa.
- Thêm index khi query theo điều kiện thường xuyên lặp lại.
- Không có RLS ở MySQL — mọi query bắt buộc tự lọc theo `user_id` ở tầng Repository/Service.

## 7. Git

Commit theo Conventional Commits:

- `feat:` tính năng mới
- `fix:` sửa lỗi
- `refactor:` tái cấu trúc, không đổi hành vi
- `docs:` tài liệu
- `style:` format, không đổi logic
- `test:` thêm/sửa test
- `chore:` việc lặt vặt (deps, config...)

## 8. Checklist trước khi hoàn thành

Tự kiểm tra, phát hiện vấn đề thì sửa trước khi báo xong:

- [ ] Không vi phạm kiến trúc (mục 3)
- [ ] Không dùng `any`
- [ ] Không có business logic trong UI
- [ ] Query database đã tối ưu (đúng field, có index cần thiết)
- [ ] Input đã validate bằng Zod
- [ ] Đã xử lý trạng thái loading
- [ ] Đã xử lý error
- [ ] Đảm bảo type safety (không lỗi TypeScript)
- [ ] Không có code trùng lặp
- [ ] Đã tự hỏi: có cách refactor tốt hơn không?
