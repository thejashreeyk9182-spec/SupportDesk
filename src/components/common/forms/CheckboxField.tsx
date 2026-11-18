
import type { ChangeEvent } from "react";

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField = ({
  id,
  name,
  label,
  checked,
  required = false,
  disabled = false,
  error,
  onChange,
}: CheckboxFieldProps) => {
  return (
    <div className="ticket-form-group">
      <div className="checkbox-field">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          required={required}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        <label htmlFor={id}>
          {label} {required && "*"}
        </label>
      </div>

      {error && (
        <span
          id={`${id}-error`}
          className="ticket-form-error"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default CheckboxField;
