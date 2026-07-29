"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProfileAction,
  type AuthFormState,
} from "@/lib/actions/auth-actions";

interface UpdateProfileFormProps {
  name: string;
  email: string;
}

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
        "Lưu thay đổi"
      )}
    </button>
  );
}

export function UpdateProfileForm({ name, email }: UpdateProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialState,
  );

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
          htmlFor="profile-name"
        >
          Họ và tên
        </label>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md outline-none focus:border-primary transition-colors"
          defaultValue={name}
          id="profile-name"
          maxLength={100}
          name="name"
          required
          type="text"
        />
        {state.errors?.name && (
          <p className="font-label-sm text-label-sm text-error">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label
          className="font-label-md text-label-md text-on-surface-variant"
          htmlFor="profile-email"
        >
          Email
        </label>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface-variant outline-none"
          disabled
          id="profile-email"
          type="email"
          value={email}
        />
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Email không thể thay đổi.
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}
