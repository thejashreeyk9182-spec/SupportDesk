
interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <span className="ticket-form-error" role="alert">
      {message}
    </span>
  );
};

export default FormError;
