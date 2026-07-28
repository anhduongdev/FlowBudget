"use client";

import { useState } from "react";
import { CategoryFormModal } from "./category-form-modal";

export function AddCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-primary text-white px-6 py-2.5 rounded-full font-label-md text-label-md hover:scale-[1.02] active:scale-[0.98] transition-all soft-shadow"
        onClick={() => setOpen(true)}
        type="button"
      >
        Thêm danh mục
      </button>
      <CategoryFormModal
        category={null}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
