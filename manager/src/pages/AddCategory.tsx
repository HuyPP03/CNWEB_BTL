import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FaArrowLeft } from "react-icons/fa";

const AddCategory = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/qldanhmuc");
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm Danh Mục</h1>
      <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft}/>
    </div>
  );
};

export default AddCategory;
