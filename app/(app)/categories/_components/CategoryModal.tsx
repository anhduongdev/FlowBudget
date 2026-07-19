"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/category-actions";
import type { CategoryDto } from "@/lib/services/category-service";

const ICON_OPTIONS = [
  "restaurant",
  "shopping_bag",
  "directions_car",
  "home",
  "bolt",
  "movie",
  "health_and_safety",
  "school",
  "fitness_center",
  "flight",
  "payments",
  "stars",
  "category",
];

const COLOR_OPTIONS = ["#f97316", "#ef4444", "#eab308", "#84cc16", "#06b6d4", "#ec4899", "#a855f7", "#4ae176"];

type Props = {
  state: { mode: "create"; defaultType: "expense" | "income" } | { mode: "edit"; category: CategoryDto };
  onClose: () => void;
};

export function CategoryModal({ state, onClose }: Props) {
  const isEdit = state.mode === "edit";
  const category = isEdit ? state.category : null;
  const action = isEdit ? updateCategoryAction : createCategoryAction;

  const [formState, formAction] = useActionState(action, null);
  const [type, setType] = useState<"expense" | "income">(category?.type ?? (isEdit ? "expense" : state.defaultType));
  const [icon, setIcon] = useState(category?.icon ?? ICON_OPTIONS[0]);
  const [color, setColor] = useState(category?.color ?? COLOR_OPTIONS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-md backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant p-lg">
          <h3 className="text-headline-md font-bold text-primary">{isEdit ? "Sửa danh mục" : "Danh mục mới"}</h3>
          <button className="rounded-full p-2 hover:bg-surface-container-high" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          action={(formData) => {
            if (isEdit && category) formData.set("id", category.id);
            formData.set("type", type);
            formData.set("icon", icon);
            formData.set("color", color);
            formAction(formData);
          }}
        >
          <div className="space-y-md p-lg">
            {formState?.formError && <p className="text-body-md text-error">{formState.formError}</p>}

            <div className="space-y-xs">
              <label className="block font-label-sm uppercase text-on-surface-variant">Tên danh mục</label>
              <input
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                defaultValue={category?.name}
                name="name"
                placeholder="VD: Sức khỏe"
                type="text"
              />
              {formState?.fieldErrors?.name && <p className="text-label-sm text-error">{formState.fieldErrors.name[0]}</p>}
            </div>

            <div className="space-y-xs">
              <label className="block font-label-sm uppercase text-on-surface-variant">Loại</label>
              <div className="grid grid-cols-2 gap-sm">
                <button
                  className={
                    type === "expense"
                      ? "rounded-xl border-2 border-primary bg-primary py-3 font-bold text-on-primary"
                      : "rounded-xl border-2 border-transparent bg-surface-container-low py-3 font-bold text-on-surface"
                  }
                  onClick={() => setType("expense")}
                  type="button"
                >
                  Chi tiêu
                </button>
                <button
                  className={
                    type === "income"
                      ? "rounded-xl border-2 border-primary bg-primary py-3 font-bold text-on-primary"
                      : "rounded-xl border-2 border-transparent bg-surface-container-low py-3 font-bold text-on-surface"
                  }
                  onClick={() => setType("income")}
                  type="button"
                >
                  Thu nhập
                </button>
              </div>
            </div>

            <div className="space-y-xs">
              <label className="block font-label-sm uppercase text-on-surface-variant">Biểu tượng</label>
              <div className="custom-scrollbar grid max-h-32 grid-cols-5 gap-sm overflow-y-auto rounded-xl bg-surface-container-low p-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={
                      opt === icon
                        ? "flex aspect-square items-center justify-center rounded-lg bg-primary-container text-on-primary-container"
                        : "flex aspect-square items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                    }
                    onClick={() => setIcon(opt)}
                    type="button"
                  >
                    <span className="material-symbols-outlined">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-xs">
              <label className="block font-label-sm uppercase text-on-surface-variant">Màu chủ đạo</label>
              <div className="flex flex-wrap gap-xs">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={
                      opt === color
                        ? "h-8 w-8 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high"
                        : "h-8 w-8 rounded-full"
                    }
                    onClick={() => setColor(opt)}
                    style={{ backgroundColor: opt }}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-md bg-surface-container-low p-lg">
            <button
              className="flex-1 rounded-xl border border-outline-variant px-md py-sm text-on-surface transition-colors hover:bg-surface-container"
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <SubmitButton isEdit={isEdit} />
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 rounded-xl bg-primary px-md py-sm font-bold text-on-primary transition-all hover:opacity-90 disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
    </button>
  );
}
