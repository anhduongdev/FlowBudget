"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.formError && (
        <p className="text-body-sm text-error bg-error-container/10 border border-error/20 rounded-lg px-4 py-3">
          {state.formError}
        </p>
      )}

      <div className="space-y-2">
        <label className="font-label-md text-label-md text-on-surface-variant block" htmlFor="email">
          Địa chỉ Email
        </label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            mail
          </span>
          <input
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary input-glow transition-all"
            id="email"
            name="email"
            placeholder="name@company.com"
            type="email"
          />
        </div>
        {state?.fieldErrors?.email && <p className="text-body-sm text-error">{state.fieldErrors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
            Mật khẩu
          </label>
          <a className="font-label-md text-label-md text-primary hover:underline transition-all" href="#">
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            lock
          </span>
          <input
            className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary input-glow transition-all"
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        {state?.fieldErrors?.password && <p className="text-body-sm text-error">{state.fieldErrors.password[0]}</p>}
      </div>

      <div className="flex items-center">
        <input
          className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20"
          id="remember"
          name="remember"
          type="checkbox"
        />
        <label className="ml-2 font-label-md text-label-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
          Ghi nhớ đăng nhập
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      type="submit"
      disabled={pending}
    >
      <span>{pending ? "Đang đăng nhập..." : "Đăng nhập"}</span>
      {!pending && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
    </button>
  );
}
