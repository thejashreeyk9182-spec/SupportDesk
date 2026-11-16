
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

import "./Modal.css";

interface ModalContextType {
  onClose: () => void;
  titleId: string;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "small" | "medium" | "large";
}

interface ModalSectionProps {
  children: ReactNode;
  className?: string;
}

const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal components must be used inside Modal");
  }

  return context;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const modalElement = modalRef.current;

    if (!modalElement) return;

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const getFocusableElements = () =>
      Array.from(
        modalElement.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

    const firstFocusable = getFocusableElements()[0];

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modalElement.focus();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          !modalElement.contains(document.activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement ||
          !modalElement.contains(document.activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose, titleId }}>
      <div
        className="modal-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          ref={modalRef}
          className={`modal-container modal-${size}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

const Header = ({ children, className = "" }: ModalSectionProps) => {
  const { onClose, titleId } = useModalContext();

  return (
    <div className={`modal-header ${className}`}>
      <div id={titleId}>{children}</div>

      <button
        type="button"
        className="modal-close"
        onClick={onClose}
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  );
};

const Body = ({ children, className = "" }: ModalSectionProps) => (
  <div className={`modal-body ${className}`}>
    {children}
  </div>
);

const Footer = ({ children, className = "" }: ModalSectionProps) => (
  <div className={`modal-footer ${className}`}>
    {children}
  </div>
);

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
