export type Product = {
  id: string;
  name: string;
  category: string;
  category_id?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  configurations?: {
    cpu?: string[];
    ram?: string[];
    storage?: string[];
    gpu?: string[];
  };
};

export const formatPrice = (value: number) => `${value.toLocaleString('vi-VN')} ₫`;

export const categories = [
  {
    "id": "accessories",
    "name": "Phụ Kiện",
    "count": 5,
    "icon": "🔌",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "cpu",
    "name": "CPU",
    "count": 5,
    "icon": "⚙️",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "gaming-pc",
    "name": "PC Gaming",
    "count": 4,
    "icon": "🖥️",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "gpu",
    "name": "GPU",
    "count": 5,
    "icon": "🎮",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "headset",
    "name": "Tai Nghe",
    "count": 3,
    "icon": "🎧",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "keyboard",
    "name": "Bàn Phím",
    "count": 3,
    "icon": "⌨️",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "laptop",
    "name": "Laptop",
    "count": 9,
    "icon": "💻",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "monitor",
    "name": "Màn Hình",
    "count": 4,
    "icon": "🖥️",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "mouse",
    "name": "Chuột",
    "count": 3,
    "icon": "🖱️",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "office-pc",
    "name": "PC Văn Phòng",
    "count": 2,
    "icon": "🧑‍💻",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "ram",
    "name": "RAM",
    "count": 3,
    "icon": "🧠",
    "createdAt": "2026-08-28T07:12:29.000Z"
  },
  {
    "id": "ssd",
    "name": "SSD",
    "count": 3,
    "icon": "💾",
    "createdAt": "2026-08-28T07:12:29.000Z"
  }
];

