"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction } from "@/lib/actions/auth-actions";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="space-y-md">
      {state?.formError && (
        <p className="rounded-xl border border-error/20 bg-error-container/10 px-md py-sm text-body-md text-error">
          {state.formError}
        </p>
      )}

      <div className="space-y-xs">
        <label className="block font-label-md text-on-surface-variant" htmlFor="name">
          Họ và tên
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
          <input
            className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-11 pr-sm font-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            id="name"
            name="name"
            placeholder="Nguyễn Văn A"
            type="text"
          />
        </div>
        {state?.fieldErrors?.name && <p className="text-label-sm text-error">{state.fieldErrors.name[0]}</p>}
      </div>

      <div className="space-y-xs">
        <label className="block font-label-md text-on-surface-variant" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
          <input
            className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-11 pr-sm font-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            id="email"
            name="email"
            placeholder="example@flowbudget.com"
            type="email"
          />
        </div>
        {state?.fieldErrors?.email && <p className="text-label-sm text-error">{state.fieldErrors.email[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div className="space-y-xs">
          <label className="block font-label-md text-on-surface-variant" htmlFor="password">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
            <input
              className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-11 pr-sm font-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="password"
              name="password"
              placeholder="Tối thiểu 8 ký tự"
              type="password"
            />
          </div>
          {state?.fieldErrors?.password && <p className="text-label-sm text-error">{state.fieldErrors.password[0]}</p>}
        </div>

        <div className="space-y-xs">
          <label className="block font-label-md text-on-surface-variant" htmlFor="confirm_password">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">security</span>
            <input
              className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-11 pr-sm font-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="confirm_password"
              name="confirm_password"
              placeholder="Nhập lại mật khẩu"
              type="password"
            />
          </div>
          {state?.fieldErrors?.confirm_password && (
            <p className="text-label-sm text-error">{state.fieldErrors.confirm_password[0]}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-xs py-xs">
        <input className="mt-1 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary" id="terms" name="terms" type="checkbox" />
        <label className="font-label-sm text-on-surface-variant" htmlFor="terms">
          Tôi đồng ý với <a className="text-primary transition-all hover:underline" href="#">Điều khoản dịch vụ</a> và{" "}
          <a className="text-primary transition-all hover:underline" href="#">Chính sách bảo mật</a>.
        </label>
      </div>
      {state?.fieldErrors?.terms && <p className="text-label-sm text-error">{state.fieldErrors.terms[0]}</p>}

      <SubmitButton />

      <div className="relative my-lg">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-label-sm uppercase">
          <span className="bg-surface-container-high px-sm text-on-surface-variant">Hoặc đăng ký bằng</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <button className="flex h-12 items-center justify-center gap-xs rounded-lg border border-outline-variant font-label-md text-on-surface transition-colors hover:bg-surface-container" type="button">
          <span className="material-symbols-outlined text-[20px]">google</span>
          Google
        </button>
        <button className="flex h-12 items-center justify-center gap-xs rounded-lg border border-outline-variant font-label-md text-on-surface transition-colors hover:bg-surface-container" type="button">
          <span className="material-symbols-outlined text-[20px] text-[#1877F2]" style={{ fontVariationSettings: "'FILL' 1" }}>
            face_nod
          </span>
          Facebook
        </button>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex h-14 w-full items-center justify-center gap-xs rounded-lg bg-primary font-label-md font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Đang tạo tài khoản..." : "Đăng ký"}
      {!pending && <span className="material-symbols-outlined">arrow_forward</span>}
    </button>
  );
}
