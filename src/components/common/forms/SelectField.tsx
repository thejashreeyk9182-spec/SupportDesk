
import type { ChangeEvent } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
  id,
  name,
  label,
  value,
  options,
  required = false,
  disabled = false,
  error,
  onChange,
}: SelectFieldProps) => {
  return (
    <div className="ticket-form-group">
      <label htmlFor={id}>
        {label} {required && "*"}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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

export default SelectField;
