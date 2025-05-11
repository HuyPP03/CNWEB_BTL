import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";
import { FaArrowLeft } from "react-icons/fa";
import ManagementTable from "../components/ManagementTable";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  categoryId: number;
  brandId: number;
  images?: string[];
  productVariants?: ProductVariant[];
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface ProductVariant {
  id: number;
  slug: string;
  price: string;
  stock: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy chi tiết sản phẩm
        const res = await api.get(`/products?id=${id}`);
        setProduct(res.data.data[0]);
        // Lấy danh sách danh mục và brand
        const [catRes, brandRes] = await Promise.all([
          api.get("/public/categories"),
          api.get("/public/brands"),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err: any) {
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
      }
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  const handleBack = () => navigate("/qlsanpham");

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return null;

  // Tìm tên danh mục và tên nhà cung cấp
  const categoryName = categories.find(c => c.id === product.categoryId)?.name || product.categoryId;
  const brandName = brands.find(b => b.id === product.brandId)?.name || product.brandId;

  // Chuẩn bị dữ liệu cho bảng biến thể
  const variantHeaders = ["ID", "Tên biến thể", "Giá", "Số lượng"];
  const variantColumns = ["id", "name", "price", "stock"];
  const variantData = (product.productVariants || []).map(variant => ({
    id: variant.id,
    name: variant.slug, // hoặc variant.name nếu có
    price: variant.price,
    stock: variant.stock,
  }));

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft} />
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Chi tiết sản phẩm</h1>
      <div className="bg-white shadow-lg rounded-xl p-10 space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {product.images && product.images.length > 0 && (
            <div className="flex flex-row gap-4 flex-wrap justify-center">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`https://cnweb-btl.onrender.com/${img}`}
                  alt={`product-img-${idx}`}
                  className="w-60 h-60 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition"
                  onClick={() => setPreviewImg(img)}
                />
              ))}
            </div>
          )}
          <div className="flex-1 space-y-4 text-lg">
            <div>
              <span className="font-semibold">Tên sản phẩm: </span>
              {product.name}
            </div>
            <div>
              <span className="font-semibold">Mô tả: </span>
              {product.description}
            </div>
            <div>
              <span className="font-semibold">Giá cơ bản: </span>
              {product.basePrice}
            </div>
            <div>
              <span className="font-semibold">Danh mục: </span>
              {categoryName}
            </div>
            <div>
              <span className="font-semibold">Nhà cung cấp: </span>
              {brandName}
            </div>
          </div>
        </div>
        {variantData.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Các biến thể sản phẩm</h2>
            <ManagementTable
              headers={variantHeaders}
              columns={variantColumns}
              data={variantData}
              showActions={false}
            />
          </div>
        )}
      </div>
      {/* Overlay xem ảnh lớn */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="preview"
            className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-8 right-8 text-white text-3xl font-bold"
            onClick={() => setPreviewImg(null)}
            title="Đóng"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
