import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ onClick, label = "Quay lại", icon: Icon = FaArrowLeft, className = "" }: { onClick: () => void, label?: string, icon?: React.ComponentType, className?: string }) => {
    const handleClick = () => {
        setTimeout(() => {
          onClick();
        }, 200);
      }
    return (
    <button 
      className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4 cursor-pointer hover:bg-blue-700 active:scale-90 transition-all ${className}`}
      onClick={handleClick}
    >
      <Icon /> {label}
    </button>
  );
};

export default BackButton;