import { FaPlus } from "react-icons/fa";

const AddButton = ({ onClick, label = "Thêm", icon: Icon = FaPlus, className = "" }: { onClick: () => void, label?: string, icon?: React.ComponentType, className?: string }) => {
  return (
    <button 
      className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4 cursor-pointer hover:bg-blue-600 transition-all ${className}`}
      onClick={onClick}
    >
      <Icon /> {label}
    </button>
  );
};

export default AddButton;
