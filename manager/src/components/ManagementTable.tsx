import { FaEdit, FaTrash } from "react-icons/fa";

interface ManagementTableProps {
  headers: string[];
  data: { [key: string]: any }[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ManagementTable: React.FC<ManagementTableProps> = ({ headers, data, onEdit, onDelete }) => {
  const handleEdit = (id: number) => {
    setTimeout(() => {
      onEdit(id);
      console.log("Sửa mục có ID:", id);
    }, 200);
  };
  
  const handleDelete = (id: number) => {
    setTimeout(() => {
      onDelete(id);
      console.log("Xóa mục có ID:", id);
    }, 200);
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
          <tr key={item.id} className="text-center">
            {Object.keys(item).map((key, index) => (
              <td key={index} className="border-b border-gray-200 p-2">{item[key]}</td>
            ))}
            <td className="border-b border-gray-200 p-2">
              <div className="flex justify-center gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-yellow-600 active:scale-95 transition-transform"
                  onClick={() => handleEdit(item.id)}
                >
                <FaEdit />
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-red-600 active:scale-95 transition-transform"
                  onClick={() => handleDelete(item.id)}
                >
                <FaTrash />
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ManagementTable;
