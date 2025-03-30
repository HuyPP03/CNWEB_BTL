import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FaArrowLeft } from "react-icons/fa";

const AddEmployee = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/qlnhanvien");
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm Nhân Viên</h1>
      <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft}/>
    </div>
  );
};

export default AddEmployee;
