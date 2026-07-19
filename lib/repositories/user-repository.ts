import { prisma } from "@/lib/prisma";
import type { DefaultCategory } from "@/lib/constants/default-categories";

// findUserByEmail chạy TRƯỚC khi biết user là ai (login/register) nên không
// filter theo user_id — đây là 1 trong số ít trường hợp hợp lệ không cần lọc.
export function findUserByEmail(email: string) {
  return prisma.users.findUnique({ where: { email } });
}

export function findUserById(userId: bigint) {
  return prisma.users.findUnique({ where: { id: userId } });
}

type NewUserData = { name: string; email: string; password_hash: string };
type SeedCategory = DefaultCategory & { type: "income" | "expense" };

// Tạo user + seed danh mục mặc định trong cùng 1 transaction — user mới mà
// chưa có danh mục nào là trạng thái dở dang không hợp lệ. Vẫn là CRUD thuần
// (không có if/else nghiệp vụ) — quyết định seed cái gì nằm ở Service.
export async function createUserWithSeedCategories(data: NewUserData, categories: SeedCategory[]) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.users.create({ data });
    await tx.categories.createMany({
      data: categories.map((category, index) => ({
        user_id: user.id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
        sort_order: index,
      })),
    });
    return user;
  });
}
