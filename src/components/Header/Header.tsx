import { FiHeadphones } from "react-icons/fi";

const Header = () => {
  return (
    <header className="header">
      <div className="brand">
        <FiHeadphones size={25} />
        <span>SupportDesk</span>
      </div>

      <div className="header-right">
        <span>Administrator</span>
        <div className="avatar">A</div>
      </div>
    </header>
  );
};

export default Header;