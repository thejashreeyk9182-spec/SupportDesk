
interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}

const SubmitButton = ({
  label,
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="ticket-form-submit"
      disabled={loading || disabled}
    >
      {loading ? loadingText : label}
    </button>
  );
};

export default SubmitButton;
