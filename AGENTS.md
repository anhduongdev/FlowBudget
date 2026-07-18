<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 📐 Coding Standard — Expense Management

> **Phạm vi áp dụng**: tài liệu này là quy chuẩn **bắt buộc** cho toàn bộ codebase của dự án `expense-management`. Áp dụng cho mọi người tạo/sửa code — lập trình viên và AI assistant (Claude, ChatGPT, Copilot...). Mọi PR/commit không tuân thủ tài liệu này cần được sửa lại trước khi merge.
>
> **Stack**: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Prisma 7 (`@prisma/adapter-pg`) · PostgreSQL chạy local qua Docker · ESLint 9 (flat config).
>
> **📌 Trạng thái áp dụng hiện tại**: repo hiện chưa có `src/`, `features/`, `shared/services`, `shared/repositories`, `zod`, `zustand`, `shadcn/ui`. Cấu trúc ở mục 2 là **chuẩn mục tiêu**. Việc migrate code hiện có (`app/`, `lib/prisma.ts`) sang cấu trúc này cần được xác nhận riêng trước khi thực hiện hàng loạt — xem "Nguyên tắc dành cho AI" ở mục 22.

## Mục lục

1. [Triết lý phát triển](#1-triết-lý-phát-triển-)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục-)
3. [Quy tắc đặt tên](#3-quy-tắc-đặt-tên-️)
4. [Quy tắc Component](#4-quy-tắc-component-)
5. [Quy tắc Business Logic](#5-quy-tắc-business-logic-)
6. [Quy tắc Database](#6-quy-tắc-database-️)
7. [Quy tắc API](#7-quy-tắc-api-)
8. [Validation](#8-validation-)
9. [TypeScript](#9-typescript-)
10. [Import](#10-import-)
11. [Async](#11-async-)
12. [Error Handling](#12-error-handling-)
13. [Logging](#13-logging-)
14. [Environment](#14-environment-)
15. [State Management](#15-state-management-)
16. [UI](#16-ui-)
17. [Code Style](#17-code-style-️)
18. [Hiệu năng](#18-hiệu-năng-)
19. [Security](#19-security-)
20. [Git](#20-git-)
21. [Checklist trước khi commit](#21-checklist-trước-khi-commit-)
22. [Quy tắc dành cho AI](#22-quy-tắc-dành-cho-ai-)

---

## 1. Triết lý phát triển 🧭

| Nguyên tắc | Ý nghĩa | Áp dụng trong Next.js |
|---|---|---|
| **Clean Code** | Code đọc như văn xuôi, tên gọi rõ nghĩa, không cần đoán | Đặt tên biến/hàm mô tả đúng hành vi; tránh viết tắt khó hiểu (`d`, `tmp`, `data2`) |
| **SOLID** *(áp dụng phần phù hợp)* | 5 nguyên tắc OOP kinh điển | Xem chi tiết bên dưới |
| **DRY** | Don't Repeat Yourself | Logic lặp ≥ 2 nơi → tách hàm dùng chung trong `shared/utils` hoặc `shared/services` |
| **KISS** | Keep It Simple, Stupid | Chọn giải pháp đơn giản nhất giải quyết đúng vấn đề, không tối ưu sớm |
| **YAGNI** | You Aren't Gonna Need It | Không xây abstraction/config cho tính năng "có thể sẽ cần" trong tương lai |
| **Convention over Configuration** | Theo quy ước có sẵn thay vì tự chế | Next.js đã quy ước file-based routing (`page.tsx`, `route.ts`...) — tuân theo thay vì tự viết router riêng |

### SOLID áp dụng cho Next.js

- **S — Single Responsibility**: 1 component chỉ render UI; 1 service chỉ chứa business logic của 1 domain; 1 repository chỉ thao tác 1 bảng/aggregate.
- **O — Open/Closed**: mở rộng UI bằng composition (props, children, slot) thay vì sửa component gốc mỗi khi có case mới.
- **L — Liskov Substitution**: khi có interface dùng chung (vd `Repository<T>`), mọi implementation phải thay thế được cho nhau mà không phá logic gọi nó.
- **I — Interface Segregation**: không ép component nhận 1 prop object khổng lồ chứa dữ liệu nó không dùng tới — chia nhỏ prop theo nhu cầu thực tế.
- **D — Dependency Inversion**: Service phụ thuộc vào interface Repository, không phụ thuộc trực tiếp vào Prisma Client — giúp test/mock dễ dàng.

> ⚠️ Không áp dụng SOLID một cách giáo điều. Next.js là framework hàm/component-first, không phải OOP thuần — chỉ vay mượn tinh thần (tách trách nhiệm, giảm phụ thuộc chéo), không ép code thành class nếu function đã đủ rõ ràng.

---

## 2. Cấu trúc thư mục 📁

```text
src/
├── app/                        # App Router — CHỈ routing & compose UI, KHÔNG business logic
│   ├── (dashboard)/
│   │   └── expenses/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       ├── error.tsx
│   │       └── _components/    # component riêng của route này, không dùng nơi khác
│   ├── api/
│   │   └── expenses/route.ts   # API Route Handler
│   ├── layout.tsx
│   └── globals.css
│
├── features/                   # Domain theo tính năng nghiệp vụ
│   └── expense/
│       ├── components/         # UI riêng của feature, có thể dùng ở nhiều route
│       ├── hooks/               # hook riêng của feature (useExpenseFilters...)
│       └── types.ts             # type riêng của feature
│
├── shared/                     # Code dùng chung toàn app, không thuộc riêng feature nào
│   ├── components/              # UI thuần tái sử dụng (Button, Input, DataTable...) — nền tảng shadcn/ui
│   ├── hooks/                   # custom hook dùng chung (useDebounce, useMediaQuery...)
│   ├── services/                # ⭐ Business logic layer
│   ├── repositories/            # ⭐ Data access layer — nơi DUY NHẤT được import Prisma Client
│   ├── types/                   # type/interface dùng chung nhiều feature
│   ├── constants/                # hằng số (routes, enum giá trị cố định...)
│   ├── utils/                    # pure function, không side-effect (formatCurrency, slugify...)
│   └── config/                   # env.ts, site.config.ts, prisma.ts (singleton)
│
└── prisma/
    ├── schema.prisma
    └── migrations/
```

| Thư mục | Nhiệm vụ | Được phép | Không được phép |
|---|---|---|---|
| `app/` | Routing, layout, compose Server/Client Component | Gọi `service` để lấy data, render UI | Viết business logic, query Prisma trực tiếp |
| `features/*` | Tập hợp code đặc thù cho 1 domain nghiệp vụ | Component/hook/type riêng của feature | Được import bởi feature khác (nếu cần dùng chung → chuyển lên `shared/`) |
| `shared/components` | UI atom/molecule tái sử dụng | Nhận data qua props, thuần render | Gọi service/repository, biết về business logic |
| `shared/services` | Business logic, orchestration | Gọi 1 hoặc nhiều repository, áp rule nghiệp vụ | Query SQL/Prisma trực tiếp, import từ `app/` |
| `shared/repositories` | Data access | Gọi Prisma Client, map dữ liệu DB ↔ domain model | Chứa if/else nghiệp vụ, gọi service khác |
| `shared/types` | Type/interface dùng ≥ 2 feature | Type thuần | Logic |
| `shared/constants` | Giá trị cố định | `as const`, enum | Giá trị thay đổi theo runtime (→ dùng `config`) |
| `shared/utils` | Hàm thuần, dễ unit test | Input → Output, không gọi API/DB | Side-effect, gọi Prisma |
| `shared/config` | Cấu hình app, đọc env | `env.ts`, `prisma.ts` | Business logic |

**Nguyên tắc chung**: không tạo thư mục/abstraction mới khi chưa có ít nhất 2–3 chỗ dùng chung (YAGNI). Feature mới bắt đầu code thẳng trong `features/<tên>/`; chỉ "promote" lên `shared/` khi ≥ 2 feature cần dùng.

---

## 3. Quy tắc đặt tên 🏷️

| Đối tượng | Convention | ✅ Đúng | ❌ Sai |
|---|---|---|---|
| File component | `PascalCase.tsx` | `ExpenseCard.tsx` | `expense_card.tsx`, `expenseCard.tsx` |
| File route (quy ước Next.js) | tên reserved của Next.js | `page.tsx`, `layout.tsx`, `route.ts` | `Page.tsx`, `Route.ts` |
| File hook/util/service/repository | `kebab-case.ts` | `use-expense-list.ts`, `expense-service.ts` | `UseExpenseList.ts`, `ExpenseService.ts` (file) |
| Component | `PascalCase`, danh từ rõ nghĩa | `ExpenseCard`, `ExpenseForm` | `Card1`, `Data`, `Comp` |
| Hook | `camelCase`, tiền tố `use` | `useExpenseList`, `useDebounce` | `getExpenseList`, `ExpenseListHook` |
| Service | `PascalCase` + hậu tố `Service` | `ExpenseService` | `Expense`, `ExpenseHelper` |
| Repository | `PascalCase` + hậu tố `Repository` | `ExpenseRepository` | `ExpenseDb`, `ExpenseDAO` |
| Interface | `PascalCase`, không tiền tố `I` | `Expense`, `CreateExpenseInput` | `IExpense` |
| Type alias | `PascalCase` | `ExpenseStatus` | `expenseStatus`, `expense_status` |
| Enum | `PascalCase` tên; member `PascalCase` | `enum ExpenseStatus { Pending, Approved }` | `enum expense_status { PENDING, approved }` |
| Biến | `camelCase`, danh từ | `totalAmount`, `userList` | `Total_amount`, `lst` |
| Biến boolean | tiền tố `is/has/should/can` | `isLoading`, `hasError` | `loading`, `error` (mơ hồ giữa state và giá trị lỗi) |
| Function | `camelCase`, động từ + danh từ | `calculateTotal()`, `fetchExpenses()` | `total()`, `data()` |
| Constant cố định module-level | `UPPER_SNAKE_CASE` | `MAX_UPLOAD_SIZE_MB` | `maxUploadSizeMb` |
| Object cấu hình | `camelCase` | `appConfig`, `siteConfig` | `AppConfig` (trùng convention type) |
| API route path | `kebab-case`, danh từ số nhiều cho resource | `/api/expense-categories` | `/api/ExpenseCategory`, `/api/getExpenses` |

> Quy tắc chọn tên: **tên phải trả lời được "cái này dùng để làm gì" mà không cần đọc thân hàm**. Nếu phải viết comment giải thích tên biến/hàm nghĩa là tên đó chưa đủ tốt.

---

## 4. Quy tắc Component 🧩

- **Một component — một nhiệm vụ.** `ExpenseCard` chỉ hiển thị 1 expense; không kiêm luôn fetch data, tính toán tổng, và xử lý form trong cùng file.
- **Giới hạn kích thước**: component không vượt quá **~200 dòng**. Vượt quá → tách theo UI con hoặc theo logic (custom hook).
- **Khi nào tách component**:
  - Một đoạn JSX lặp lại ở ≥ 2 nơi.
  - Một phần UI có state/behavior riêng biệt (vd: dropdown, modal con).
  - Component cha phải truyền quá 3 cấp prop xuống cháu (prop drilling) → tách + đưa state lên đúng chỗ hoặc dùng composition.
- **Server Component (mặc định)**: dùng khi chỉ cần đọc data và render — không có state, không có event handler.
- **Client Component (`"use client"`)**: chỉ dùng khi cần `useState`/`useReducer`, `useEffect`, event handler (`onClick`, `onChange`...), hoặc API trình duyệt (`window`, `localStorage`).
- **Không lạm dụng `"use client"`**: đặt ở component lá (leaf) nhỏ nhất cần tương tác, không đánh dấu cả `page.tsx`/`layout.tsx` là client chỉ vì có 1 nút bấm bên trong.

```tsx
// ❌ Sai — cả page bị kéo thành Client Component chỉ vì 1 nút bấm
"use client";

export default function ExpensePage({ expenses }: { expenses: Expense[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ExpenseList expenses={expenses} />
      <button onClick={() => setOpen(true)}>Thêm chi tiêu</button>
      {open && <ExpenseFormModal onClose={() => setOpen(false)} />}
    </div>
  );
}
```

```tsx
// ✅ Đúng — page vẫn là Server Component, chỉ phần cần tương tác là Client Component
// app/(dashboard)/expenses/page.tsx
export default async function ExpensePage() {
  const expenses = await expenseService.getAll();
  return (
    <div>
      <ExpenseList expenses={expenses} />
      <AddExpenseButton />
    </div>
  );
}

// app/(dashboard)/expenses/_components/AddExpenseButton.tsx
"use client";
export function AddExpenseButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Thêm chi tiêu</button>
      {open && <ExpenseFormModal onClose={() => setOpen(false)} />}
    </>
  );
}
```

---

## 5. Quy tắc Business Logic 💼

**Business logic KHÔNG được đặt trong:**
- `page.tsx` / `layout.tsx`
- API Route (`route.ts`)
- Component (Server hoặc Client)

**Business logic BẮT BUỘC nằm trong Service.** Repository chỉ được phép thao tác Database (CRUD thuần, không điều kiện nghiệp vụ).

```ts
// ❌ Sai — business logic (tính discount, kiểm tra hạn mức) nằm trong route
// app/api/expenses/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const monthlyTotal = await prisma.expense.aggregate({ _sum: { amount: true } /* ... */ });
  if (monthlyTotal._sum.amount! + body.amount > body.budgetLimit) {
    return Response.json({ error: "Vượt hạn mức" }, { status: 400 });
  }
  const expense = await prisma.expense.create({ data: body });
  return Response.json(expense);
}
```

```ts
// ✅ Đúng — route chỉ validate + gọi service + trả response
// app/api/expenses/route.ts
export async function POST(req: Request) {
  const input = createExpenseSchema.parse(await req.json());
  const expense = await expenseService.create(input);
  return Response.json(expense, { status: 201 });
}

// shared/services/expense-service.ts — business logic ở đây
export const expenseService = {
  async create(input: CreateExpenseInput) {
    const monthlyTotal = await expenseRepository.sumByMonth(input.userId, input.date);
    if (monthlyTotal + input.amount > input.budgetLimit) {
      throw new AppError("BUDGET_EXCEEDED", "Vượt hạn mức chi tiêu tháng này");
    }
    return expenseRepository.create(input);
  },
};

// shared/repositories/expense-repository.ts — chỉ thao tác DB
export const expenseRepository = {
  create(input: CreateExpenseInput) {
    return prisma.expense.create({ data: input });
  },
  sumByMonth(userId: string, date: Date) {
    /* prisma.aggregate thuần, không điều kiện nghiệp vụ */
  },
};
```

---

## 6. Quy tắc Database 🗄️

- **Prisma Client là singleton duy nhất** — khởi tạo 1 lần tại `shared/config/prisma.ts`, import qua `@/shared/config/prisma`. Không bao giờ `new PrismaClient()` ở nơi khác (gây leak connection trên serverless).
- **Repository Pattern bắt buộc**: mọi Prisma query nằm trong `shared/repositories/*`. Service gọi Repository; Component/Route Handler không bao giờ import Prisma trực tiếp.
- **Không query database trực tiếp trong component** — kể cả Server Component.
- Sau khi sửa `prisma/schema.prisma`: chạy `npx prisma generate` rồi `npx prisma migrate dev --name <mô_tả>`.
- Cả Migrate (`prisma.config.ts`) lẫn runtime (`PrismaClient` qua driver adapter `@prisma/adapter-pg`) đều dùng chung `DATABASE_URL` trỏ tới Postgres chạy trong Docker (local dev).

```ts
// ✅ shared/repositories/expense-repository.ts
import { prisma } from "@/shared/config/prisma";
import type { CreateExpenseInput } from "@/features/expense/types";

export const expenseRepository = {
  findAll(userId: string) {
    return prisma.expense.findMany({ where: { userId }, orderBy: { date: "desc" } });
  },
  create(input: CreateExpenseInput) {
    return prisma.expense.create({ data: input });
  },
};
```

---

## 7. Quy tắc API 🌐

API Route (`route.ts`) chỉ có 3 nhiệm vụ, đúng thứ tự:

1. **Validate** input (Zod).
2. **Gọi Service** tương ứng.
3. **Trả Response** đã chuẩn hoá.

Không chứa business logic (xem mục 5).

```ts
// ✅ app/api/expenses/route.ts
import { NextResponse } from "next/server";
import { createExpenseSchema } from "@/features/expense/schemas";
import { expenseService } from "@/shared/services/expense-service";
import { handleApiError } from "@/shared/utils/handle-api-error";

export async function POST(request: Request) {
  try {
    const input = createExpenseSchema.parse(await request.json());
    const expense = await expenseService.create(input);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 8. Validation ✅

- Dùng **Zod** cho toàn bộ input: form, Server Action, API Route — kể cả biến môi trường (mục 14).
- **Không validate thủ công** bằng chuỗi `if/else` rời rạc (`if (!body.amount) ...`).
- Định nghĩa schema cạnh domain (`features/expense/schemas.ts`), suy type bằng `z.infer` thay vì viết type tay trùng lặp.

```ts
// ✅ features/expense/schemas.ts
import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive("Số tiền phải lớn hơn 0"),
  category: z.string().min(1),
  date: z.coerce.date(),
  note: z.string().max(500).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
```

> 📦 Ghi chú: `zod` chưa có trong `package.json` — cần `npm install zod` trước khi áp dụng mục này (xem mục 22, AI không tự ý cài khi chưa hỏi).

---

## 9. TypeScript 🔷

- `strict: true` đã bật trong `tsconfig.json` — không tắt.
- **Không dùng `any`.** Nếu kiểu dữ liệu chưa rõ, dùng `unknown` rồi narrow bằng type guard.
- **Ưu tiên type inference**: để TypeScript tự suy ra type từ Zod (`z.infer<...>`) và Prisma (`Prisma.ExpenseGetPayload<...>`) thay vì định nghĩa lại field thủ công — tránh lệch schema.
- **Không dùng `@ts-ignore`** trừ khi thật sự cần (bug của thư viện ngoài, giới hạn kỹ thuật) — khi dùng phải kèm comment giải thích lý do ngay trên dòng đó.

```ts
// ❌ Sai
function getTotal(items: any[]) {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

// ✅ Đúng
function getTotal(items: Expense[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}
```

---

## 10. Import 📥

Thứ tự import chuẩn, mỗi nhóm cách nhau 1 dòng trống:

```ts
// 1. React
import { useState } from "react";

// 2. Next.js
import Link from "next/link";
import { NextResponse } from "next/server";

// 3. Third-party
import { z } from "zod";

// 4. Nội bộ — lib/services/hooks/components/types (alias @/)
import { expenseService } from "@/shared/services/expense-service";
import { useExpenseFilters } from "@/features/expense/hooks/use-expense-filters";
import { ExpenseCard } from "@/shared/components/ExpenseCard";
import type { Expense } from "@/shared/types/expense";

// 5. Relative import cùng thư mục (hạn chế, chỉ cho file colocate)
import { ExpenseRow } from "./ExpenseRow";

// 6. CSS
import "./styles.css";
```

Luôn dùng alias `@/...`, tránh `../../../` (relative sâu ≥ 2 cấp).

---

## 11. Async ⏳

- Ưu tiên `async/await`, tránh chain `.then()/.catch()` nhiều tầng gây khó đọc.
- Tác vụ độc lập chạy song song bằng `Promise.all`, không `await` tuần tự không cần thiết.

```ts
// ❌ Sai
function loadData() {
  return fetchExpenses().then((expenses) => {
    return fetchBudget().then((budget) => ({ expenses, budget }));
  });
}

// ❌ Sai — await tuần tự dù 2 tác vụ độc lập
const expenses = await fetchExpenses();
const budget = await fetchBudget();

// ✅ Đúng
async function loadData() {
  const [expenses, budget] = await Promise.all([fetchExpenses(), fetchBudget()]);
  return { expenses, budget };
}
```

---

## 12. Error Handling 🚨

- **Không `throw` Error bừa bãi** (`throw "lỗi rồi"`, `throw new Error("fail")` không rõ ngữ cảnh).
- Định nghĩa **`AppError`** dùng chung, có `code` + `statusCode` + `message`.
- Chuẩn hoá response lỗi ở 1 chỗ (`handleApiError`), không mỗi route tự format khác nhau.

```ts
// shared/utils/app-error.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// shared/utils/handle-api-error.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./app-error";

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: error.issues } }, { status: 422 });
  }
  if (error instanceof AppError) {
    return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.statusCode });
  }
  console.error(error); // lỗi không lường trước — cần log để điều tra
  return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Đã có lỗi xảy ra" } }, { status: 500 });
}
```

---

## 13. Logging 📝

- **Không để `console.log` trong code production** — bật ESLint rule `no-console` (cho phép `console.warn`/`console.error`).
- Log lỗi không lường trước tại boundary xử lý lỗi (xem mục 12), không log rải rác trong logic nghiệp vụ.

---

## 14. Environment 🔐

- **Không gọi `process.env.X` rải rác** khắp codebase.
- Tạo `shared/config/env.ts` — validate toàn bộ biến môi trường bằng Zod ngay khi module được load (fail fast nếu thiếu biến, thay vì lỗi runtime mơ hồ lúc dùng).

```ts
// shared/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

Toàn bộ code khác import `env` từ file này (`import { env } from "@/shared/config/env"`) thay vì `process.env` trực tiếp.

---

## 15. State Management 🧠

Thứ tự ưu tiên, từ trên xuống:

1. **Server Component** — data từ DB nên nằm ở đây, không đưa vào state client nếu không cần tương tác.
2. **URL state** (`searchParams`) — cho filter/pagination/tab, giúp share link và không cần state client.
3. **React Context** — state client nhỏ, ít thay đổi (theme, current user session).
4. **Zustand** — chỉ khi state phức tạp, được chia sẻ ở nhiều component không liên quan cây cha-con, và Context gây re-render thừa.

- **Không lạm dụng Global State** cho dữ liệu có thể lấy trực tiếp từ Server Component hoặc URL.

---

## 16. UI 🎨

- Dùng **shadcn/ui** làm nền component (Button, Input, Dialog, DataTable...), tuỳ biến qua Tailwind thay vì viết lại từ đầu.
- **Tailwind CSS** cho toàn bộ styling — không viết CSS module/inline style trừ khi Tailwind không đáp ứng được (animation phức tạp...).
- **Không hardcode màu** (`#3b82f6`, `rgb(...)`) trong component.
- Ưu tiên **Design Token** — dùng biến theme Tailwind (`bg-primary`, `text-muted-foreground`, `border-input`...) định nghĩa tập trung trong `globals.css`/theme config.

```tsx
// ❌ Sai
<div style={{ backgroundColor: "#ef4444", color: "#fff" }}>Vượt hạn mức</div>

// ✅ Đúng
<div className="bg-destructive text-destructive-foreground">Vượt hạn mức</div>
```

---

## 17. Code Style ✏️

- **Function ngắn** (~≤ 40 dòng), làm đúng 1 việc — tên hàm mô tả đúng việc đó.
- **Component nhỏ** (~≤ 200 dòng) — xem mục 4.
- **Không lặp code** — logic lặp ≥ 2 nơi phải tách hàm/hook dùng chung.
- **Ưu tiên readability hơn "code ngắn"** — không code-golf, không viết 1 dòng dồn 3 toán tử ba ngôi lồng nhau.

---

## 18. Hiệu năng ⚡

| Kỹ thuật | Khi nào dùng |
|---|---|
| **Server Component trước, Client Component sau** | Mặc định cho mọi component mới — giảm JS gửi về trình duyệt |
| **`next/dynamic`** | Component nặng/hiếm dùng (chart, rich-text editor, modal phức tạp) |
| **`React.memo`/`useMemo`/`useCallback`** | Chỉ khi đã đo được vấn đề re-render thật sự, không thêm "phòng ngừa" |
| **Pagination / cursor** | Danh sách lớn — không `findMany()` toàn bộ bảng |
| **`next/image`** | Mọi hình ảnh — không dùng thẻ `<img>` thô |
| **Lazy loading** | Nội dung dưới fold, `dynamic(() => import(...), { loading: ... })` |

---

## 19. Security 🔒

- **Không lộ Secret Key** — `DATABASE_URL` chỉ tồn tại phía server, không log ra console, không trả về response.
- **Validate toàn bộ input** bằng Zod tại boundary (API Route/Server Action) — xem mục 8.
- **Escape dữ liệu** khi render nội dung do user nhập; không dùng `dangerouslySetInnerHTML` với dữ liệu chưa qua sanitize.
- **Không tin dữ liệu từ client** — kể cả khi đã validate ở frontend, backend phải validate lại (client có thể bị bypass).
- Kiểm tra **authorization** (user có quyền với resource không) ở tầng Service, không chỉ ẩn nút trên UI.

---

## 20. Git 🌳

- **Commit message** theo [Conventional Commits](https://www.conventionalcommits.org/): `feat|fix|refactor|docs|chore|test(scope): mô tả ngắn`.
  - Ví dụ: `feat(expense): thêm validate hạn mức chi tiêu tháng`
- **Branch**: `feature/<tên>`, `fix/<tên>`, `chore/<tên>`, tạo từ `main`.
- **Không commit `.env`/`.env.local`** — đã có trong `.gitignore` (`.env.example` là ngoại lệ được phép commit).
- PR nhỏ, tập trung 1 mục đích, dễ review.

---

## 21. Checklist trước khi commit ✅

- [ ] Không còn `console.log`
- [ ] Đã format code (Prettier/editor format on save)
- [ ] Đã chạy `npm run lint` — không còn lỗi/warning
- [ ] Đã chạy `npm run build` — build thành công
- [ ] Đã test chức năng thủ công (golden path + edge case chính)
- [ ] Không còn `any`
- [ ] Không còn `TODO` chưa xử lý (hoặc đã note rõ trong issue tracker)
- [ ] Không commit file `.env`/secret
- [ ] Business logic không nằm trong `page.tsx`/`route.ts`/component (mục 5)

---

## 22. Quy tắc dành cho AI 🤖

> Đây là phần **quan trọng nhất** của tài liệu — áp dụng cho Claude, ChatGPT, Copilot hoặc bất kỳ AI assistant nào tạo/sửa code trong repo này.

Khi AI tạo hoặc chỉnh sửa code, **bắt buộc**:

- ❌ Không tự ý đổi cấu trúc project (vd: migrate `app/`/`lib/` hiện tại sang `src/` ở mục 2) nếu chưa được yêu cầu rõ ràng — phải hỏi trước.
- ❌ Không đổi tên file nếu không được yêu cầu.
- ❌ Không thêm thư viện mới (`zod`, `zustand`, `shadcn/ui`...) nếu chưa hỏi, kể cả khi tài liệu này khuyến nghị dùng.
- ✅ Luôn tái sử dụng component có sẵn thay vì viết mới trùng chức năng.
- ✅ Không viết component quá 200 dòng.
- ✅ Không viết function quá 40 dòng.
- ✅ Không duplicate code — tách hàm/hook dùng chung khi phát hiện lặp.
- ✅ Ưu tiên code dễ đọc hơn code ngắn.
- ✅ Nếu có nhiều cách giải quyết, chọn cách đơn giản nhất (KISS).
- ✅ Luôn giải thích rõ lý do nếu quyết định thay đổi kiến trúc/pattern hiện có.
- ✅ Khi sửa code, chỉ sửa đúng phần được yêu cầu — không "tiện tay" refactor phần không liên quan.
- ✅ Không làm ảnh hưởng đến các chức năng khác đang hoạt động.
- ✅ Nếu thiếu thông tin để quyết định đúng, phải hỏi lại trước khi code thay vì đoán.
