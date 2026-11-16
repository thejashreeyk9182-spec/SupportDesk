
import "./Dropdown.css";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  name: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const Dropdown = ({
  label,
  name,
  value,
  options,
  placeholder = "Select an option",
  disabled = false,
  onChange,
}: DropdownProps) => {
  return (
    <div className="common-dropdown">
      {label && (
        <label htmlFor={name} className="common-dropdown-label">
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        className="common-dropdown-select"
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
