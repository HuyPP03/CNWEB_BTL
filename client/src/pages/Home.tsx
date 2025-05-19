import { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/product.service';
import { ProductV2 } from '../types/product';
import { Link } from 'react-router-dom';
import { slugToIdMap } from '../data/categoryMapping';
import Banner from '../components/Banner';

function Home() {
  // State for products data
  const [smartphones, setSmartphones] = useState<ProductV2[]>([]);
  const [laptops, setLaptops] = useState<ProductV2[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<ProductV2[]>([]); const [loading, setLoading] = useState<boolean>(true);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch smartphones (category ID 1)
      const smartphonesResponse = await productService.getProducts({
        categoryId: slugToIdMap['smartphone'], // ID 1
        limit: 5
      });

      // Fetch laptops (category ID 2)
      const laptopsResponse = await productService.getProducts({
        categoryId: slugToIdMap['laptop'], // ID 2
        limit: 5
      });

      // Fetch promotion products (all products with discounts)
      // For now we'll just get the latest products as a placeholder
      const promotionsResponse = await productService.getProducts({
        limit: 10
      });

      if (smartphonesResponse && smartphonesResponse.data) {

        setSmartphones(smartphonesResponse.data);
      }

      if (laptopsResponse && laptopsResponse.data) {
        setLaptops(laptopsResponse.data);
      }

      if (promotionsResponse && promotionsResponse.data) {
        setPromotionProducts(promotionsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching products for home page:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products when component mounts
  useEffect(() => {
    console.log('Fetching products...');
    fetchProducts();
  }, [fetchProducts]);

  // Function to render product sections
  const renderProductSection = (title: string, link: string, products: ProductV2[], isLoading: boolean) => {
    return (
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Link to={link} className="text-blue-600 text-sm">Xem tất cả &gt;</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {isLoading ? (
              // Loading placeholders
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))
            ) : (
              products.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10 mt-1">
      {/* Hero Banner Slider */}
      <Banner />

      {/* Flash Sale / Promotion */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">            <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-red-600">FLASH SALE</h2>
          </div>
            <Link to="/promotions" className="text-blue-600 text-sm">Xem tất cả &gt;</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {loading ? (
              // Loading placeholders
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))
            ) : (
              promotionProducts.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Smartphone Section */}
      {renderProductSection('ĐIỆN THOẠI NỔI BẬT', '/smartphone', smartphones, loading)}

      {/* Laptop Section */}
      {renderProductSection('LAPTOP NỔI BẬT', '/laptop', laptops, loading)}      {/* News and Tips - Enhanced with semantic HTML */}
      <section aria-label="Tech News" className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">TIN TỨC CÔNG NGHỆ</h2>
            <Link to="/news" className="text-blue-600 text-sm hover:underline">Xem tất cả &gt;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <article key={index} className="group">
                <Link to={`/news/${index + 1}`} className="block">
                  <figure className="rounded-lg overflow-hidden mb-2">
                    <img
                      src={`https://via.placeholder.com/400x200/2196F3/ffffff?text=Tin+tức+${index + 1}`}
                      alt={`Tin tức ${index + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </figure>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {index === 0 ? 'So sánh Galaxy S24 Ultra với iPhone 15 Pro Max: Đâu là lựa chọn tốt nhất?' :
                      index === 1 ? 'Top 5 laptop gaming giá rẻ đáng mua nhất năm 2025' :
                        'Cách chọn phụ kiện phù hợp cho thiết bị của bạn'}
                  </h3>
                  <time dateTime={new Date().toISOString()} className="text-sm text-gray-500 mt-1 block">
                    {new Date().toLocaleDateString('vi-VN')}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
