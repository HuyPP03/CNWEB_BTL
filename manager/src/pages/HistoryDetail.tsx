import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";
import { useNavigate, useParams } from "react-router-dom";

interface AdminLog {
  id: number;
  adminId: number;
  action: string;
  entityType: string;
  entityId: number;
  details: string;
  createdAt: string;
  updatedAt: string;
  admin: {
    username: string;
    email: string;
  };
}

const HistoryDetail = () => {
  const [log, setLog] = useState<AdminLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/manager/admin-log?id=${id}`);
        setLog(res.data.data[0] || null);
      } catch (err) {
        setError("Không thể tải lịch sử admin log.");
      }
      setLoading(false);
    };
    fetchLog();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!log) return <div className="p-4">Không tìm thấy log.</div>;

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <BackButton onClick={handleBack} label="Quay lại" />
      <h1 className="text-2xl font-bold mb-8 text-center">Chi tiết thao tác Admin</h1>
      <div className="bg-white shadow-lg rounded-xl p-10 space-y-8 max-w-3xl mx-auto">
        <div className="space-y-4 text-lg">
          <div><span className="font-semibold">ID: </span>{log.id}</div>
          <div><span className="font-semibold">Admin: </span>{log.admin?.username}</div>
          <div><span className="font-semibold">Email: </span>{log.admin?.email}</div>
          <div><span className="font-semibold">Hành động: </span>{log.action}</div>
          <div><span className="font-semibold">Đối tượng: </span>{log.entityType}</div>
          <div><span className="font-semibold">ID đối tượng: </span>{log.entityId}</div>
          <div><span className="font-semibold">Thời gian: </span>{new Date(log.createdAt).toLocaleString()}</div>
          <div>
            <span className="font-semibold">Chi tiết: </span>
            <button
              className="text-blue-600 underline hover:text-blue-800 ml-2"
              onClick={() => setPreviewDetail(log.details)}
            >
              Xem JSON
            </button>
          </div>
        </div>
      </div>
      {/* Overlay xem chi tiết log */}
      {previewDetail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewDetail(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-8 max-w-2xl max-h-[80vh] overflow-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Chi tiết thao tác</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(JSON.parse(previewDetail), null, 2)}
            </pre>
            <button
              className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-black"
              onClick={() => setPreviewDetail(null)}
              title="Đóng"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryDetail;
