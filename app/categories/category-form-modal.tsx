"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { ConfirmDeleteButton } from "@/app/_components/confirm-delete-button";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/lib/actions/category-actions";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-options";

const TYPES = [
  { value: "expense", label: "Chi tiêu" },
  { value: "income", label: "Thu nhập" },
] as const;

type CategoryType = (typeof TYPES)[number]["value"];

export interface EditableCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: EditableCategory | null;
}

const initialState: CategoryFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function CategoryFormModal({
  open,
  onClose,
  category,
}: CategoryFormModalProps) {
  const isEditing = Boolean(category);
  const [type, setType] = useState<CategoryType>("expense");
  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState<string>(category?.icon ?? CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(
    category?.color ?? CATEGORY_COLORS[0],
  );
  const [state, formAction] = useActionState(
    isEditing ? updateCategoryAction : createCategoryAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);
  const [deleteState, deleteFormAction] = useActionState(
    deleteCategoryAction,
    initialState,
  );
  const [handledDeleteState, setHandledDeleteState] = useState(deleteState);

  function resetForm() {
    setType("expense");
    setName(category?.name ?? "");
    setIcon(category?.icon ?? CATEGORY_ICONS[0]);
    setColor(category?.color ?? CATEGORY_COLORS[0]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      resetForm();
    }
  }
  if (deleteState !== handledDeleteState) {
    setHandledDeleteState(deleteState);
    if (deleteState.success) {
      resetForm();
    }
  }

  useEffect(() => {
    if (state.success || deleteState.success) {
      onClose();
    }
    // Intentionally react only to state/deleteState transitions, not to
    // onClose identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deleteState]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        type="button"
      ></button>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {isEditing ? "Sửa danh mục" : "Tạo danh mục mới"}
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
            onClick={handleClose}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-5">
          {isEditing && (
            <input name="id" type="hidden" value={category!.id} />
          )}
          {!isEditing && <input name="type" type="hidden" value={type} />}
          <input name="icon" type="hidden" value={icon} />
          <input name="color" type="hidden" value={color} />
          {state.message && (
            <p
              aria-live="polite"
              className="font-label-md text-label-md text-error text-center"
            >
              {state.message}
            </p>
          )}
          {/* Preview */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color }}
            >
              <span className="material-symbols-outlined text-3xl text-white">
                {icon}
              </span>
            </div>
            <p className="font-label-md text-label-md text-on-surface">
              {name || "Tên danh mục"}
            </p>
          </div>

          {/* Type (chỉ chọn được khi tạo mới — đổi loại sau khi đã có giao dịch sẽ gây lệch thống kê) */}
          {!isEditing && (
            <div className="flex items-center bg-surface-container-low rounded-lg p-1">
              {TYPES.map((option) => (
                <button
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    type === option.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant"
                  }`}
                  key={option.value}
                  onClick={() => setType(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant"
              htmlFor="category-name"
            >
              Tên danh mục
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
              id="category-name"
              maxLength={100}
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Ăn uống"
              required
              type="text"
              value={name}
            />
            {state.errors?.name && (
              <p className="font-label-sm text-label-sm text-error">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Biểu tượng
            </p>
            <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1">
              {CATEGORY_ICONS.map((iconName) => (
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    icon === iconName
                      ? "bg-primary/10 ring-2 ring-primary text-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Màu sắc
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((hex) => (
                <button
                  aria-label={hex}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === hex ? "ring-2 ring-offset-2 ring-on-surface" : ""
                  }`}
                  key={hex}
                  onClick={() => setColor(hex)}
                  style={{ backgroundColor: hex }}
                  type="button"
                ></button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              onClick={handleClose}
              type="button"
            >
              Hủy
            </button>
            <SubmitButton
              label={isEditing ? "Cập nhật danh mục" : "Lưu danh mục"}
            />
          </div>
        </form>

        {isEditing && (
          <form action={deleteFormAction} className="px-6 pb-6">
            <input name="id" type="hidden" value={category!.id} />
            {deleteState.message && (
              <p
                aria-live="polite"
                className="font-label-md text-label-md text-error text-center mb-3"
              >
                {deleteState.message}
              </p>
            )}
            <ConfirmDeleteButton
              confirmLabel="Xoá danh mục này? Lịch sử giao dịch vẫn được giữ lại."
              label="Xoá danh mục"
            />
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
