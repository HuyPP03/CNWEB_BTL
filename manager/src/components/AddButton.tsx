import { FaPlus } from "react-icons/fa";

const AddButton = ({ onClick, label = "Thêm", icon: Icon = FaPlus, className = "" }: { onClick: () => void, label?: string, icon?: React.ComponentType, className?: string }) => {
  const handleClick = () => {
    setTimeout(() => {
      onClick();
    }, 200);
  }

  return (
    <button 
      className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-2 cursor-pointer transition-all active:scale-90 hover:bg-blue-700 ${className}`}
      onClick={handleClick}
    >
      <Icon /> {label}
    </button>
  );
};

export default AddButton;
