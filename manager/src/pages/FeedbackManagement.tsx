import { useState, useEffect } from "react";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";
import LoadingSpinner from "../components/Loading";

const headers = ["ID", "User ID", "Tên người gửi", "Nội dung", "Ngày gửi"];
const columns = ["id", "userId", "name", "description", "createdAt"];

interface Feedback {
  id: number;
  userId: number | null;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/feedbacks");
        setFeedbacks(res.data.data || []);
      } catch (err) {
        setFeedbacks([]);
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) {
      try {
        await api.delete(`/feedbacks/${id}`);
        setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  const formatData = (data: Feedback[]) => {
    return data.map(fb => ({
      ...fb,
      createdAt: formatDate(fb.createdAt)
    }));
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý phản hồi</h1>
      <div className="p-4">
        {loading ? (
          <LoadingSpinner message="Đang tải phản hồi..." />
        ) : (
          <ManagementTable
            headers={headers}
            columns={columns}
            data={formatData(feedbacks)}
            onDelete={handleDelete}
            showActions={true}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement; 