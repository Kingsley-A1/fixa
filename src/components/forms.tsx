"use client";
import { useActionState } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";
type State = { error?: string; success?: string };
type Action = (state: State, form: FormData) => Promise<State>;
export function FormShell({
  action,
  children,
  button,
}: {
  action: Action;
  children: React.ReactNode;
  button: string;
}) {
  const [state, submit, pending] = useActionState(action, {});
  return (
    <form action={submit} className="form-stack">
      {children}
      {state.success && <div role="status" className="form-success">{state.success}</div>}
      {state.error && (
        <div role="alert" className="form-error">
          <AlertCircle size={16} />
          {state.error}
        </div>
      )}
      <button disabled={pending} className="btn primary submit" type="submit">
        {pending ? (
          <LoaderCircle size={18} className="spin" />
        ) : (
          <ArrowRight size={18} />
        )}{" "}
        {pending ? "Saving…" : button}
      </button>
    </form>
  );
}
export function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  defaultValue = "",
  minLength,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  minLength?: number;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue}
      />
    </label>
  );
}
export function Area({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={3}
      />
    </label>
  );
}
export function SelectField({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      <select name={name} required={required} defaultValue="">
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
