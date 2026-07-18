import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// options.schema chỉ để Prisma biết tên schema mặc định (metadata), KHÔNG set search_path
// thật cho connection — vẫn phải tự set qua `options` của pg, nếu không mọi query unqualified
// (SELECT * FROM wallets) sẽ tìm nhầm sang schema "public".
const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL, options: "-c search_path=app,public" },
  { schema: "app" },
);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
