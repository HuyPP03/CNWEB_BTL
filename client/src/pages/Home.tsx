import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay] = useState(true);

  const banners = [
    '/images/banners/banner1.jpg',
    '/images/banners/banner2.jpg',
    '/images/banners/banner3.jpg',
    '/images/banners/banner4.jpg',
    '/images/banners/banner5.jpg',
  ];

  // Mô phỏng banners khi chưa có ảnh thật
  const placeholderBanners = [
    'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fe/d8/fed87d90446c8b5c42d995581294d987.png',
    'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/d6/6a/d66a6f0df04ded33afc9223bcffc57f7.png',
    'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e6/28/e6282d2c49e138b353d6be50b282bd80.jpg',
    'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ff/8d/ff8d444f0ee95b8be4e88ed584ae861e.png',
    'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/c1/8d/c18de02da648ceb2e6ea6d1e7def18aa.png',
  ];

  // Danh mục sản phẩm
  const categories = [
    { name: 'Điện thoại', image: 'https://via.placeholder.com/80/3498db/ffffff?text=📱', link: '/category/smartphone' },
    { name: 'Laptop', image: 'https://via.placeholder.com/80/27ae60/ffffff?text=💻', link: '/category/laptop' },
    { name: 'Tablet', image: 'https://via.placeholder.com/80/8e44ad/ffffff?text=📱', link: '/category/tablet' },
    { name: 'Đồng hồ thông minh', image: 'https://via.placeholder.com/80/f39c12/ffffff?text=⌚', link: '/category/smartwatch' },
    { name: 'Tai nghe', image: 'https://via.placeholder.com/80/e74c3c/ffffff?text=🎧', link: '/category/audio' },
    { name: 'Sạc dự phòng', image: 'https://via.placeholder.com/80/1abc9c/ffffff?text=🔋', link: '/category/accessories' },
    { name: 'Màn hình', image: 'https://via.placeholder.com/80/34495e/ffffff?text=🖥️', link: '/category/monitor' },
    { name: 'Máy cũ giá rẻ', image: 'https://via.placeholder.com/80/7f8c8d/ffffff?text=📱', link: '/category/refurbished' },
    { name: 'Đồng hồ thời trang', image: 'https://via.placeholder.com/80/95a5a6/ffffff?text=⌚', link: '/category/watches' },
    { name: 'Tất cả danh mục', image: 'https://via.placeholder.com/80/bdc3c7/ffffff?text=📋', link: '/categories' },
  ];

  // Banner nhỏ phía dưới slider chính
  const smallBanners = [
    'https://via.placeholder.com/380x150/FF5722/ffffff?text=Samsung+Sale',
    'https://via.placeholder.com/380x150/009688/ffffff?text=iPhone+Giảm+Giá',
    'https://via.placeholder.com/380x150/673AB7/ffffff?text=Phụ+Kiện+Hot',
  ];

  useEffect(() => {
    let interval: any = null;
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
  };

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Lọc sản phẩm theo danh mục
  const smartphones = mockProducts.filter(p => p.category === 'smartphone').slice(0, 5);
  const laptops = mockProducts.filter(p => p.category === 'laptop').slice(0, 5);
  const promotionProducts = mockProducts.filter(p => p.isPromotion).slice(0, 10);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Hero Banner Slider - Điều chỉnh kích thước và thiết kế */}
      <div className="container mx-auto px-4 mb-4">
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {placeholderBanners.map((banner, index) => (
              <div key={index} className="min-w-full">
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-auto object-cover max-h-[400px]"
                />
              </div>
            ))}
          </div>

          {/* Banner Controls */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
            onClick={prevSlide}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
            onClick={nextSlide}
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {placeholderBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === index ? 'bg-yellow-500' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xs text-center">{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Small Banner Row */}
      <div className="container mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {smallBanners.map((banner, index) => (
            <a key={index} href="#" className="block rounded-lg overflow-hidden shadow-sm">
              <img
                src={banner}
                alt={`Promo ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Flash Sale / Promotion */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-red-600">FLASH SALE</h2>
              <div className="flex gap-1 p-1 bg-red-600 text-white rounded">
                <div className="flex flex-col items-center">
                  <span className="text-xs">02</span>
                  <span className="text-xs">Giờ</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs">45</span>
                  <span className="text-xs">Phút</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs">21</span>
                  <span className="text-xs">Giây</span>
                </div>
              </div>
            </div>
            <a href="/promotions" className="text-blue-600 text-sm">Xem tất cả &gt;</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {promotionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Smartphone Section */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">ĐIỆN THOẠI NỔI BẬT</h2>
            <a href="/category/smartphone" className="text-blue-600 text-sm">Xem tất cả &gt;</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {smartphones.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Laptop Section */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">LAPTOP NỔI BẬT</h2>
            <a href="/category/laptop" className="text-blue-600 text-sm">Xem tất cả &gt;</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {laptops.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* News and Tips */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">TIN TỨC CÔNG NGHỆ</h2>
            <a href="/news" className="text-blue-600 text-sm">Xem tất cả &gt;</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <a key={index} href={`/news/${index + 1}`} className="block group">
                <div className="rounded-lg overflow-hidden mb-2">
                  <img
                    src={`https://via.placeholder.com/400x200/2196F3/ffffff?text=Tin+tức+${index + 1}`}
                    alt={`Tin tức ${index + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {index === 0 ? 'So sánh Galaxy S24 Ultra với iPhone 15 Pro Max: Đâu là lựa chọn tốt nhất?' :
                    index === 1 ? 'Top 5 laptop gaming giá rẻ đáng mua nhất năm 2025' :
                      'Cách chọn phụ kiện phù hợp cho thiết bị của bạn'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('vi-VN')}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
