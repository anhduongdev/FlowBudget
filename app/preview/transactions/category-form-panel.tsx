"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/lib/actions/category-actions";
import { CATEGORY_ICON_LIBRARY } from "@/lib/category-icon-library";

interface EditableCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryFormPanelProps {
  type: "expense" | "income";
  category: EditableCategory | null;
  onDone: () => void;
}

const initialState: CategoryFormState = {};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full py-3 rounded-xl bg-[#18448b] text-white font-semibold disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        "Lưu danh mục"
      )}
    </button>
  );
}

function DeleteConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex-1 py-3 rounded-xl bg-error text-white font-semibold disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        "Xác nhận xoá"
      )}
    </button>
  );
}

export function CategoryFormPanel({
  type,
  category,
  onDone,
}: CategoryFormPanelProps) {
  const router = useRouter();
  const isEditing = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [selectedIcon, setSelectedIcon] = useState(
    () =>
      CATEGORY_ICON_LIBRARY.find((option) => option.icon === category?.icon) ??
      CATEGORY_ICON_LIBRARY[0],
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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

  if (state !== handledState) {
    setHandledState(state);
  }
  if (deleteState !== handledDeleteState) {
    setHandledDeleteState(deleteState);
  }

  useEffect(() => {
    if (state.success || deleteState.success) {
      router.refresh();
      onDone();
    }
    // Intentionally react only to state/deleteState transitions, not to
    // onDone/router identity (callers pass a fresh closure on every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deleteState]);

  return (
    <div className="fixed top-[192px] bottom-0 w-full max-w-[430px] z-[80] flex flex-col bg-background text-on-surface rounded-t-3xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
        <button onClick={onDone} type="button">
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </button>
        <h2 className="font-semibold text-[15px] text-on-surface">
          {isEditing ? "Sửa danh mục" : "Thêm danh mục"}
        </h2>
        <div className="w-6" />
      </div>

      <form
        action={formAction}
        className="flex-1 overflow-y-auto px-5 py-5 space-y-6"
      >
        {isEditing && <input name="id" type="hidden" value={category!.id} />}
        {!isEditing && <input name="type" type="hidden" value={type} />}
        <input name="icon" type="hidden" value={selectedIcon.icon} />
        <input name="color" type="hidden" value={selectedIcon.color} />

        {state.message && (
          <p aria-live="polite" className="text-error text-[13px] text-center">
            {state.message}
          </p>
        )}

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,0,0,0.2)]"
            style={{ backgroundColor: selectedIcon.color }}
          >
            <span className="material-symbols-outlined text-white text-3xl">
              {selectedIcon.icon}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-[12px] text-on-surface-variant"
            htmlFor="category-name-input"
          >
            Tên danh mục
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-[#18448b] transition-colors"
            id="category-name-input"
            maxLength={100}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Ví dụ: Ăn uống"
            required
            value={name}
          />
          {state.errors?.name && (
            <p className="text-error text-[12px]">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[12px] text-on-surface-variant">Biểu tượng</p>
          <div className="grid grid-cols-6 gap-3 max-h-56 overflow-y-auto p-1">
            {CATEGORY_ICON_LIBRARY.map((option) => (
              <button
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  selectedIcon.icon === option.icon
                    ? "ring-2 ring-[#18448b] ring-offset-2 ring-offset-background"
                    : ""
                }`}
                key={option.icon}
                onClick={() => setSelectedIcon(option)}
                style={{ backgroundColor: option.color }}
                type="button"
              >
                <span className="material-symbols-outlined text-white text-lg">
                  {option.icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        <SaveButton />
      </form>

      {isEditing && (
        <div className="px-5 pb-6 shrink-0">
          {deleteState.message && (
            <p aria-live="polite" className="text-error text-[13px] text-center mb-2">
              {deleteState.message}
            </p>
          )}
          {!confirmingDelete ? (
            <button
              className="w-full py-3 rounded-xl border border-error/40 text-error font-semibold"
              onClick={() => setConfirmingDelete(true)}
              type="button"
            >
              Xoá danh mục
            </button>
          ) : (
            <form action={deleteFormAction} className="flex items-center gap-2">
              <input name="id" type="hidden" value={category!.id} />
              <button
                className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant"
                onClick={() => setConfirmingDelete(false)}
                type="button"
              >
                Hủy
              </button>
              <DeleteConfirmButton />
            </form>
          )}
        </div>
      )}
    </div>
  );
}