export const products: Product[] = [
  {
    "id": "acc-001",
    "name": "Tản nhiệt nước AIO Corsair iCUE LINK H150i LCD 360mm White",
    "category": "accessories",
    "category_id": "accessories",
    "price": 6890000,
    "oldPrice": 7590000,
    "discount": 9,
    "rating": 4.9,
    "reviewCount": 62,
    "stock": 20,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Hệ sinh thái thông minh iCUE LINK kết nối 1 dây duy nhất, màn hình IPS LCD 2.1 inch hiển thị nhiệt độ hoặc ảnh GIF sống động.",
    "features": [
      "Công nghệ kết nối đơn dây iCUE LINK đi dây siêu gọn gàng",
      "Màn hình IPS LCD hiển thị thông số CPU/GPU thời gian thực hoặc ảnh GIF",
      "Bơm tản nhiệt công suất cao làm mát êm ái cho cả CPU i9 / R9",
      "Phần mềm iCUE đồng bộ hiệu ứng ánh sáng thông minh"
    ],
    "specifications": {
      "Kích thước Radiator": "360mm (397mm x 120mm x 27mm)",
      "Màn hình": "IPS LCD 2.1 inch (480x480) 60Hz 30fps 600 nits",
      "Quạt tản": "3x QX120 RGB Magnetic Dome Fans",
      "Tốc độ quạt": "480 - 2,400 RPM với chế độ Zero RPM",
      "Hỗ trợ Socket": "Intel LGA 1700/1851, AMD AM5/AM4"
    }
  },
  {
    "id": "acc-002",
    "name": "Giá Treo 2 Màn Hình Công Thái Học Human Motion T9 Pro Dual",
    "category": "accessories",
    "category_id": "accessories",
    "price": 1890000,
    "oldPrice": 2290000,
    "discount": 17,
    "rating": 4.8,
    "reviewCount": 145,
    "stock": 45,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Tay nâng arm màn hình đôi chịu lực siêu khỏe lên đến 15kg mỗi tay, nâng đỡ màn hình lên tới 35 inch, trợ lực lò xo cơ học Gas Spring bền bỉ.",
    "features": [
      "Chịu tải khủng lên đến 15kg đỡ mượt màn cong lớn 34-35 inch",
      "Piston trợ lực Gas Spring nâng hạ nhẹ nhàng bằng 1 đầu ngón tay",
      "Rãnh giấu dây cáp thông minh giúp bàn làm việc gọn gàng tinh tế",
      "Chất liệu hợp kim nhôm đúc nguyên khối siêu cứng cáp"
    ],
    "specifications": {
      "Tải trọng": "3kg - 15kg mỗi tay (Tổng 30kg)",
      "Kích thước màn hỗ trợ": "17 - 35 inch mỗi màn",
      "Chuẩn VESA": "75x75mm và 100x100mm",
      "Góc xoay": "Xoay 360°, gập ngửa +90°/-45°, xoay ngang 180°",
      "Lắp đặt": "Kẹp bàn hoặc khoan lỗ bàn (Bàn dày 10-85mm)"
    }
  },
  {
    "id": "acc-003",
    "name": "Ghế Công Thái Học Ergonomic Sihoo Doro C300 Lưới Toàn Thân",
    "category": "accessories",
    "category_id": "accessories",
    "price": 6490000,
    "oldPrice": 7290000,
    "discount": 11,
    "rating": 4.9,
    "reviewCount": 185,
    "stock": 25,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1580481077194-c1598fefad19?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1580481077194-c1598fefad19?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Ghế công thái học bảo vệ cột sống thắt lưng cao cấp, đệm thắt lưng tự động thích ứng chuyển động cơ thể, tay vịn 6D điều chỉnh đa hướng linh hoạt.",
    "features": [
      "Hệ thống nâng đỡ lưng dưới tự động ôm sát lưng khi ngồi thẳng hay ngả nghiêng",
      "Lưới toàn thân Cloud Mesh mát mẻ không tích tụ nhiệt vào mùa hè",
      "Góc ngả lưng thư giãn 138 độ có kê chân mở rộng ngủ trưa tiện lợi",
      "Chịu tải trọng tối đa lên tới 150 kg cực kỳ vững chắc"
    ],
    "specifications": {
      "Chất liệu": "Lưới mây Polymer Cloud Mesh thoáng khí đàn hồi cao",
      "Đệm thắt lưng": "Cơ chế tự động thích ứng Dynamic Lumbar Support",
      "Kê tay": "Tay vịn 6D xoay đồng bộ theo tư thế ngả lưng",
      "Tựa đầu": "Tựa đầu 3D ôm sát đốt sống cổ",
      "Piston": "Thủy lực Class 4 đạt chuẩn chứng nhận an toàn TUV"
    }
  },
  {
    "id": "acc-004",
    "name": "Ghế Gaming Da PU Cao Cấp Corsair T3 Rush Charcoal",
    "category": "accessories",
    "category_id": "accessories",
    "price": 5990000,
    "oldPrice": 6690000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 95,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Thiết kế lấy cảm hứng từ ghế ngồi xe đua thể thao chuyên nghiệp, bọc vải nỉ cao cấp thoáng khí mát mẻ kết hợp gối đệm mút hoạt tính cao cấp.",
    "features": [
      "Chất liệu vải nỉ thoáng khí không bị nóng bí bách như da simili rẻ tiền",
      "Gối đệm cổ và đệm thắt lưng bọc nhung êm ái hỗ trợ tư thế ngồi chuẩn",
      "Khả năng ngả lưng 180 độ nghỉ ngơi thư giãn sau những trận game căng thẳng",
      "Khung thép dày dặn đảm bảo độ bền trên 5 năm sử dụng"
    ],
    "specifications": {
      "Chất liệu": "Vải nỉ thể thao mềm mại thoáng khí chống bám mồ hôi",
      "Khung ghế": "Khung thép cường lực định hình bền bỉ",
      "Kê tay": "Tay vịn 4D nâng hạ, trượt trước sau, xoay trái phải",
      "Góc ngả": "Ngả lưng phẳng 180 độ",
      "Bánh xe": "Bánh xe đôi 65mm chống trầy xước sàn gỗ"
    }
  },
  {
    "id": "acc-005",
    "name": "Micro Thu Âm Chuyên Nghiệp Elgato Wave:3 USB Condenser",
    "category": "accessories",
    "category_id": "accessories",
    "price": 3790000,
    "oldPrice": 4290000,
    "discount": 12,
    "rating": 4.9,
    "reviewCount": 140,
    "stock": 30,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Chiếc micro streaming và podcast tiêu chuẩn vàng của Elgato với công nghệ chống vỡ tiếng độc quyền Clipguard và phần mềm trộn âm Wave Link 9 kênh.",
    "features": [
      "Công nghệ độc quyền Clipguard tự động cân bằng âm thanh khi bạn hét lớn",
      "Nút cảm ứng trên đỉnh micro chạm nhẹ là tắt tiếng tức thì (Capacitive Mute)",
      "Phần mềm Wave Link trộn âm thanh chuyên nghiệp từ 9 nguồn âm thanh riêng biệt",
      "Tương thích hoàn hảo với bàn điều khiển Stream Deck"
    ],
    "specifications": {
      "Củ micro": "17mm Electret Condenser Capsule",
      "Định hướng thu": "Cardioid (Thu âm định hướng phía trước)",
      "Tần số lấy mẫu": "24-bit / 96kHz độ phân giải cao",
      "Dải tần đáp ứng": "70 – 20,000 Hz",
      "Kết nối": "Cáp Type-C to Type-A cắm là nhận (Plug & Play)"
    }
  },
  {
    "id": "cpu-001",
    "name": "Intel Core i9-13900K",
    "category": "cpu",
    "category_id": "cpu",
    "price": 8990000,
    "oldPrice": 9990000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 450,
    "stock": 45,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "CPU cao cấp cho gaming và workstation chuyên nghiệp",
    "features": [
      "24 cores",
      "8P+16E cores",
      "5.8 GHz Max",
      "Raptor Lake"
    ],
    "specifications": {
      "Cores": "24 (8P+16E)",
      "Threads": "32",
      "Base Clock": "3.0 GHz",
      "Max Clock": "5.8 GHz",
      "TDP": "253W"
    }
  },
  {
    "id": "cpu-002",
    "name": "AMD Ryzen 7 7800X3D (Vua Gaming CPU Hiện Nay)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 10490000,
    "oldPrice": 11990000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 310,
    "stock": 35,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Vi xử lý chuyên chơi game số 1 thế giới với công nghệ bộ nhớ đệm 3D V-Cache 96MB độc quyền, mang lại FPS cao nhất và độ ổn định tối đa.",
    "features": [
      "Hiệu năng gaming vượt trội hơn cả các dòng CPU cao cấp nhất",
      "Bộ nhớ đệm 3D V-Cache khổng lồ 96MB cho FPS ổn định vượt bậc",
      "Tiêu thụ điện năng cực thấp so với hiệu năng đạt được",
      "Hỗ trợ nền tảng AM5 lâu dài đến năm 2027+"
    ],
    "specifications": {
      "Số nhân / Luồng": "8 nhân / 16 luồng",
      "Xung nhịp cơ bản": "4.2 GHz",
      "Xung nhịp tối đa": "5.0 GHz",
      "Bộ nhớ đệm (L3 Cache)": "96MB 3D V-Cache (Tổng 104MB)",
      "Socket": "AM5 (Hỗ trợ DDR5 & PCIe 5.0)",
      "TDP": "120W"
    }
  },
  {
    "id": "cpu-003",
    "name": "Intel Core i7-14700K (20 Cores / 28 Threads)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 10290000,
    "oldPrice": 11290000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 185,
    "stock": 28,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "CPU thế hệ 14 Raptor Lake Refresh được nâng cấp thêm 4 nhân E-core, hoàn hảo cho cả gaming và làm đồ họa render đa nhiệm nặng.",
    "features": [
      "Tăng thêm 4 nhân E-core so với thế hệ 13 giúp render nhanh hơn 18%",
      "Xung nhịp boost lên đến 5.6 GHz xử lý tác vụ đơn nhân cực nhạy",
      "Hỗ trợ cả chuẩn RAM DDR4 lẫn DDR5 linh hoạt",
      "Tích hợp sẵn nhân đồ họa Intel UHD 770"
    ],
    "specifications": {
      "Số nhân / Luồng": "20 Cores (8P + 12E) / 28 Threads",
      "Xung nhịp Max": "5.6 GHz Intel Thermal Velocity Boost",
      "Smart Cache": "33MB Intel Smart Cache",
      "Socket": "LGA 1700",
      "Hỗ trợ RAM": "DDR5 5600MHz / DDR4 3200MHz",
      "TDP": "125W (Turbo 253W)"
    }
  },
  {
    "id": "cpu-004",
    "name": "AMD Ryzen 9 7950X3D (16 Cores / 32 Threads, 144MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 16990000,
    "oldPrice": 18490000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 92,
    "stock": 15,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "CPU cao cấp nhất của đội Đỏ kết hợp hoàn hảo giữa 16 nhân làm việc đồ họa nặng và bộ nhớ đệm 3D V-Cache cho FPS game đỉnh chóp.",
    "features": [
      "Vừa render 3D / Premiere siêu tốc vừa chơi game max setting",
      "Bộ nhớ đệm 144MB khổng lồ khử hoàn toàn hiện tượng drop FPS",
      "Hỗ trợ ép xung tự động Precision Boost Overdrive (PBO)",
      "Tương thích socket AM5 hỗ trợ cập nhật lâu dài"
    ],
    "specifications": {
      "Số nhân / Luồng": "16 nhân / 32 luồng",
      "Xung nhịp": "4.2 GHz Boost lên 5.7 GHz",
      "Tổng bộ nhớ đệm": "144 MB (128MB L3 + 16MB L2)",
      "Socket": "AM5 (PCIe 5.0, DDR5)",
      "TDP": "120W tiết kiệm điện"
    }
  },
  {
    "id": "cpu-005",
    "name": "Intel Core i5-14600K (14 Cores / 20 Threads, 5.3 GHz)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 7690000,
    "oldPrice": 8490000,
    "discount": 9,
    "rating": 4.8,
    "reviewCount": 260,
    "stock": 45,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Vị vua CPU phân khúc tầm trung thế hệ 14 Raptor Lake Refresh, xung nhịp 5.3 GHz cân đẹp mọi cấu hình gaming từ RTX 4060 đến RTX 4070 Ti.",
    "features": [
      "Hiệu năng chơi game ngang ngửa các dòng Core i9 thế hệ cũ",
      "Khả năng ép xung linh hoạt với hệ số nhân mở (K)",
      "Công nghệ Intel QuickSync tối ưu xuất video trong Premiere",
      "Mức giá cực kỳ hợp lý cho cấu hình tầm trung"
    ],
    "specifications": {
      "Số nhân / Luồng": "14 nhân (6P + 8E) / 20 luồng",
      "Xung nhịp Max": "5.3 GHz Intel Turbo Boost",
      "Intel Smart Cache": "24 MB",
      "Socket": "LGA 1700",
      "Đồ họa": "Intel UHD Graphics 770 tích hợp"
    }
  },
  {
    "id": "gpu-001",
    "name": "RTX 4090",
    "category": "gpu",
    "category_id": "gpu",
    "price": 22990000,
    "oldPrice": 24990000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 320,
    "stock": 8,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Card đồ họa flagship cho gaming 4K ultra settings",
    "features": [
      "16,384 CUDA cores",
      "24GB GDDR6X",
      "PCIe 4.0"
    ],
    "specifications": {
      "Memory": "24GB GDDR6X",
      "Memory Speed": "20 Gbps",
      "TDP": "450W"
    }
  },
  {
    "id": "gpu-002",
    "name": "ASUS ROG Strix GeForce RTX 4080 Super 16GB OC",
    "category": "gpu",
    "category_id": "gpu",
    "price": 31990000,
    "oldPrice": 34990000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 84,
    "stock": 14,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Mẫu card đồ họa cao cấp nhất trong phân khúc RTX 4080 Super với tản nhiệt buồng hơi Vapor Chamber, khung kim loại nguyên khối đầm chắc và LED RGB Aura Sync.",
    "features": [
      "Kiến trúc NVIDIA Ada Lovelace thế hệ mới nhất với DLSS 3 Frame Generation",
      "Hệ thống quạt Axial-tech cánh đảo chiều gia tăng 23% lưu lượng gió",
      "Khung nhôm diecast bảo vệ PCB chống cong xệ card",
      "Dual BIOS chuyển đổi chế độ Yên Tĩnh (Quiet) và Hiệu Năng (Performance)"
    ],
    "specifications": {
      "CUDA Cores": "10,240 Cores",
      "Bộ nhớ": "16GB GDDR6X",
      "Tốc độ bộ nhớ": "23 Gbps",
      "Giao tiếp": "256-bit",
      "Cổng xuất hình": "2x HDMI 2.1a, 3x DisplayPort 1.4a",
      "Nguồn khuyến nghị": "850W (Đầu cấp nguồn 16-pin 12VHPWR)"
    }
  },
  {
    "id": "gpu-003",
    "name": "MSI GeForce RTX 4070 Super 12GB Gaming X Slim",
    "category": "gpu",
    "category_id": "gpu",
    "price": 18490000,
    "oldPrice": 19990000,
    "discount": 7,
    "rating": 4.8,
    "reviewCount": 142,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Phiên bản Slim mỏng nhẹ sang trọng, tối ưu cho mọi kích cỡ case máy tính mà vẫn giữ vững nhiệt độ mát mẻ và độ êm ái trứ danh của dòng Gaming X.",
    "features": [
      "Thiết kế Slim thanh lịch chiếm ít khe PCIe hơn",
      "Công nghệ tản nhiệt TRI FROZR 3 êm ái hàng đầu thị trường",
      "Hỗ trợ Ray Tracing thế hệ 3 và tạo khung hình thông minh DLSS 3.5",
      "Phần mềm MSI Center hỗ trợ ép xung và tùy chỉnh LED Mystic Light"
    ],
    "specifications": {
      "CUDA Cores": "7,168 Cores",
      "Bộ nhớ": "12GB GDDR6X",
      "Xung nhịp Boost": "2,640 MHz",
      "Băng thông": "192-bit",
      "Tản nhiệt": "TRI FROZR 3 với quạt TORX FAN 5.0",
      "Công suất tiêu thụ": "220W"
    }
  },
  {
    "id": "gpu-004",
    "name": "Gigabyte Radeon RX 7900 XTX Gaming OC 24GB VRAM",
    "category": "gpu",
    "category_id": "gpu",
    "price": 28990000,
    "oldPrice": 31990000,
    "discount": 9,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 11,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Card đồ họa đầu bảng kiến trúc RDNA 3 của AMD với bộ nhớ VRAM khổng lồ 24GB GDDR6, cổng kết nối DisplayPort 2.1 xuất hình ảnh 8K 165Hz.",
    "features": [
      "Dung lượng VRAM 24GB thoải mái load texture 4K và huấn luyện mô hình AI",
      "Băng thông chuẩn DisplayPort 2.1 mở khóa tần số quét màn hình 8K",
      "Công nghệ nâng cấp hình ảnh AMD FSR 3 Fluid Motion Frames",
      "Bảo hành chính hãng 4 năm từ Gigabyte"
    ],
    "specifications": {
      "Stream Processors": "6,144 Units",
      "VRAM": "24GB GDDR6 384-bit",
      "Xung nhịp Boost": "2,525 MHz",
      "Cổng xuất hình": "DisplayPort 2.1 và HDMI 2.1a",
      "Tản nhiệt": "Hệ thống tản nhiệt Windforce 3 quạt 100mm"
    }
  },
  {
    "id": "gpu-005",
    "name": "ASUS Dual GeForce RTX 4060 Ti White Edition 8GB OC",
    "category": "gpu",
    "category_id": "gpu",
    "price": 10990000,
    "oldPrice": 11990000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 165,
    "stock": 28,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Thiết kế màu trắng tinh tế kích thước nhỏ gọn 2.5 slot, quạt Axial-tech làm mát hiệu quả cho các dàn PC Gaming tone White.",
    "features": [
      "Tone màu Trắng White Edition sang trọng dễ phối màu case",
      "Hỗ trợ Ray Tracing thế hệ 3 và DLSS 3 mượt mà",
      "Quạt làm mát công nghệ vòng bi kép tuổi thọ cao",
      "Chế độ 0dB yên tĩnh khi card hoạt động ở nhiệt độ thấp"
    ],
    "specifications": {
      "CUDA Cores": "4,352 Cores",
      "Bộ nhớ": "8GB GDDR6 128-bit",
      "Xung nhịp OC": "2,595 MHz",
      "Cổng xuất hình": "1x HDMI 2.1a, 3x DisplayPort 1.4a",
      "Kích thước": "22.7 x 12.3 x 4.96 cm"
    }
  },
  {
    "id": "headset-001",
    "name": "Tai nghe Gaming Cao Cấp SteelSeries Arctis Nova Pro Wireless",
    "category": "headset",
    "category_id": "headset",
    "price": 8990000,
    "oldPrice": 9990000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 88,
    "stock": 16,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Đỉnh cao tai nghe gaming với chống ồn chủ động ANC 4 micro, dock trạm phát DAC có màn hình OLED tùy chỉnh EQ và hệ thống 2 pin thay nóng không bao giờ hết điện.",
    "features": [
      "Âm thanh vòm 360° Spatial Audio định vị chuẩn xác từng tiếng bước chân",
      "Chống ồn chủ động ANC loại bỏ tạp âm môi trường tuyệt đối",
      "Hệ thống 2 pin thay nóng liên tục 24/7 không cần cắm dây sạc",
      "Kết nối đồng thời 2 thiết bị vừa chơi game vừa nghe điện thoại"
    ],
    "specifications": {
      "Driver": "High Fidelity Drivers 40mm dải tần 10–40,000 Hz",
      "Chống ồn": "Active Noise Cancellation (ANC) 4 mic hybrid",
      "Hệ thống Pin": "2 pin tháo rời (Infinity Power System), 44 tiếng tổng",
      "Kết nối": "Dual Wireless 2.4GHz không độ trễ + Bluetooth đồng thời",
      "Dock điều khiển": "Base Station tích hợp màn hình OLED & DAC rời"
    }
  },
  {
    "id": "headset-003",
    "name": "Tai nghe Gaming Không Dây Razer BlackShark V2 Pro 2023",
    "category": "headset",
    "category_id": "headset",
    "price": 4490000,
    "oldPrice": 4990000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 160,
    "stock": 28,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Tai nghe esport huyền thoại nâng cấp microphone HyperClear Super Wideband dải tần siêu rộng chuẩn phòng thu, thời lượng pin khủng 70 giờ và đệm tai thoáng khí.",
    "features": [
      "Microphone đàm thoại trong trẻo chi tiết chuẩn phòng thu podcast",
      "Cấu hình âm thanh EQ được tinh chỉnh bởi các tuyển thủ Pro Player thế giới",
      "Đệm tai mút hoạt tính bọc vải siêu thoáng khí không bị nóng tai",
      "Thời lượng pin 70 giờ kết hợp sạc nhanh Type-C 15 phút nghe 6 giờ"
    ],
    "specifications": {
      "Driver": "Razer TriForce Titanium 50mm",
      "Microphone": "Razer HyperClear Super Wideband Mic (Tháo rời được)",
      "Kết nối": "Razer HyperSpeed Wireless 2.4GHz & Bluetooth 5.2",
      "Thời lượng Pin": "Lên đến 70 giờ chơi liên tục",
      "Trọng lượng": "320 gram siêu êm ái"
    }
  },
  {
    "id": "headset-004",
    "name": "Tai nghe Gaming Không Dây Sony INZONE H9 Chống Ồn ANC",
    "category": "headset",
    "category_id": "headset",
    "price": 5890000,
    "oldPrice": 6590000,
    "discount": 11,
    "rating": 4.8,
    "reviewCount": 72,
    "stock": 18,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Thừa hưởng công nghệ chống ồn danh tiếng của dòng Sony 1000X, tái tạo không gian âm thanh 360 Spatial Sound for Gaming tối ưu cho cả PC và PS5.",
    "features": [
      "Khử sạch tiếng ồn quạt máy tính và âm thanh môi trường xung quanh",
      "Phần mềm INZONE Hub chụp hình dáng tai để tối ưu hóa âm trường 3D cá nhân hóa",
      "Cần micro gạt lên để tắt tiếng tiện lợi (Flip to mute)",
      "Đồng bộ hoàn hảo giao diện trạng thái âm lượng trên máy chơi game PS5"
    ],
    "specifications": {
      "Chống ồn": "Dual Noise Sensor Technology (Chống ồn chủ động ANC & Chế độ âm thanh xung quanh)",
      "Âm thanh": "360 Spatial Sound for Gaming định vị chính xác",
      "Kết nối": "Wireless 2.4GHz qua USB dongle & Bluetooth",
      "Thời lượng Pin": "32 giờ tắt chống ồn, sạc nhanh 10 phút chơi 60 phút",
      "Đệm tai": "Da nhân tạo mềm mại tương tự dòng tai nghe đầu bảng WH-1000XM5"
    }
  },
  {
    "id": "kbd-002",
    "name": "Bàn phím cơ FL-Esports OG98 Retro White Wireless 3-Mode",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2390000,
    "oldPrice": 2790000,
    "discount": 14,
    "rating": 4.9,
    "reviewCount": 154,
    "stock": 35,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Bàn phím cơ thiết kế phong cách Retro cổ điển thập niên 90 nhưng sở hữu công nghệ hiện đại: Gasket Mount êm ái, Hotswap và kết nối 3 chế độ.",
    "features": [
      "Thiết kế Retro Vintage hoài niệm cực kỳ phong cách cho góc setup",
      "Gõ đầm tay, âm thanh Thocky trầm ấm nhờ cấu trúc lót foam 5 lớp",
      "Mạch Hotswap xuôi dễ dàng thay đổi mọi loại switch 3-pin / 5-pin",
      "Thời lượng pin bền bỉ hỗ trợ vừa sạc vừa dùng tiện lợi"
    ],
    "specifications": {
      "Layout": "98 phím (Có cụm số Numpad đầy đủ)",
      "Kết nối": "Bluetooth 5.0 / Wireless 2.4GHz / Cáp Type-C",
      "Switch": "Kailh Ice Mint / White Cream (Pre-lubed)",
      "Keycap": "PBT Double-Shot OEM Profile chống mòn bóng",
      "Cấu trúc": "Gasket Mount tiêu âm 5 lớp",
      "Dung lượng Pin": "4000 mAh sử dụng đến 4 tuần"
    }
  },
  {
    "id": "kbd-004",
    "name": "Bàn phím cơ Akko MOD007B PC Tokyo R2 Wireless (Magnetic Switch)",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2490000,
    "oldPrice": 2890000,
    "discount": 14,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 30,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Bàn phím cơ sử dụng switch từ tính Magnetic Switch với tính năng Rapid Trigger đỉnh cao dành cho game thủ FPS (Valorant / CS2) di chuyển dừng ngắm tức thì.",
    "features": [
      "Tính năng Rapid Trigger nhận diện hành trình phím sub-millimeter 0.1mm",
      "Switch từ tính Hall Effect không điểm tiếp xúc cơ học, tuổi thọ 100 triệu lần nhấn",
      "Họa tiết hoa anh đào Tokyo R2 tuyệt đẹp cho góc làm việc",
      "Phần mềm Akko Cloud Driver tùy chỉnh macro và độ nhạy từng phím"
    ],
    "specifications": {
      "Switch": "Akko Cream Yellow Magnetic Switch (Hall Effect)",
      "Tính năng đặc biệt": "Rapid Trigger điều chỉnh điểm nhận từ 0.1mm - 4.0mm",
      "Kết nối": "3 chế độ: Type-C, Bluetooth 5.0, Wireless 2.4GHz",
      "Keycap": "PBT Dye-Sub OEM Profile chủ đề Hoa Anh Đào Tokyo",
      "Núm xoay": "Knob nhôm điều khiển âm lượng đa phương tiện"
    }
  },
  {
    "id": "kbd-005",
    "name": "Bàn phím cơ không dây Logitech G915 TKL Lightspeed White",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 4290000,
    "oldPrice": 4890000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 140,
    "stock": 22,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Bàn phím cơ Low-Profile siêu mỏng vỏ nhôm xước phi thuyền, công nghệ không dây Lightspeed độ trễ 1ms và con lăn chỉnh âm lượng bằng kim loại sang trọng.",
    "features": [
      "Thiết kế Low-Profile siêu mỏng gõ êm không cần kê tay",
      "Công nghệ không dây Lightspeed thi đấu thể thao điện tử chuẩn xác",
      "Con lăn âm lượng bằng nhôm xoay mượt mà",
      "LED RGB LIGHTSYNC 16.8 triệu màu đồng bộ"
    ],
    "specifications": {
      "Layout": "TKL (Tenkeyless) gọn gàng",
      "Switch": "GL Tactile Low Profile (Hành trình ngắn 1.5mm)",
      "Kết nối": "Lightspeed 2.4GHz (1ms) & Bluetooth",
      "Chất liệu": "Hợp kim nhôm 5052 chải xước cao cấp",
      "Pin": "Lên đến 40 giờ bật LED RGB 100%"
    }
  },
  {
    "id": "lap-001",
    "name": "Pro Gaming Laptop X15",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18990000,
    "oldPrice": 20990000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 128,
    "stock": 15,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Laptop gaming mạnh mẽ dành cho gameplay, sáng tạo và làm việc chuyên nghiệp",
    "features": [
      "Intel Core i7",
      "RTX 4070",
      "32GB DDR5",
      "1TB NVMe SSD",
      "144Hz display"
    ],
    "specifications": {
      "CPU": "Intel Core i7-13700H",
      "GPU": "NVIDIA RTX 4070",
      "RAM": "32GB DDR5",
      "Storage": "1TB NVMe SSD",
      "Display": "15.6 QHD 165Hz"
    }
  },
  {
    "id": "lap-002",
    "name": "UltraBook Pro 14",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13990000,
    "oldPrice": 15990000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 95,
    "stock": 20,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Ultrabook siêu nhẹ, pin lâu dành cho công việc văn phòng và di động",
    "features": [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
      "14 4K display"
    ],
    "specifications": {
      "CPU": "Intel Core i5-1340P",
      "RAM": "16GB LPDDR5",
      "Storage": "512GB SSD",
      "Display": "14 4K"
    }
  },
  {
    "id": "lap-003",
    "name": "MacBook Pro 16 M3 Max (36GB RAM / 1TB SSD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 89990000,
    "oldPrice": 94990000,
    "discount": 5,
    "rating": 5,
    "reviewCount": 96,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Siêu phẩm MacBook Pro 16 inch trang bị chip Apple M3 Max đỉnh cao cho xử lý đồ họa, lập trình và dựng video 8K chuyên nghiệp.",
    "features": [
      "Chip M3 Max đột phá với 14 nhân CPU và 30 nhân GPU",
      "Màn hình Liquid Retina XDR độ sáng tối đa 1600 nits",
      "Thời lượng pin khủng nhất từ trước đến nay (22 tiếng)",
      "Hệ thống 6 loa âm thanh vòm Spatial Audio đẳng cấp"
    ],
    "specifications": {
      "Chip": "Apple M3 Max 14-core CPU / 30-core GPU",
      "RAM": "36GB Unified Memory",
      "Ổ cứng": "1TB SSD siêu nhanh",
      "Màn hình": "16.2 inch Liquid Retina XDR (3456x2234), 120Hz ProMotion",
      "Pin": "Lên đến 22 giờ liên tục",
      "Trọng lượng": "2.14 kg"
    }
  },
  {
    "id": "lap-004",
    "name": "ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX • RTX 4080",
    "category": "laptop",
    "category_id": "laptop",
    "price": 72990000,
    "oldPrice": 79990000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 68,
    "stock": 8,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Chiến hạm gaming ASUS ROG Strix SCAR 18 màn hình 2.5K 240Hz Nebula HDR, cấu hình đỉnh cao cân mọi tựa game AAA ở thiết lập Ultra settings.",
    "features": [
      "Màn hình Mini LED 18 inch cực đại 240Hz 3ms",
      "Card RTX 4080 175W mạnh mẽ với công nghệ MUX Switch & NVIDIA Advanced Optimus",
      "Hệ thống tản nhiệt thông minh 3 quạt làm mát",
      "Bàn phím cơ quang học Per-Key RGB Aura Sync"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8 GHz)",
      "GPU": "NVIDIA GeForce RTX 4080 12GB GDDR6X (175W TGP)",
      "RAM": "32GB DDR5 5600MHz (Hỗ trợ nâng cấp 64GB)",
      "Ổ cứng": "1TB PCIe 4.0 NVMe M.2 SSD",
      "Màn hình": "18 inch 2.5K (2560x1600) ROG Nebula HDR, 240Hz, Mini LED",
      "Tản nhiệt": "Kim loại lỏng Conductonaut Extreme + 3 quạt làm mát"
    }
  },
  {
    "id": "lap-005",
    "name": "Dell XPS 16 9640 Core Ultra 9 185H • RTX 4070 8GB",
    "category": "laptop",
    "category_id": "laptop",
    "price": 64990000,
    "oldPrice": 69990000,
    "discount": 7,
    "rating": 4.8,
    "reviewCount": 52,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Tuyệt phẩm thiết kế tương lai từ Dell với vỏ nhôm CNC nguyên khối, viền màn hình siêu mỏng InfinityEdge và bàn rê chuột kính vô cực tàng hình.",
    "features": [
      "Thiết kế tương lai với Touchpad vô hình haptic cảm ứng lực",
      "Màn hình 4K+ OLED cảm ứng với màu sắc chính xác 100% DCI-P3",
      "Tích hợp nhân xử lý AI Intel AI Boost",
      "Hệ thống âm thanh 4 loa công suất 10W đạt chuẩn Dolby Atmos"
    ],
    "specifications": {
      "CPU": "Intel Core Ultra 9 185H tích hợp nhân AI NPU",
      "GPU": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "RAM": "32GB LPDDR5X 7467MHz Dual Channel",
      "Ổ cứng": "1TB NVMe PCIe Gen4 SSD",
      "Màn hình": "16.3 inch 4K+ OLED Touchscreen (3840x2400) 100% DCI-P3",
      "Chất liệu": "Nhôm nguyên khối Platinum Silver & Kính cường lực Gorilla Glass 3"
    }
  },
  {
    "id": "lap-006",
    "name": "Lenovo Legion Pro 7i Gen 9 (Core i9-14900HX • RTX 4090 16GB)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 85990000,
    "oldPrice": 92990000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 48,
    "stock": 7,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Cỗ máy gaming hoàn hảo nhất của Lenovo với chip AI LA2-Q, tản nhiệt buồng hơi Legion Coldfront Vapor và màn hình PureSight 240Hz 500 nits.",
    "features": [
      "Chip AI độc quyền Lenovo LA2-Q tự động tối ưu hóa FPS trong thời gian thực",
      "Card đồ họa RTX 4090 16GB VRAM chạy tối đa công suất 175W TGP",
      "Bàn phím Legion TrueStrike switch nảy 1.5mm chống bóng per-key RGB",
      "Hỗ trợ sạc siêu nhanh Super Rapid Charge 330W"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900HX (24 cores, 32 threads, 5.8 GHz)",
      "GPU": "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)",
      "RAM": "32GB DDR5 5600MHz Dual-Channel",
      "Ổ cứng": "2TB SSD M.2 PCIe Gen 4",
      "Màn hình": "16\" WQXGA (2560x1600) IPS 240Hz, 500 nits, 100% DCI-P3",
      "Vỏ máy": "Hợp kim nhôm Anodized cao cấp màu xám Eclipse Black"
    }
  },
  {
    "id": "lap-007",
    "name": "Acer Predator Helios 16 Neo (Core i7-14700HX • RTX 4060)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 33990000,
    "oldPrice": 37990000,
    "discount": 11,
    "rating": 4.8,
    "reviewCount": 115,
    "stock": 18,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Laptop gaming quốc dân phân khúc cận cao cấp, trang bị tản nhiệt quạt kim loại AeroBlade 3D thế hệ 5 và keo tản nhiệt kim loại lỏng mát lạnh.",
    "features": [
      "Hiệu năng RTX 4060 140W tối đa chiến mượt mọi game 2K",
      "Công nghệ quạt tản nhiệt cánh thép mỏng 0.08mm êm ái",
      "Màn hình chuẩn đồ họa 16:10 sắc nét 165Hz",
      "Hỗ trợ Wi-Fi 6E siêu tốc độ"
    ],
    "specifications": {
      "CPU": "Intel Core i7-14700HX (20 cores, 28 threads)",
      "GPU": "NVIDIA GeForce RTX 4060 8GB GDDR6 140W MUX Switch",
      "RAM": "16GB DDR5 5600MHz",
      "Ổ cứng": "512GB PCIe NVMe SSD (Còn trống 1 khe M.2)",
      "Màn hình": "16 inch WQXGA (2560x1600) 165Hz 100% sRGB",
      "Tản nhiệt": "2 quạt thép AeroBlade 3D + Keo kim loại lỏng"
    }
  },
  {
    "id": "lap-008",
    "name": "Apple MacBook Air 15 inch M3 (16GB RAM / 512GB SSD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 36990000,
    "oldPrice": 39990000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 82,
    "stock": 22,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Chiếc laptop 15 inch mỏng nhẹ nhất thế giới trang bị chip Apple M3, thiết kế không quạt hoàn toàn tĩnh lặng, pin 18 giờ và màu Midnight tuyệt đẹp.",
    "features": [
      "Màn hình lớn 15.3 inch Liquid Retina hiển thị 1 tỷ màu",
      "Thiết kế Fanless không quạt tản nhiệt hoạt động im lặng 100%",
      "Hỗ trợ xuất đồng thời 2 màn hình ngoài khi gập máy",
      "Cổng sạc MagSafe 3 an toàn và 2 cổng Thunderbolt / USB 4"
    ],
    "specifications": {
      "Chip": "Apple M3 chip (8-core CPU / 10-core GPU / 16-core Neural Engine)",
      "RAM": "16GB Unified Memory",
      "Ổ cứng": "512GB SSD",
      "Màn hình": "15.3 inch Liquid Retina (2880x1864) 500 nits True Tone",
      "Độ mỏng": "Chỉ 11.5 mm siêu mỏng",
      "Trọng lượng": "1.51 kg"
    }
  },
  {
    "id": "lap-009",
    "name": "ASUS Zenbook 14 OLED UX3405 (Intel Core Ultra 7 155H)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 26990000,
    "oldPrice": 29990000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 14,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Ultrabook doanh nhân cao cấp mỏng nhẹ chuẩn quân đội với màn hình Lumina OLED 3K 120Hz, pin 75Wh dùng cả ngày và tích hợp trí tuệ nhân tạo Intel AI.",
    "features": [
      "Màn hình 3K OLED 120Hz đạt chuẩn màu Pantone Validated",
      "Pin dung lượng khủng 75Wh cho thời lượng lên đến 15 giờ",
      "Tích hợp nhân NPU xử lý các tác vụ AI tạo sinh nhanh chóng",
      "Bàn phím êm ái ErgoSense và bàn di chuột ảo NumberPad"
    ],
    "specifications": {
      "CPU": "Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU AI)",
      "Đồ họa": "Intel Arc Graphics tích hợp mạnh mẽ",
      "RAM": "32GB LPDDR5X 7467MHz",
      "Ổ cứng": "1TB PCIe 4.0 NVMe SSD",
      "Màn hình": "14 inch 3K OLED (2880 x 1800), 120Hz, 0.2ms, 100% DCI-P3",
      "Trọng lượng": "1.2 kg siêu nhẹ"
    }
  },
  {
    "id": "mon-002",
    "name": "Màn hình Gaming ASUS ROG Swift OLED PG27AQDM 27\" 240Hz 0.03ms",
    "category": "monitor",
    "category_id": "monitor",
    "price": 23490000,
    "oldPrice": 25990000,
    "discount": 9,
    "rating": 5,
    "reviewCount": 112,
    "stock": 15,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Màn hình gaming OLED đỉnh cao với độ tương phản vô cực, thời gian đáp ứng siêu tốc 0.03ms và tần số quét 240Hz mượt mà không đối thủ.",
    "features": [
      "Tấm nền OLED đen sâu tuyệt đối, màu sắc sống động chân thực",
      "Tần số quét 240Hz kết hợp 0.03ms GTG triệt tiêu hoàn toàn bóng mờ",
      "Tản nhiệt tùy chỉnh độc quyền và bảo vệ màn hình chống lưu ảnh Burn-in",
      "Tương thích NVIDIA G-Sync Compatible & AMD FreeSync Premium"
    ],
    "specifications": {
      "Kích thước": "26.5 inch",
      "Tấm nền": "OLED (Độ tương phản 1,500,000:1)",
      "Độ phân giải": "2K QHD (2560 x 1440)",
      "Tần số quét": "240 Hz",
      "Thời gian đáp ứng": "0.03ms (GTG)",
      "Độ phủ màu": "99% DCI-P3, 135% sRGB, Delta E < 2"
    }
  },
  {
    "id": "mon-003",
    "name": "Màn hình Đồ Họa Dell UltraSharp U2724D 27\" 2K 120Hz IPS Black",
    "category": "monitor",
    "category_id": "monitor",
    "price": 10490000,
    "oldPrice": 11500000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 94,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Màn hình chuyên đồ họa với tấm nền IPS Black tương phản 2000:1 đầu tiên, tích hợp cảm biến ánh sáng tự động điều chỉnh độ sáng và tần số quét mượt 120Hz.",
    "features": [
      "Công nghệ IPS Black tăng gấp đôi độ sâu màu đen so với IPS thông thường",
      "Tần số quét nâng cấp lên 120Hz cho chuyển động cuộn trang êm ái",
      "Cảm biến môi trường tự động cân chỉnh độ sáng và nhiệt độ màu",
      "Chứng nhận mắt EyeSafe bảo vệ thị lực khi làm việc nhiều giờ"
    ],
    "specifications": {
      "Kích thước": "27 inch",
      "Tấm nền": "IPS Black (Độ tương phản 2000:1)",
      "Độ phân giải": "2K QHD (2560 x 1440)",
      "Tần số quét": "120 Hz",
      "Độ phủ màu": "100% sRGB, 98% DCI-P3, Delta E < 2",
      "Cổng kết nối": "DisplayPort 1.4, HDMI, USB-C Hub 90W sạc nhanh"
    }
  },
  {
    "id": "mon-004",
    "name": "Màn hình Cong Siêu Rộng Samsung Odyssey OLED G9 49\" 240Hz 0.03ms",
    "category": "monitor",
    "category_id": "monitor",
    "price": 36990000,
    "oldPrice": 41990000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 45,
    "stock": 8,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Màn hình gaming OLED tỷ lệ 32:9 tương đương 2 màn hình 27 inch ghép lại, độ cong 1800R bao trọn tầm nhìn, tần số quét 240Hz và chip xử lý Neo Quantum Processor Pro.",
    "features": [
      "Tỷ lệ siêu rộng 32:9 trải nghiệm đua xe, bay lượn và đa nhiệm 3 cửa sổ",
      "Tấm nền OLED màu sắc tuyệt mỹ với độ sâu màu đen vô cực",
      "Thiết kế mặt lưng kim loại mỏng chỉ 4.5mm cùng vòng LED CoreSync RGB",
      "Tích hợp nền tảng Smart TV và Gaming Hub chơi game đám mây không cần PC"
    ],
    "specifications": {
      "Kích thước": "49 inch siêu rộng Dual QHD (5120 x 1440)",
      "Tấm nền": "OLED (Độ cong 1800R, độ tương phản 1.000.000:1)",
      "Tần số quét": "240 Hz",
      "Thời gian đáp ứng": "0.03 ms (GTG)",
      "Độ sáng": "VESA DisplayHDR True Black 400",
      "Âm thanh": "Loa stereo 5W x 2 tích hợp"
    }
  },
  {
    "id": "mon-005",
    "name": "Màn hình LG UltraGear 27GR93U 27\" 4K UHD 144Hz 1ms IPS",
    "category": "monitor",
    "category_id": "monitor",
    "price": 13990000,
    "oldPrice": 15490000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 130,
    "stock": 25,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Màn hình 4K sắc nét chuẩn gaming với tần số quét 144Hz qua cổng HDMI 2.1, tấm nền Fast IPS góc nhìn rộng và dải màu 95% DCI-P3.",
    "features": [
      "Độ phân giải 4K siêu sắc nét 163 điểm ảnh trên mỗi inch",
      "Cổng HDMI 2.1 băng thông tối đa tương thích hoàn hảo cho PS5 và Xbox Series X",
      "Hỗ trợ NVIDIA G-Sync Compatible và AMD FreeSync Premium",
      "Giao diện điều khiển OSD chuyên dụng cho game thủ"
    ],
    "specifications": {
      "Kích thước": "27 inch 4K UHD (3840 x 2160)",
      "Tấm nền": "IPS (144Hz, 1ms GTG)",
      "Chuẩn màu": "DCI-P3 95% (CIE1976), VESA DisplayHDR 400",
      "Cổng kết nối": "2x HDMI 2.1 (4K@144Hz), 1x DisplayPort 1.4",
      "Chân đế": "Nâng hạ độ cao, xoay dọc 90 độ, gập ngửa"
    }
  },
  {
    "id": "mouse-001",
    "name": "Chuột Gaming Siêu Nhẹ Logitech G Pro X Superlight 2 (60g)",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3490000,
    "oldPrice": 3890000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 420,
    "stock": 60,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Huyền thoại chuột thi đấu FPS được các tuyển thủ esport tin dùng nhất thế giới, trọng lượng siêu nhẹ 60g kết hợp cảm biến HERO 2 32.000 DPI và switch quang học.",
    "features": [
      "Trọng lượng lông vũ 60g vẩy chuột nhẹ nhàng không mỏi cổ tay",
      "Switch lai cơ quang học chống nhấp đúp và phản hồi tức thì",
      "Cảm biến HERO 2 độ chính xác sub-micron từng milimet",
      "Thời lượng pin 95 giờ qua cổng sạc Type-C hiện đại"
    ],
    "specifications": {
      "Trọng lượng": "60 gram siêu nhẹ",
      "Cảm biến": "HERO 2 (100 - 32,000 DPI, 500+ IPS)",
      "Tần số gửi tín hiệu": "Polling Rate lên tới 4000 Hz / 1ms",
      "Switch": "Switch lai Quang - Cơ LIGHTFORCE độc quyền",
      "Thời lượng Pin": "Lên tới 95 giờ sử dụng liên tục",
      "Chân đế": "100% PTFE không pha tạp lướt êm ái"
    }
  },
  {
    "id": "mouse-003",
    "name": "Chuột Gaming Siêu Nhẹ Razer Viper V3 Pro Wireless 54g",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3990000,
    "oldPrice": 4390000,
    "discount": 9,
    "rating": 5,
    "reviewCount": 180,
    "stock": 45,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Mẫu chuột esport nhẹ nhất của Razer với trọng lượng chỉ 54g, tích hợp dongle HyperPolling 8000Hz không dây sẵn trong hộp và cảm biến Focus Pro 35K Gen-2.",
    "features": [
      "Trọng lượng chỉ 54g cân bằng đối xứng hoàn hảo cho mọi kiểu cầm",
      "Tần số quét 8000Hz nhanh gấp 8 lần chuột gaming thông thường",
      "Cảm biến quang học Focus Pro 35K chính xác từng pixel trên mọi bề mặt kể cả kính",
      "Switch quang học thế hệ 3 loại bỏ hoàn toàn hiện tượng debounce delay"
    ],
    "specifications": {
      "Trọng lượng": "54 gram siêu nhẹ",
      "Cảm biến": "Razer Focus Pro 35K Optical Sensor Gen-2 (35.000 DPI)",
      "Tần số phản hồi": "HyperPolling Wireless 8000 Hz (0.125ms)",
      "Switch": "Optical Mouse Switches Gen-3 (90 triệu lần bấm)",
      "Pin": "Lên đến 95 giờ ở 1000Hz (17 giờ ở 8000Hz)"
    }
  },
  {
    "id": "mouse-004",
    "name": "Chuột Công Thái Học Không Dây Logitech MX Master 3S",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2290000,
    "oldPrice": 2690000,
    "discount": 15,
    "rating": 4.9,
    "reviewCount": 350,
    "stock": 55,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Chuột văn phòng và sáng tạo nội dung số 1 thế giới với nút bấm Quiet Click giảm 90% tiếng ồn, con lăn từ tính MagSpeed cuộn 1000 dòng/giây và cảm biến 8000 DPI.",
    "features": [
      "Nút bấm Quiet Click giảm 90% tiếng ồn không làm phiền đồng nghiệp",
      "Con lăn từ tính MagSpeed cuộn 1000 dòng chỉ trong 1 giây",
      "Tính năng Logitech Flow sao chép văn bản, hình ảnh giữa 3 máy tính khác nhau",
      "Form cầm công thái học nâng đỡ lòng bàn tay và ngón cái tuyệt đối"
    ],
    "specifications": {
      "Cảm biến": "Darkfield High Precision (200 - 8000 DPI, di được trên mặt kính)",
      "Con lăn chính": "MagSpeed SmartShift từ tính thép không gỉ",
      "Con lăn phụ": "Con lăn ngón cái cuộn ngang trang tính Excel / Timeline video",
      "Kết nối": "Bluetooth Low Energy & Đầu thu Logi Bolt",
      "Pin": "Lên đến 70 ngày, sạc nhanh 1 phút dùng được 3 giờ"
    }
  },
  {
    "id": "pc-002",
    "name": "PC Gaming DANGVINH Monster Core i9-14900K • RTX 4090 24GB",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 98990000,
    "oldPrice": 108990000,
    "discount": 9,
    "rating": 5,
    "reviewCount": 42,
    "stock": 5,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Cỗ máy quái vật mạnh nhất hành tinh dành cho các game thủ và streamer hàng đầu. Tối ưu sẵn cho độ phân giải 4K/8K max setting.",
    "features": [
      "Hiệu năng tối thượng chơi mượt mọi game 4K trên 144 FPS",
      "Hệ thống tản nhiệt nước AIO có màn hình LCD tùy biến ảnh GIF",
      "RAM 64GB DDR5 và SSD 2TB tốc độ 7450 MB/s",
      "Bảo hành tận nơi 36 tháng 1 đổi 1"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900K (24 Cores / 32 Threads)",
      "Tản nhiệt": "Tản nước AIO Corsair iCUE LINK H150i LCD 360mm",
      "Mainboard": "ASUS ROG MAXIMUS Z790 HERO",
      "RAM": "64GB G.Skill Trident Z5 RGB DDR5 6400MHz",
      "VGA": "ASUS ROG Strix GeForce RTX 4090 24GB Gaming",
      "SSD": "Samsung 990 Pro 2TB PCIe 4.0 NVMe",
      "Nguồn": "Corsair RM1200x Shift 1200W 80 Plus Gold ATX 3.0",
      "Vỏ case": "Lian Li O11 Dynamic EVO RGB Black"
    }
  },
  {
    "id": "pc-003",
    "name": "PC Gaming Cyber White Core i7-14700K • RTX 4070 Ti Super",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 45990000,
    "oldPrice": 49990000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 78,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Tone màu trắng tinh khôi Snow White tuyệt đẹp với mặt kính trong suốt toàn cảnh, hiệu năng chiến mượt mọi tựa game 2K/4K esport và đồ họa.",
    "features": [
      "Toàn bộ linh kiện đồng bộ tone màu Trắng White Edition cao cấp",
      "Card đồ họa RTX 4070 Ti Super 16GB VRAM thế hệ mới",
      "Mặt kính cong Panorama khoe trọn linh kiện bên trong",
      "Được cân chỉnh ép xung và test benchmark ổn định 24/7"
    ],
    "specifications": {
      "CPU": "Intel Core i7-14700K (20 nhân, 28 luồng)",
      "Tản nhiệt": "DeepCool LT720 WH 360mm White",
      "Mainboard": "ASUS TUF GAMING Z790-PRO WIFI",
      "RAM": "32GB Corsair Vengeance RGB DDR5 6000MHz White",
      "VGA": "Gigabyte GeForce RTX 4070 Ti SUPER EAGLE OC ICE 16GB",
      "SSD": "Kingston KC3000 1TB PCIe 4.0",
      "Nguồn": "MSI MAG A850GL White 850W PCIe 5.0 Gold",
      "Vỏ case": "Montech King 95 Pro White Dual Chamber"
    }
  },
  {
    "id": "pc-004",
    "name": "PC Văn Phòng & Doanh Nghiệp DPC Slim Core i5-13400",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 12490000,
    "oldPrice": 13990000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 115,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Bộ máy tính nhỏ gọn, tiết kiệm điện năng, hoạt động siêu êm ái dành cho kế toán, văn phòng, đồ họa 2D Photoshop và học tập.",
    "features": [
      "Khởi động máy và mở ứng dụng văn phòng chỉ trong 5 giây",
      "Kích thước nhỏ gọn tiết kiệm tối đa không gian bàn làm việc",
      "Tiêu thụ điện năng cực thấp và vận hành êm ru không tiếng ồn",
      "Cài sẵn Windows 11 bản quyền và bộ ứng dụng Office"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13400 (10 nhân, 16 luồng)",
      "Mainboard": "MSI PRO B760M-E DDR4",
      "RAM": "16GB Kingston Fury Beast 3200MHz",
      "VGA": "Đồ họa tích hợp Intel UHD Graphics 730",
      "SSD": "512GB NVMe M.2 PCIe Gen4",
      "Nguồn": "Xigmatek X-Power 450W",
      "Vỏ case": "Xigmatek Cubi M Micro Slim"
    }
  },
  {
    "id": "pc-005",
    "name": "PC Gaming Esport Valorant / CS2 Core i5-14400F • RTX 4060 8GB",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 19990000,
    "oldPrice": 22490000,
    "discount": 11,
    "rating": 4.9,
    "reviewCount": 220,
    "stock": 25,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Bộ máy tính chuyên trị các tựa game Esport FPS cao (Valorant, CS2, LMHT, PUBG) ở độ phân giải Full HD / 2K, mức giá cực kỳ dễ tiếp cận.",
    "features": [
      "Đạt trên 300+ FPS mượt mà trong Valorant, CS2 và Liên Minh",
      "Card đồ họa RTX 4060 hỗ trợ công nghệ DLSS 3 và NVIDIA Reflex giảm độ trễ",
      "Tích hợp sẵn Wi-Fi và Bluetooth kết nối tay cầm không dây tiện lợi",
      "Bảo hành chính hãng 36 tháng lỗi đổi mới"
    ],
    "specifications": {
      "CPU": "Intel Core i5-14400F (10 nhân, 16 luồng)",
      "Tản nhiệt": "Thermalright Assassin X 120 Refined SE ARGB",
      "Mainboard": "ASUS PRIME B760M-A WIFI D4",
      "RAM": "16GB (2x8GB) Kingston Fury Beast RGB 3200MHz",
      "VGA": "MSI GeForce RTX 4060 VENTUS 2X BLACK 8GB OC",
      "SSD": "Kingston NV2 1TB PCIe 4.0",
      "Nguồn": "DeepCool PK650D 650W 80 Plus Bronze",
      "Vỏ case": "Xigmatek Aqua M Lite 3 Fan RGB"
    }
  },
  {
    "id": "pc-006",
    "name": "PC Gaming ITX Valkyrie Mini Ryzen 7 7800X3D • RTX 4070 Ti Super",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 49990000,
    "oldPrice": 54990000,
    "discount": 9,
    "rating": 5,
    "reviewCount": 38,
    "stock": 6,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Tuyệt tác máy tính cỡ nhỏ Mini-ITX để bàn siêu gọn gàng nhưng chứa đựng sức mạnh khủng khiếp của CPU Ryzen 7 7800X3D và RTX 4070 Ti Super.",
    "features": [
      "Thể tích chỉ 9.95 Lít đặt vừa vặn trong balo mang đi du đấu",
      "Vỏ nhôm phay CNC cao cấp tiêu chuẩn hàng không vũ trụ",
      "Hiệu năng tản nhiệt tối ưu không bị nghẽn xung nhiệt độ",
      "Nguồn Platinum chuẩn SFX bền bỉ và êm ái tuyệt đối"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 7 7800X3D (8 nhân / 16 luồng, 3D V-Cache)",
      "Tản nhiệt": "AIO Phanteks Glacier One 240 T30 V2",
      "Mainboard": "ROG STRIX B650E-I GAMING WIFI Mini-ITX",
      "RAM": "32GB G.Skill Flare X5 DDR5 6000MHz",
      "VGA": "ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB",
      "SSD": "WD Black SN850X 1TB PCIe Gen4",
      "Nguồn": "Corsair SF750 750W 80 Plus Platinum SFX",
      "Vỏ case": "FormD T1 V2.1 Titanium Sandwich ITX"
    }
  },
  {
    "id": "pc-007",
    "name": "PC Đồng Bộ Dell Vostro 3020 MT Core i5-13400 (Chính Hãng)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 14590000,
    "oldPrice": 15990000,
    "discount": 9,
    "rating": 4.8,
    "reviewCount": 88,
    "stock": 20,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Dòng máy tính đồng bộ danh tiếng của Dell dành cho văn phòng, ngân hàng, trường học với độ ổn định 24/7 và bảo hành tận nơi ProSupport.",
    "features": [
      "Thiết kế đồng bộ tối ưu luồng gió làm việc bền bỉ nhiều năm",
      "Đầy đủ các cổng kết nối USB 3.2, HDMI, DisplayPort tiện lợi",
      "Bản quyền phần mềm Windows 11 và Office trọn đời",
      "Dịch vụ bảo hành tận nơi ProSupport của Dell Việt Nam"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13400 (2.5GHz up to 4.6GHz, 20MB Cache)",
      "RAM": "16GB DDR4 3200MHz (Nâng cấp tối đa 64GB)",
      "Ổ cứng": "512GB M.2 PCIe NVMe SSD",
      "Hệ điều hành": "Windows 11 Home SL + Office Home & Student",
      "Kết nối": "Wi-Fi 6, Bluetooth 5.2, Cổng LAN Gigabit",
      "Bàn phím chuột": "Tặng kèm bộ bàn phím và chuột quang Dell chính hãng"
    }
  },
  {
    "id": "ram-001",
    "name": "Corsair Vengeance RGB Pro 32GB DDR5",
    "category": "ram",
    "category_id": "ram",
    "price": 3990000,
    "oldPrice": 4490000,
    "discount": 11,
    "rating": 4.7,
    "reviewCount": 210,
    "stock": 50,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "RAM DDR5 cao cấp với RGB lighting đẹp mắt",
    "features": [
      "32GB capacity",
      "5600MHz speed",
      "RGB lighting",
      "XMP 3.0"
    ],
    "specifications": {
      "Capacity": "32GB",
      "Type": "DDR5",
      "Speed": "5600MHz",
      "CAS Latency": "28"
    }
  },
  {
    "id": "ram-002",
    "name": "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz Silver",
    "category": "ram",
    "category_id": "ram",
    "price": 6290000,
    "oldPrice": 6990000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 165,
    "stock": 30,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Dung lượng khủng 64GB DDR5 bus 6400MHz tốc độ cao, tản nhiệt nhôm xước ánh bạc phi thuyền và dải LED RGB viền mờ cao cấp.",
    "features": [
      "Dung lượng lớn 64GB thoải mái đa nhiệm Premiere, After Effects, 3D Maya",
      "Tốc độ bus cực cao 6400MHz độ trễ thấp CL32",
      "Dải LED RGB tản sáng mượt mà tương thích mọi phần mềm sync",
      "Bảo hành chính hãng 36 tháng 1 đổi 1"
    ],
    "specifications": {
      "Dung lượng": "64GB (2 x 32GB)",
      "Loại RAM": "DDR5",
      "Tốc độ Bus": "6400 MHz (PC5-51200)",
      "Độ trễ": "CL32-39-39-102",
      "Điện áp": "1.40V",
      "Tính năng": "Hỗ trợ Intel XMP 3.0 & AMD EXPO"
    }
  },
  {
    "id": "ram-004",
    "name": "Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 7200MHz White",
    "category": "ram",
    "category_id": "ram",
    "price": 4990000,
    "oldPrice": 5590000,
    "discount": 11,
    "rating": 5,
    "reviewCount": 88,
    "stock": 20,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Dòng RAM cao cấp nhất lịch sử Corsair với thanh tản nhiệt nhôm rèn nguyên khối, nắp trên có thể tháo rời tùy biến và tốc độ bus đỉnh cao 7200MHz.",
    "features": [
      "Bus 7200MHz phá vỡ mọi giới hạn băng thông bộ nhớ",
      "Thiết kế mô-đun nắp trên có thể thay đổi dạng tản nhiệt vây fin hoặc in 3D",
      "Được tuyển chọn từ các IC nhớ cao cấp nhất cho khả năng ép xung tối đa",
      "Đồng bộ hoàn hảo qua phần mềm Corsair iCUE"
    ],
    "specifications": {
      "Dung lượng": "32GB (2 x 16GB)",
      "Tốc độ Bus": "7200 MHz CL34 siêu nhanh",
      "LED": "11 bóng LED CAPELLIX RGB rực rỡ siêu sáng",
      "Tản nhiệt": "Công nghệ làm mát DHX Patented cooling"
    }
  },
  {
    "id": "ssd-002",
    "name": "Samsung 990 Pro 2TB NVMe M.2 PCIe 4.0 (Có Heatsink)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 4690000,
    "oldPrice": 5290000,
    "discount": 11,
    "rating": 5,
    "reviewCount": 290,
    "stock": 50,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Ổ cứng SSD PCIe 4.0 nhanh nhất thế giới của Samsung với tốc độ đọc lên tới 7450 MB/s, tích hợp sẵn tản nhiệt Heatsink tương thích hoàn hảo cả PC và PlayStation 5.",
    "features": [
      "Tốc độ đọc ghi tiệm cận giới hạn vật lý của giao tiếp PCIe 4.0",
      "Heatsink tản nhiệt chuyên dụng duy trì hiệu năng ổn định, không bị nghẽn nhiệt",
      "Tương thích hoàn hảo cho máy chơi game PS5 và PC cao cấp",
      "Bảo hành 5 năm chính hãng hoặc 1200 TBW"
    ],
    "specifications": {
      "Dung lượng": "2TB (2000GB)",
      "Chuẩn kết nối": "M.2 NVMe PCIe Gen 4.0 x4",
      "Tốc độ đọc tuần tự": "Lên tới 7,450 MB/s",
      "Tốc độ ghi tuần tự": "Lên tới 6,900 MB/s",
      "Đọc/Ghi ngẫu nhiên": "1,400,000 / 1,550,000 IOPS",
      "Độ bền (TBW)": "1,200 TBW"
    }
  },
  {
    "id": "ssd-004",
    "name": "Kingston KC3000 2TB PCIe 4.0 NVMe M.2 (7000 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 3890000,
    "oldPrice": 4290000,
    "discount": 9,
    "rating": 4.9,
    "reviewCount": 195,
    "stock": 40,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Ổ cứng SSD hiệu năng cao trang bị bộ điều khiển Phison E18 và tấm tản nhiệt Graphene nhôm mỏng nhẹ, tốc độ đọc ghi 7000/7000 MB/s.",
    "features": [
      "Tốc độ đọc ghi đồng đều 7000MB/s cho cả đọc và ghi file nặng",
      "Độ bền ghi dữ liệu 1600 TBW gấp đôi các dòng SSD thông thường",
      "Tấm Graphene mỏng phù hợp cho cả laptop mỏng nhẹ và PS5",
      "Bảo hành chính hãng 5 năm"
    ],
    "specifications": {
      "Dung lượng": "2TB (2048GB)",
      "Tốc độ đọc / ghi": "7,000 MB/s / 7,000 MB/s",
      "Đọc ghi ngẫu nhiên 4K": "1,000,000 IOPS",
      "Độ bền": "1600 TBW cực trâu bò",
      "Tản nhiệt": "Graphene nhôm tản nhiệt thụ động hiệu quả cao"
    }
  },
  {
    "id": "ssd-005",
    "name": "Crucial T700 1TB PCIe Gen5 NVMe (12.400 MB/s Thế Hệ Mới)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 4590000,
    "oldPrice": 4990000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 64,
    "stock": 15,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
    ],
    "description": "Kỷ nguyên SSD PCIe Gen 5 với tốc độ đọc kinh hoàng 12.400 MB/s, nhanh gần gấp đôi so với PCIe Gen 4, giải phóng hoàn toàn thời gian load game DirectStorage.",
    "features": [
      "Tốc độ đọc ghi phá vỡ mọi kỷ lục thế giới (12.400 MB/s)",
      "Tối ưu hóa cho công nghệ Microsoft DirectStorage load cảnh game trong 1 giây",
      "Khối Heatsink thiết kế khí động học tản nhiệt cấp tốc",
      "Tương thích hoàn hảo các bo mạch chủ Intel Z790 và AMD X670E"
    ],
    "specifications": {
      "Chuẩn giao tiếp": "PCIe 5.0 x4 NVMe 2.0",
      "Tốc độ đọc tuần tự": "Lên tới 12,400 MB/s",
      "Tốc độ ghi tuần tự": "Lên tới 11,800 MB/s",
      "Công nghệ": "Micron 232-layer 3D TLC NAND",
      "Tản nhiệt": "Kèm khối Heatsink nhôm và đồng tản nhiệt chủ động"
    }
  }
];

export const featuredProducts = products.filter((p) => p.isFeatured || p.isHot || p.isSale);
export const flashSaleProducts = products.filter((p) => p.isSale);
export const newArrivals = products.filter((p) => p.isNew);
