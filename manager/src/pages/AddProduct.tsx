import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import ImageUploader from "../components/ImageUploader";
import api from "../services/api";

interface Category {
  id: number;
  name: string;
}
interface Brand {
  id: number;
  name: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    description: "",
    basePrice: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api.get("/public/categories").then(res => setCategories(res.data.data || []));
    api.get("/public/brands").then(res => setBrands(res.data.data || []));
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map(file => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const handleBack = () => navigate("/qlsanpham");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (newFiles: File[]) => {
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.categoryId || !form.brandId || !form.description || !form.basePrice) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (isNaN(Number(form.basePrice)) || Number(form.basePrice) <= 0) {
      setError("Giá cơ bản phải là số dương!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("categoryId", form.categoryId);
      formData.append("brandId", form.brandId);
      formData.append("description", form.description);
      formData.append("basePrice", form.basePrice);
      images.forEach((file) => {
        formData.append("image", file);
      });
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Thêm sản phẩm thành công!");
      setTimeout(() => navigate("/qlsanpham"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra!");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <BackButton onClick={handleBack} />
      <h1 className="text-2xl font-bold mb-8 text-center">Thêm sản phẩm</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white shadow-md rounded-lg p-10 space-y-8 max-w-4xl mx-auto"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-semibold mb-2 text-lg">Tên sản phẩm <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Nhập tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-blue-400 text-lg"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-lg">Danh mục <span className="text-red-500">*</span></label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full p-3 border rounded text-lg"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2 text-lg">Nhà cung cấp <span className="text-red-500">*</span></label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              className="w-full p-3 border rounded text-lg"
              required
            >
              <option value="">Chọn nhà cung cấp</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-lg">Mô tả <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded text-lg"
            required
            rows={4}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-lg">Giá cơ bản <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="basePrice"
            placeholder="Nhập giá cơ bản"
            value={form.basePrice}
            onChange={handleChange}
            className="w-full p-3 border rounded text-lg"
            min={0}
            required
          />
        </div>
        <label className="block font-semibold mb-2 text-lg">Ảnh sản phẩm</label>
        <ImageUploader
          onImageChange={handleImageChange}
          imagePreviews={imagePreviews}
          onRemoveImage={handleRemoveImage}
        />
        {error && <div className="text-red-500 font-semibold text-lg">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-lg">{success}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 font-semibold w-full text-lg shadow"
          disabled={loading}
        >
          {loading ? "Đang thêm..." : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
