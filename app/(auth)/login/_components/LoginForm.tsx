"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/auth-actions";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-md" id="loginForm">
      {state?.formError && (
        <p className="rounded-xl border border-error/20 bg-error-container/10 px-md py-sm text-body-md text-error">
          {state.formError}
        </p>
      )}

      <div className="space-y-xs">
        <label className="block font-label-md text-on-surface-variant" htmlFor="email">
          Email
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md">
            <span className="material-symbols-outlined text-[20px] text-outline">mail</span>
          </div>
          <input
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-3 pl-11 pr-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary"
            id="email"
            name="email"
            placeholder="yourname@example.com"
            type="email"
          />
        </div>
        {state?.fieldErrors?.email && <p className="text-label-sm text-error">{state.fieldErrors.email[0]}</p>}
      </div>

      <div className="space-y-xs">
        <div className="flex items-center justify-between px-1">
          <label className="font-label-md text-on-surface-variant" htmlFor="password">
            Mật khẩu
          </label>
          <a className="font-label-sm text-primary transition-all hover:underline" href="#">
            Quên mật khẩu?
          </a>
        </div>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md">
            <span className="material-symbols-outlined text-[20px] text-outline">lock</span>
          </div>
          <input
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-3 pl-11 pr-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary"
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-md text-outline transition-colors hover:text-on-surface"
            onClick={() => setShowPassword((v) => !v)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
          </button>
        </div>
        {state?.fieldErrors?.password && <p className="text-label-sm text-error">{state.fieldErrors.password[0]}</p>}
      </div>

      <div className="flex items-center space-x-2 px-1">
        <input
          className="h-4 w-4 cursor-pointer rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-background"
          id="remember"
          name="remember"
          type="checkbox"
        />
        <label className="cursor-pointer select-none font-label-md text-on-surface-variant" htmlFor="remember">
          Ghi nhớ đăng nhập
        </label>
      </div>

      <SubmitButton />

      <div className="relative my-lg">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-label-sm">
          <span className="bg-surface-container-low px-4 text-outline">Hoặc tiếp tục với</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant py-2.5 transition-colors hover:bg-surface-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">google</span>
          <span className="font-label-md">Google</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant py-2.5 transition-colors hover:bg-surface-container"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">apps</span>
          <span className="font-label-md">Apple</span>
        </button>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-xl bg-primary py-4 font-label-md font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  );
}
