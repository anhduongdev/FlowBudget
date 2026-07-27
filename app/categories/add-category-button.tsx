"use client";

import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-options";

const TYPES = [
  { value: "expense", label: "Chi tiêu" },
  { value: "income", label: "Thu nhập" },
] as const;

type CategoryType = (typeof TYPES)[number]["value"];

export function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<CategoryType>("expense");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setType("expense");
    setName("");
    setIcon(CATEGORY_ICONS[0]);
    setColor(CATEGORY_COLORS[0]);
    setErrors({});
  }

  function handleClose() {
    resetForm();
    setOpen(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "Vui lòng nhập tên danh mục";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Chỉ xử lý phần giao diện — chưa lưu vào cơ sở dữ liệu.
    handleClose();
  }

  return (
    <>
      <button
        className="bg-primary text-white px-6 py-2.5 rounded-full font-label-md text-label-md hover:scale-[1.02] active:scale-[0.98] transition-all soft-shadow"
        onClick={() => setOpen(true)}
        type="button"
      >
        Thêm danh mục
      </button>
      {open &&
        createPortal(
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
                Tạo danh mục mới
              </h3>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest/40 transition-colors"
                onClick={handleClose}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">
                  close
                </span>
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
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

              {/* Type */}
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Ăn uống"
                  type="text"
                  value={name}
                />
                {errors.name && (
                  <p className="font-label-sm text-label-sm text-error">
                    {errors.name}
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
                        color === hex
                          ? "ring-2 ring-offset-2 ring-on-surface"
                          : ""
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
                <button
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all"
                  type="submit"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
