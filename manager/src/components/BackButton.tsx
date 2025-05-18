import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({
  onClick,
  label = "Quay lại",
  className = ""
}: {
  onClick: () => void,
  label?: string,
  className?: string
}) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-blue-700 active:scale-90 transition-all ${className}`}
      onClick={onClick}
    >
      <FaArrowLeft /> {label}
    </button>
  );
};

export default BackButton;