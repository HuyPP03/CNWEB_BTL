import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

interface ManagementTableProps {
  headers: string[];
  data: { [key: string]: any }[];
  onDetail?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ManagementTable: React.FC<ManagementTableProps> = ({ headers, data, onDetail, onEdit, onDelete }) => {
  const handleDetail = (id: number) => {
    if (onDetail) {
      setTimeout(() => {
        onDetail(id);
        console.log("Chi tiết mục có ID:", id);
      }, 200);
    }
  };

  const handleEdit = (id: number) => {
    if (onEdit) {
      setTimeout(() => {
        onEdit(id);
        console.log("Sửa mục có ID:", id);
      }, 200);
    }
  };

  const handleDelete = (id: number) => {
    if (onDelete) {
      setTimeout(() => {
        onDelete(id);
        console.log("Xóa mục có ID:", id);
      }, 200);
    }
  };

  if (data.length === 0) {
    return <div className="text-center text-gray-500">Không có dữ liệu</div>;
  }
  if (headers.length === 0) {
    return <div className="text-center text-gray-500">Không có tiêu đề</div>;
  }
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-center">
          {headers.map((header, index) => (
            <th key={index} className="border-none p-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="text-center hover:bg-gray-100 transition-colors">
            {Object.keys(item).map((key, index) => (
              <td key={index} className="border-b border-gray-200 p-2">{item[key]}</td>
            ))}
            <td className="border-b border-gray-200 p-2 w-1/4">
            {(onDetail || onEdit || onDelete) && (
                <div className="flex justify-center gap-2">
                  {onDetail && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-blue-600 active:scale-95 transition-transform"
                      onClick={() => handleDetail(item.id)}
                    >
                      <FaEye />
                      Chi tiết
                    </button>
                  )}
                  {onEdit && (
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-yellow-600 active:scale-95 transition-transform"
                    onClick={() => handleEdit(item.id)}
                  >
                    <FaEdit />
                    Sửa
                  </button>
                  )}
                  {onDelete && (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-red-600 active:scale-95 transition-transform"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                    Xóa
                  </button>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ManagementTable;
