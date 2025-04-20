import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import BackButton from "../components/BackButton";

const BrandDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dữ liệu giả lập
  const brand = {
    id: id || 1,
    name: "Apple",
    description:
      "Apple là tập đoàn công nghệ hàng đầu thế giới, nổi tiếng với các sản phẩm như iPhone, iPad, MacBook...",
    address: "1 Apple Park Way, Cupertino, California, USA",
    phone: "+1 800 275 2273",
    email: "support@apple.com",
  };

  const handleBack = () => {
    navigate(-1);
    }

  const handleEdit = () => {
    navigate(`/qlnhacungcap/edit/${brand.id}`);
  };

  const handleDelete = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?");
    if (confirm) {
      console.log("Thực hiện xóa nhà cung cấp với ID:", brand.id);
      // TODO: Thêm logic gọi API xoá
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <BackButton
        onClick={handleBack}
        label="Quay lại"
        icon={FaArrowLeft}
        />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết nhà cung cấp</h1>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            <FaEdit />
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTrash />
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
        <div>
          <p className="font-semibold">ID:</p>
          <p>{brand.id}</p>
        </div>
        <div>
          <p className="font-semibold">Tên:</p>
          <p>{brand.name}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-semibold">Mô tả:</p>
          <p>{brand.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;
