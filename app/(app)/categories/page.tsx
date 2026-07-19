import type { Metadata } from "next";
import { z } from "zod";
import { requireCurrentUserId } from "@/lib/auth/current-user";
import { listCategoriesWithSpending } from "@/lib/services/category-service";
import { CategoryModalProvider } from "@/app/(app)/categories/_components/CategoryModalContext";
import { CategoryTypeTabs } from "@/app/(app)/categories/_components/CategoryTypeTabs";
import { CategorySummaryHeader } from "@/app/(app)/categories/_components/CategorySummaryHeader";
import { CategoryCard } from "@/app/(app)/categories/_components/CategoryCard";
import { AddCategoryCard } from "@/app/(app)/categories/_components/AddCategoryCard";

export const metadata: Metadata = { title: "Danh mục | MyFlowBudget" };

const typeSchema = z.object({ type: z.enum(["expense", "income"]).catch("expense") });

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const userId = await requireCurrentUserId();
  const { type } = typeSchema.parse(await searchParams);
  const { categories, total, topCategory } = await listCategoriesWithSpending(userId, type);

  return (
    <CategoryModalProvider>
      <CategoryTypeTabs current={type} />

      <CategorySummaryHeader topCategory={topCategory} total={total} type={type} />

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        <AddCategoryCard defaultType={type} />
      </div>
    </CategoryModalProvider>
  );
}
