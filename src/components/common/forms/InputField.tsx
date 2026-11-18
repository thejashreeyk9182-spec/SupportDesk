
import type { ChangeEvent } from "react";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  id,
  name,
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  error,
  autoComplete,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="ticket-form-group">
      <label htmlFor={id}>
        {label} {required && "*"}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <span
          id={`${id}-error`}
          className="ticket-form-error"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
