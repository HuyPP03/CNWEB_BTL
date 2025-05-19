import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const [autoPlay] = useState(true);
    const [bannersLoaded, setBannersLoaded] = useState<boolean[]>([]);
    const banners = [
        {
            url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-thu-cu-moi-home.jpg',
            alt: 'iPhone 16 Pro Max promotion',
            link: '/promotions/iphone'
        },
        {
            url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/m4-len-doi-tang-airpods-4.jpg',
            alt: 'M4 upgrade with AirPods 4',
            link: '/promotions/m4'
        },
        {
            url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/d6/6a/d66a6f0df04ded33afc9223bcffc57f7.png',
            alt: 'Tech promotion banner',
            link: '/promotions'
        },
        {
            url: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-m4-12-06.jpg',
            alt: 'M4 category promotion',
            link: '/category/m4'
        },
        {
            url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ff/8d/ff8d444f0ee95b8be4e88ed584ae861e.png',
            alt: 'Special deal banner',
            link: '/deals'
        },
        {
            url: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/c1/8d/c18de02da648ceb2e6ea6d1e7def18aa.png',
            alt: 'New arrivals banner',
            link: '/new-arrivals'
        },
    ];

    // Initialize banner loading states
    useEffect(() => {
        setBannersLoaded(new Array(banners.length).fill(false));
    }, [banners.length]);

    // Handle banner image load
    const handleBannerLoad = (index: number) => {
        setBannersLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

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
    return (
        <section aria-label="Featured Promotions" className="container mx-auto px-4 mb-4">
            <div className="relative overflow-hidden rounded-lg shadow-md">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={index} className="min-w-full relative">
                            <Link to={banner.link}>
                                {!bannersLoaded[index] && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                        <span className="sr-only">Loading banner image</span>
                                        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <img
                                    src={banner.url}
                                    alt={banner.alt}
                                    className={`w-full h-auto object-cover max-h-[400px] transition-opacity duration-300 ${bannersLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => handleBannerLoad(index)}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Banner Controls - Improved accessibility */}
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors z-10"
                    onClick={prevSlide}
                    aria-label="Previous banner"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors z-10"
                    onClick={nextSlide}
                    aria-label="Next banner"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Dots - Accessible Navigation */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {banners.map((banner, index) => (
                        <button
                            key={index}
                            onClick={() => setSlide(index)}
                            aria-label={`Go to slide ${index + 1}: ${banner.alt}`}
                            aria-current={currentSlide === index ? "true" : "false"}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === index ? 'bg-yellow-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}