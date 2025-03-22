import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm Nhân Viên</h1>
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition-transform duration-100 ${
          isClicked ? "scale-90 bg-blue-700" : "hover:scale-105"
        }`}
        onClick={() => {
          setIsClicked(true);
          setIsClicked(false);
          setTimeout(() => {
            navigate("/qlinhanvien");
          }, 200);
        }}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
        onMouseLeave={() => setIsClicked(false)}
      >
        Quay lại
      </button>
    </div>
  );
};

export default AddEmployee;
