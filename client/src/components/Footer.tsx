import React from 'react';

interface FooterLink {
  text: string;
  url: string;
  phone?: string;
  time?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const footerData: FooterColumn[] = [
    {
      title: "Tổng đài hỗ trợ",
      links: [
        { text: "Gọi mua", url: "#", phone: "1900 232 460", time: "(8:00 - 21:30)" },
        { text: "Khiếu nại", url: "#", phone: "1800.1062", time: "(8:00 - 21:30)" },
        { text: "Bảo hành", url: "#", phone: "1900 232 464", time: "(8:00 - 21:00)" }
      ]
    },
    {
      title: "Về công ty",
      links: [
        { text: "Giới thiệu công ty (MWG.vn)", url: "#" },
        { text: "Tuyển dụng", url: "#" },
        { text: "Gửi góp ý, khiếu nại", url: "#" },
        { text: "Tìm siêu thị (2.960 shop)", url: "#" }
      ]
    },
    {
      title: "Thông tin khác",
      links: [
        { text: "Tích điểm Quà tặng VIP", url: "#" },
        { text: "Lịch sử mua hàng", url: "#" },
        { text: "Đăng ký bán hàng CTV chiết khấu cao", url: "#" },
        { text: "Tìm hiểu về mua trả chậm", url: "#" },
        { text: "Chính sách bảo hành", url: "#" },
        { text: "Xem thêm", url: "#" }
      ]
    }
  ];

  const affiliateWebsites = [
    { name: "topzone", url: "#", imgSrc: "" },
    { name: "thegioididong", url: "#", imgSrc: "" },
    { name: "dienmayxanh", url: "#", imgSrc: "" },
    { name: "bachhoaxanh", url: "#", imgSrc: "" },
    { name: "nhathuoc", url: "#", imgSrc: "" },
    { name: "vieclam", url: "#", imgSrc: "" },
    { name: "4kfarm", url: "#", imgSrc: "" },
    { name: "avakids", url: "#", imgSrc: "" }
  ];

  const socialStats = [
    { count: "3886.8k", label: "Fan" },
    { count: "873k", label: "Đăng ký" },
    { count: "", label: "Zalo TGDD" }
  ];

  const certifications = [
    { name: "bct", imgSrc: "https://via.placeholder.com/32x32" },
    { name: "dmca", imgSrc: "https://via.placeholder.com/100x32" },
    { name: "ncsc", imgSrc: "https://via.placeholder.com/100x32" }
  ];

  return (
    <footer className="bg-white px-4 py-6 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Support and company info columns */}
          {footerData.map((column, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-medium text-gray-800 mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url} className="text-sm text-gray-600 hover:text-blue-600">
                      {link.text}
                      {link.phone && (
                        <span className="ml-1">
                          : <span className="text-blue-600">{link.phone}</span>
                          {link.time && <span className="text-gray-500 text-xs ml-1">{link.time}</span>}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Group websites column */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-4">Website cùng tập đoàn</h3>
            <div className="grid grid-cols-2 gap-2">
              {affiliateWebsites.map((site, index) => (
                <a
                  key={index}
                  href={site.url}
                  className="block border border-gray-200 rounded overflow-hidden hover:opacity-80 transition"
                >
                  <img
                    src={site.imgSrc}
                    alt={site.name}
                    className="w-full h-8 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Social stats and certifications */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4">
              {socialStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <div className="text-sm">
                    {stat.count && <span className="font-medium">{stat.count} </span>}
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="h-8">
                  <img
                    src={cert.imgSrc}
                    alt={cert.name}
                    className="h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;