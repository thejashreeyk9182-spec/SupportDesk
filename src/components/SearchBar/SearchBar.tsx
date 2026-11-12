interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <input
      className="search-input"
      type="search"
      placeholder="Search by ID, customer or subject..."
      aria-label="Search tickets"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default SearchBar;