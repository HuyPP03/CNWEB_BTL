import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ImageUploader from "../components/ImageUploader";
import BackButton from "../components/BackButton";

interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  brandId: number;
  description: string;
  basePrice: string;
  productImages?: ProductImage[];
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState<any>({});
  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?id=${id}`);
        const prod = res.data.data[0];
        setProduct(prod);
        setForm({
          name: prod.name,
          categoryId: prod.categoryId,
          brandId: prod.brandId,
          description: prod.description,
          basePrice: prod.basePrice,
        });
        setOldImages(prod.productImages || []);
        const [catRes, brandRes] = await Promise.all([
          api.get("/public/categories"),
          api.get("/public/brands"),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map(file => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (newFiles: File[]) => {
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleRemoveOldImage = (imgId: number) => {
    setOldImages(oldImages.filter(img => img.id !== imgId));
  };

  const handleRemoveNewImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("categoryId", String(form.categoryId));
      formData.append("brandId", String(form.brandId));
      formData.append("description", form.description);
      formData.append("basePrice", form.basePrice);
      // Thêm ảnh mới
      images.forEach((file, idx) => {
        formData.append(`image[${idx}]`, file);
      });
      // Gửi danh sách id ảnh cũ muốn giữ lại
      oldImages.forEach(img => {
        formData.append("oldImageIds[]", String(img.id));
      });
      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/qlsanpham");
    } catch (err: any) {
      setError(err.response?.data?.message || "Cập nhật thất bại");
    }
    setLoading(false);
  };

  if (loading && !product) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <BackButton onClick={() => navigate(-1)} />
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Chỉnh sửa sản phẩm</h1>
      <form className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label className="block font-semibold mb-1">Tên sản phẩm</label>
          <input name="name" value={form.name || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Danh mục</label>
          <select name="categoryId" value={form.categoryId || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Nhà cung cấp</label>
          <select name="brandId" value={form.brandId || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Chọn nhà cung cấp</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Mô tả</label>
          <textarea name="description" value={form.description || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Giá cơ bản</label>
          <input name="basePrice" value={form.basePrice || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Ảnh sản phẩm mới (có thể chọn nhiều)</label>
          <ImageUploader
            onImageChange={handleImageChange}
            imagePreviews={imagePreviews}
            onRemoveImage={handleRemoveNewImage}
          />
        </div>
        {oldImages.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">Ảnh hiện tại</label>
            <div className="flex flex-wrap gap-4">
              {oldImages.map(img => (
                <div key={img.id} className="relative">
                  <img src={`https://cnweb-btl.onrender.com/${img.imageUrl}`} alt="old" className="w-24 h-24 object-cover rounded border" />
                  <button type="button" onClick={() => handleRemoveOldImage(img.id)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => navigate(-1)}>Hủy</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit; 