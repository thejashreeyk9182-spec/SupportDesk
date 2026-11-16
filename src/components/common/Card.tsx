
import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({
  title,
  children,
  className = "",
}: CardProps) => {
  return (
    <div className={`common-card ${className}`}>
      {title && <h3 className="common-card-title">{title}</h3>}

      <div className="common-card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
