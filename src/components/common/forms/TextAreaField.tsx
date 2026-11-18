
import type { ChangeEvent } from "react";

interface TextAreaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
  id,
  name,
  label,
  value,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  onChange,
}: TextAreaFieldProps) => {
  return (
    <div className="ticket-form-group">
      <label htmlFor={id}>
        {label} {required && "*"}
      </label>

      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

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

export default TextAreaField;
