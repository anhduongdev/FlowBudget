"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  changePasswordAction,
  type AuthFormState,
} from "@/lib/actions/auth-actions";

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="px-6 py-3 rounded-xl bg-primary text-white font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <span className="material-symbols-outlined animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        "Đổi mật khẩu"
      )}
    </button>
  );
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [state, formAction] = useActionState(
    changePasswordAction,
    initialState,
  );
  const [handledState, setHandledState] = useState(state);

  if (state !== handledState) {
    setHandledState(state);
    if (state.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <p
          aria-live="polite"
          className={`font-label-md text-label-md ${
            state.success ? "text-tertiary" : "text-error"
          }`}
        >
          {state.message}
        </p>
      )}
      <div className="space-y-1">
        <label
          className="font-label-md text-label-md text-on-surface-variant"
          htmlFor="current-password"
        >
          Mật khẩu hiện tại
        </label>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
          id="current-password"
          name="currentPassword"
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          type="password"
          value={currentPassword}
        />
        {state.errors?.currentPassword && (
          <p className="font-label-sm text-label-sm text-error">
            {state.errors.currentPassword[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label
          className="font-label-md text-label-md text-on-surface-variant"
          htmlFor="new-password"
        >
          Mật khẩu mới
        </label>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
          id="new-password"
          name="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          required
          type="password"
          value={newPassword}
        />
        {state.errors?.newPassword && (
          <p className="font-label-sm text-label-sm text-error">
            {state.errors.newPassword[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label
          className="font-label-md text-label-md text-on-surface-variant"
          htmlFor="confirm-new-password"
        >
          Xác nhận mật khẩu mới
        </label>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
          id="confirm-new-password"
          name="confirmNewPassword"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          type="password"
          value={confirmNewPassword}
        />
        {state.errors?.confirmNewPassword && (
          <p className="font-label-sm text-label-sm text-error">
            {state.errors.confirmNewPassword[0]}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
