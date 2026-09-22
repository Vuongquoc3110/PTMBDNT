require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const newProducts = [
  {
    id: 'lap-003',
    name: 'MacBook Pro 16 M3 Max (36GB RAM / 1TB SSD)',
    category_id: 'laptop',
    price: 89990000,
    oldPrice: 94990000,
    discount: 5,
    rating: 5.0,
    reviewCount: 96,
    stock: 12,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    description: 'Siêu phẩm MacBook Pro 16 inch trang bị chip Apple M3 Max đỉnh cao cho xử lý đồ họa, lập trình và dựng video 8K chuyên nghiệp.',
    specifications: {
      'Chip': 'Apple M3 Max 14-core CPU / 30-core GPU',
      'RAM': '36GB Unified Memory',
      'Ổ cứng': '1TB SSD siêu nhanh',
      'Màn hình': '16.2 inch Liquid Retina XDR (3456x2234), 120Hz ProMotion',
      'Pin': 'Lên đến 22 giờ liên tục',
      'Trọng lượng': '2.14 kg'
    },
    features: [
      'Chip M3 Max đột phá với 14 nhân CPU và 30 nhân GPU',
      'Màn hình Liquid Retina XDR độ sáng tối đa 1600 nits',
      'Thời lượng pin khủng nhất từ trước đến nay (22 tiếng)',
      'Hệ thống 6 loa âm thanh vòm Spatial Audio đẳng cấp'
    ]
  },
  {
    id: 'lap-004',
    name: 'ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX • RTX 4080',
    category_id: 'laptop',
    price: 72990000,
    oldPrice: 79990000,
    discount: 8,
    rating: 4.9,
    reviewCount: 68,
    stock: 8,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80',
    description: 'Chiến hạm gaming ASUS ROG Strix SCAR 18 màn hình 2.5K 240Hz Nebula HDR, cấu hình đỉnh cao cân mọi tựa game AAA ở thiết lập Ultra settings.',
    specifications: {
      'CPU': 'Intel Core i9-14900HX (24 nhân, 32 luồng, Turbo 5.8 GHz)',
      'GPU': 'NVIDIA GeForce RTX 4080 12GB GDDR6X (175W TGP)',
      'RAM': '32GB DDR5 5600MHz (Hỗ trợ nâng cấp 64GB)',
      'Ổ cứng': '1TB PCIe 4.0 NVMe M.2 SSD',
      'Màn hình': '18 inch 2.5K (2560x1600) ROG Nebula HDR, 240Hz, Mini LED',
      'Tản nhiệt': 'Kim loại lỏng Conductonaut Extreme + 3 quạt làm mát'
    },
    features: [
      'Màn hình Mini LED 18 inch cực đại 240Hz 3ms',
      'Card RTX 4080 175W mạnh mẽ với công nghệ MUX Switch & NVIDIA Advanced Optimus',
      'Hệ thống tản nhiệt thông minh 3 quạt làm mát',
      'Bàn phím cơ quang học Per-Key RGB Aura Sync'
    ]
  },
  {
    id: 'lap-005',
    name: 'Dell XPS 16 9640 Core Ultra 9 185H • RTX 4070 8GB',
    category_id: 'laptop',
    price: 64990000,
    oldPrice: 69990000,
    discount: 7,
    rating: 4.8,
    reviewCount: 52,
    stock: 10,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
    description: 'Tuyệt phẩm thiết kế tương lai từ Dell với vỏ nhôm CNC nguyên khối, viền màn hình siêu mỏng InfinityEdge và bàn rê chuột kính vô cực tàng hình.',
    specifications: {
      'CPU': 'Intel Core Ultra 9 185H tích hợp nhân AI NPU',
      'GPU': 'NVIDIA GeForce RTX 4070 8GB GDDR6',
      'RAM': '32GB LPDDR5X 7467MHz Dual Channel',
      'Ổ cứng': '1TB NVMe PCIe Gen4 SSD',
      'Màn hình': '16.3 inch 4K+ OLED Touchscreen (3840x2400) 100% DCI-P3',
      'Chất liệu': 'Nhôm nguyên khối Platinum Silver & Kính cường lực Gorilla Glass 3'
    },
    features: [
      'Thiết kế tương lai với Touchpad vô hình haptic cảm ứng lực',
      'Màn hình 4K+ OLED cảm ứng với màu sắc chính xác 100% DCI-P3',
      'Tích hợp nhân xử lý AI Intel AI Boost',
      'Hệ thống âm thanh 4 loa công suất 10W đạt chuẩn Dolby Atmos'
    ]
  },
  {
    id: 'pc-002',
    name: 'PC Gaming DANGVINH Monster Core i9-14900K • RTX 4090 24GB',
    category_id: 'gaming-pc',
    price: 98990000,
    oldPrice: 108990000,
    discount: 9,
    rating: 5.0,
    reviewCount: 42,
    stock: 5,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80',
    description: 'Cỗ máy quái vật mạnh nhất hành tinh dành cho các game thủ và streamer hàng đầu. Tối ưu sẵn cho độ phân giải 4K/8K max setting.',
    specifications: {
      'CPU': 'Intel Core i9-14900K (24 Cores / 32 Threads)',
      'Tản nhiệt': 'Tản nước AIO Corsair iCUE LINK H150i LCD 360mm',
      'Mainboard': 'ASUS ROG MAXIMUS Z790 HERO',
      'RAM': '64GB G.Skill Trident Z5 RGB DDR5 6400MHz',
      'VGA': 'ASUS ROG Strix GeForce RTX 4090 24GB Gaming',
      'SSD': 'Samsung 990 Pro 2TB PCIe 4.0 NVMe',
      'Nguồn': 'Corsair RM1200x Shift 1200W 80 Plus Gold ATX 3.0',
      'Vỏ case': 'Lian Li O11 Dynamic EVO RGB Black'
    },
    features: [
      'Hiệu năng tối thượng chơi mượt mọi game 4K trên 144 FPS',
      'Hệ thống tản nhiệt nước AIO có màn hình LCD tùy biến ảnh GIF',
      'RAM 64GB DDR5 và SSD 2TB tốc độ 7450 MB/s',
      'Bảo hành tận nơi 36 tháng 1 đổi 1'
    ]
  },
  {
    id: 'pc-003',
    name: 'PC Gaming Cyber White Core i7-14700K • RTX 4070 Ti Super',
    category_id: 'gaming-pc',
    price: 45990000,
    oldPrice: 49990000,
    discount: 8,
    rating: 4.9,
    reviewCount: 78,
    stock: 12,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    description: 'Tone màu trắng tinh khôi Snow White tuyệt đẹp với mặt kính trong suốt toàn cảnh, hiệu năng chiến mượt mọi tựa game 2K/4K esport và đồ họa.',
    specifications: {
      'CPU': 'Intel Core i7-14700K (20 nhân, 28 luồng)',
      'Tản nhiệt': 'DeepCool LT720 WH 360mm White',
      'Mainboard': 'ASUS TUF GAMING Z790-PRO WIFI',
      'RAM': '32GB Corsair Vengeance RGB DDR5 6000MHz White',
      'VGA': 'Gigabyte GeForce RTX 4070 Ti SUPER EAGLE OC ICE 16GB',
      'SSD': 'Kingston KC3000 1TB PCIe 4.0',
      'Nguồn': 'MSI MAG A850GL White 850W PCIe 5.0 Gold',
      'Vỏ case': 'Montech King 95 Pro White Dual Chamber'
    },
    features: [
      'Toàn bộ linh kiện đồng bộ tone màu Trắng White Edition cao cấp',
      'Card đồ họa RTX 4070 Ti Super 16GB VRAM thế hệ mới',
      'Mặt kính cong Panorama khoe trọn linh kiện bên trong',
      'Được cân chỉnh ép xung và test benchmark ổn định 24/7'
    ]
  },
  {
    id: 'pc-004',
    name: 'PC Văn Phòng & Doanh Nghiệp DPC Slim Core i5-13400',
    category_id: 'office-pc',
    price: 12490000,
    oldPrice: 13990000,
    discount: 10,
    rating: 4.7,
    reviewCount: 115,
    stock: 25,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80',
    description: 'Bộ máy tính nhỏ gọn, tiết kiệm điện năng, hoạt động siêu êm ái dành cho kế toán, văn phòng, đồ họa 2D Photoshop và học tập.',
    specifications: {
      'CPU': 'Intel Core i5-13400 (10 nhân, 16 luồng)',
      'Mainboard': 'MSI PRO B760M-E DDR4',
      'RAM': '16GB Kingston Fury Beast 3200MHz',
      'VGA': 'Đồ họa tích hợp Intel UHD Graphics 730',
      'SSD': '512GB NVMe M.2 PCIe Gen4',
      'Nguồn': 'Xigmatek X-Power 450W',
      'Vỏ case': 'Xigmatek Cubi M Micro Slim'
    },
    features: [
      'Khởi động máy và mở ứng dụng văn phòng chỉ trong 5 giây',
      'Kích thước nhỏ gọn tiết kiệm tối đa không gian bàn làm việc',
      'Tiêu thụ điện năng cực thấp và vận hành êm ru không tiếng ồn',
      'Cài sẵn Windows 11 bản quyền và bộ ứng dụng Office'
    ]
  },
  {
    id: 'cpu-002',
    name: 'AMD Ryzen 7 7800X3D (Vua Gaming CPU Hiện Nay)',
    category_id: 'cpu',
    price: 10490000,
    oldPrice: 11990000,
    discount: 12,
    rating: 5.0,
    reviewCount: 310,
    stock: 35,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
    description: 'Vi xử lý chuyên chơi game số 1 thế giới với công nghệ bộ nhớ đệm 3D V-Cache 96MB độc quyền, mang lại FPS cao nhất và độ ổn định tối đa.',
    specifications: {
      'Số nhân / Luồng': '8 nhân / 16 luồng',
      'Xung nhịp cơ bản': '4.2 GHz',
      'Xung nhịp tối đa': '5.0 GHz',
      'Bộ nhớ đệm (L3 Cache)': '96MB 3D V-Cache (Tổng 104MB)',
      'Socket': 'AM5 (Hỗ trợ DDR5 & PCIe 5.0)',
      'TDP': '120W'
    },
    features: [
      'Hiệu năng gaming vượt trội hơn cả các dòng CPU cao cấp nhất',
      'Bộ nhớ đệm 3D V-Cache khổng lồ 96MB cho FPS ổn định vượt bậc',
      'Tiêu thụ điện năng cực thấp so với hiệu năng đạt được',
      'Hỗ trợ nền tảng AM5 lâu dài đến năm 2027+'
    ]
  },
  {
    id: 'cpu-003',
    name: 'Intel Core i7-14700K (20 Cores / 28 Threads)',
    category_id: 'cpu',
    price: 10290000,
    oldPrice: 11290000,
    discount: 8,
    rating: 4.8,
    reviewCount: 185,
    stock: 28,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80',
    description: 'CPU thế hệ 14 Raptor Lake Refresh được nâng cấp thêm 4 nhân E-core, hoàn hảo cho cả gaming và làm đồ họa render đa nhiệm nặng.',
    specifications: {
      'Số nhân / Luồng': '20 Cores (8P + 12E) / 28 Threads',
      'Xung nhịp Max': '5.6 GHz Intel Thermal Velocity Boost',
      'Smart Cache': '33MB Intel Smart Cache',
      'Socket': 'LGA 1700',
      'Hỗ trợ RAM': 'DDR5 5600MHz / DDR4 3200MHz',
      'TDP': '125W (Turbo 253W)'
    },
    features: [
      'Tăng thêm 4 nhân E-core so với thế hệ 13 giúp render nhanh hơn 18%',
      'Xung nhịp boost lên đến 5.6 GHz xử lý tác vụ đơn nhân cực nhạy',
      'Hỗ trợ cả chuẩn RAM DDR4 lẫn DDR5 linh hoạt',
      'Tích hợp sẵn nhân đồ họa Intel UHD 770'
    ]
  },
  {
    id: 'gpu-002',
    name: 'ASUS ROG Strix GeForce RTX 4080 Super 16GB OC',
    category_id: 'gpu',
    price: 31990000,
    oldPrice: 34990000,
    discount: 8,
    rating: 4.9,
    reviewCount: 84,
    stock: 14,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    description: 'Mẫu card đồ họa cao cấp nhất trong phân khúc RTX 4080 Super với tản nhiệt buồng hơi Vapor Chamber, khung kim loại nguyên khối đầm chắc và LED RGB Aura Sync.',
    specifications: {
      'CUDA Cores': '10,240 Cores',
      'Bộ nhớ': '16GB GDDR6X',
      'Tốc độ bộ nhớ': '23 Gbps',
      'Giao tiếp': '256-bit',
      'Cổng xuất hình': '2x HDMI 2.1a, 3x DisplayPort 1.4a',
      'Nguồn khuyến nghị': '850W (Đầu cấp nguồn 16-pin 12VHPWR)'
    },
    features: [
      'Kiến trúc NVIDIA Ada Lovelace thế hệ mới nhất với DLSS 3 Frame Generation',
      'Hệ thống quạt Axial-tech cánh đảo chiều gia tăng 23% lưu lượng gió',
      'Khung nhôm diecast bảo vệ PCB chống cong xệ card',
      'Dual BIOS chuyển đổi chế độ Yên Tĩnh (Quiet) và Hiệu Năng (Performance)'
    ]
  },
  {
    id: 'gpu-003',
    name: 'MSI GeForce RTX 4070 Super 12GB Gaming X Slim',
    category_id: 'gpu',
    price: 18490000,
    oldPrice: 19990000,
    discount: 7,
    rating: 4.8,
    reviewCount: 142,
    stock: 20,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80',
    description: 'Phiên bản Slim mỏng nhẹ sang trọng, tối ưu cho mọi kích cỡ case máy tính mà vẫn giữ vững nhiệt độ mát mẻ và độ êm ái trứ danh của dòng Gaming X.',
    specifications: {
      'CUDA Cores': '7,168 Cores',
      'Bộ nhớ': '12GB GDDR6X',
      'Xung nhịp Boost': '2,640 MHz',
      'Băng thông': '192-bit',
      'Tản nhiệt': 'TRI FROZR 3 với quạt TORX FAN 5.0',
      'Công suất tiêu thụ': '220W'
    },
    features: [
      'Thiết kế Slim thanh lịch chiếm ít khe PCIe hơn',
      'Công nghệ tản nhiệt TRI FROZR 3 êm ái hàng đầu thị trường',
      'Hỗ trợ Ray Tracing thế hệ 3 và tạo khung hình thông minh DLSS 3.5',
      'Phần mềm MSI Center hỗ trợ ép xung và tùy chỉnh LED Mystic Light'
    ]
  },
  {
    id: 'ram-002',
    name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz Silver',
    category_id: 'ram',
    price: 6290000,
    oldPrice: 6990000,
    discount: 10,
    rating: 4.9,
    reviewCount: 165,
    stock: 30,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
    description: 'Dung lượng khủng 64GB DDR5 bus 6400MHz tốc độ cao, tản nhiệt nhôm xước ánh bạc phi thuyền và dải LED RGB viền mờ cao cấp.',
    specifications: {
      'Dung lượng': '64GB (2 x 32GB)',
      'Loại RAM': 'DDR5',
      'Tốc độ Bus': '6400 MHz (PC5-51200)',
      'Độ trễ': 'CL32-39-39-102',
      'Điện áp': '1.40V',
      'Tính năng': 'Hỗ trợ Intel XMP 3.0 & AMD EXPO'
    },
    features: [
      'Dung lượng lớn 64GB thoải mái đa nhiệm Premiere, After Effects, 3D Maya',
      'Tốc độ bus cực cao 6400MHz độ trễ thấp CL32',
      'Dải LED RGB tản sáng mượt mà tương thích mọi phần mềm sync',
      'Bảo hành chính hãng 36 tháng 1 đổi 1'
    ]
  },
  {
    id: 'ssd-002',
    name: 'Samsung 990 Pro 2TB NVMe M.2 PCIe 4.0 (Có Heatsink)',
    category_id: 'ssd',
    price: 4690000,
    oldPrice: 5290000,
    discount: 11,
    rating: 5.0,
    reviewCount: 290,
    stock: 50,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
    description: 'Ổ cứng SSD PCIe 4.0 nhanh nhất thế giới của Samsung với tốc độ đọc lên tới 7450 MB/s, tích hợp sẵn tản nhiệt Heatsink tương thích hoàn hảo cả PC và PlayStation 5.',
    specifications: {
      'Dung lượng': '2TB (2000GB)',
      'Chuẩn kết nối': 'M.2 NVMe PCIe Gen 4.0 x4',
      'Tốc độ đọc tuần tự': 'Lên tới 7,450 MB/s',
      'Tốc độ ghi tuần tự': 'Lên tới 6,900 MB/s',
      'Đọc/Ghi ngẫu nhiên': '1,400,000 / 1,550,000 IOPS',
      'Độ bền (TBW)': '1,200 TBW'
    },
    features: [
      'Tốc độ đọc ghi tiệm cận giới hạn vật lý của giao tiếp PCIe 4.0',
      'Heatsink tản nhiệt chuyên dụng duy trì hiệu năng ổn định, không bị nghẽn nhiệt',
      'Tương thích hoàn hảo cho máy chơi game PS5 và PC cao cấp',
      'Bảo hành 5 năm chính hãng hoặc 1200 TBW'
    ]
  },
  {
    id: 'mon-002',
    name: 'Màn hình Gaming ASUS ROG Swift OLED PG27AQDM 27" 240Hz 0.03ms',
    category_id: 'monitor',
    price: 23490000,
    oldPrice: 25990000,
    discount: 9,
    rating: 5.0,
    reviewCount: 112,
    stock: 15,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    description: 'Màn hình gaming OLED đỉnh cao với độ tương phản vô cực, thời gian đáp ứng siêu tốc 0.03ms và tần số quét 240Hz mượt mà không đối thủ.',
    specifications: {
      'Kích thước': '26.5 inch',
      'Tấm nền': 'OLED (Độ tương phản 1,500,000:1)',
      'Độ phân giải': '2K QHD (2560 x 1440)',
      'Tần số quét': '240 Hz',
      'Thời gian đáp ứng': '0.03ms (GTG)',
      'Độ phủ màu': '99% DCI-P3, 135% sRGB, Delta E < 2'
    },
    features: [
      'Tấm nền OLED đen sâu tuyệt đối, màu sắc sống động chân thực',
      'Tần số quét 240Hz kết hợp 0.03ms GTG triệt tiêu hoàn toàn bóng mờ',
      'Tản nhiệt tùy chỉnh độc quyền và bảo vệ màn hình chống lưu ảnh Burn-in',
      'Tương thích NVIDIA G-Sync Compatible & AMD FreeSync Premium'
    ]
  },
  {
    id: 'mon-003',
    name: 'Màn hình Đồ Họa Dell UltraSharp U2724D 27" 2K 120Hz IPS Black',
    category_id: 'monitor',
    price: 10490000,
    oldPrice: 11500000,
    discount: 8,
    rating: 4.9,
    reviewCount: 94,
    stock: 22,
    isFeatured: 0,
    isNew: 1,
    isSale: 0,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    description: 'Màn hình chuyên đồ họa với tấm nền IPS Black tương phản 2000:1 đầu tiên, tích hợp cảm biến ánh sáng tự động điều chỉnh độ sáng và tần số quét mượt 120Hz.',
    specifications: {
      'Kích thước': '27 inch',
      'Tấm nền': 'IPS Black (Độ tương phản 2000:1)',
      'Độ phân giải': '2K QHD (2560 x 1440)',
      'Tần số quét': '120 Hz',
      'Độ phủ màu': '100% sRGB, 98% DCI-P3, Delta E < 2',
      'Cổng kết nối': 'DisplayPort 1.4, HDMI, USB-C Hub 90W sạc nhanh'
    },
    features: [
      'Công nghệ IPS Black tăng gấp đôi độ sâu màu đen so với IPS thông thường',
      'Tần số quét nâng cấp lên 120Hz cho chuyển động cuộn trang êm ái',
      'Cảm biến môi trường tự động cân chỉnh độ sáng và nhiệt độ màu',
      'Chứng nhận mắt EyeSafe bảo vệ thị lực khi làm việc nhiều giờ'
    ]
  },
  {
    id: 'kbd-002',
    name: 'Bàn phím cơ FL-Esports OG98 Retro White Wireless 3-Mode',
    category_id: 'keyboard',
    price: 2390000,
    oldPrice: 2790000,
    discount: 14,
    rating: 4.9,
    reviewCount: 154,
    stock: 35,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    description: 'Bàn phím cơ thiết kế phong cách Retro cổ điển thập niên 90 nhưng sở hữu công nghệ hiện đại: Gasket Mount êm ái, Hotswap và kết nối 3 chế độ.',
    specifications: {
      'Layout': '98 phím (Có cụm số Numpad đầy đủ)',
      'Kết nối': 'Bluetooth 5.0 / Wireless 2.4GHz / Cáp Type-C',
      'Switch': 'Kailh Ice Mint / White Cream (Pre-lubed)',
      'Keycap': 'PBT Double-Shot OEM Profile chống mòn bóng',
      'Cấu trúc': 'Gasket Mount tiêu âm 5 lớp',
      'Dung lượng Pin': '4000 mAh sử dụng đến 4 tuần'
    },
    features: [
      'Thiết kế Retro Vintage hoài niệm cực kỳ phong cách cho góc setup',
      'Gõ đầm tay, âm thanh Thocky trầm ấm nhờ cấu trúc lót foam 5 lớp',
      'Mạch Hotswap xuôi dễ dàng thay đổi mọi loại switch 3-pin / 5-pin',
      'Thời lượng pin bền bỉ hỗ trợ vừa sạc vừa dùng tiện lợi'
    ]
  },
  {
    id: 'mouse-001',
    name: 'Chuột Gaming Siêu Nhẹ Logitech G Pro X Superlight 2 (60g)',
    category_id: 'mouse',
    price: 3490000,
    oldPrice: 3890000,
    discount: 10,
    rating: 5.0,
    reviewCount: 420,
    stock: 60,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
    description: 'Huyền thoại chuột thi đấu FPS được các tuyển thủ esport tin dùng nhất thế giới, trọng lượng siêu nhẹ 60g kết hợp cảm biến HERO 2 32.000 DPI và switch quang học.',
    specifications: {
      'Trọng lượng': '60 gram siêu nhẹ',
      'Cảm biến': 'HERO 2 (100 - 32,000 DPI, 500+ IPS)',
      'Tần số gửi tín hiệu': 'Polling Rate lên tới 4000 Hz / 1ms',
      'Switch': 'Switch lai Quang - Cơ LIGHTFORCE độc quyền',
      'Thời lượng Pin': 'Lên tới 95 giờ sử dụng liên tục',
      'Chân đế': '100% PTFE không pha tạp lướt êm ái'
    },
    features: [
      'Trọng lượng lông vũ 60g vẩy chuột nhẹ nhàng không mỏi cổ tay',
      'Switch lai cơ quang học chống nhấp đúp và phản hồi tức thì',
      'Cảm biến HERO 2 độ chính xác sub-micron từng milimet',
      'Thời lượng pin 95 giờ qua cổng sạc Type-C hiện đại'
    ]
  },
  {
    id: 'headset-001',
    name: 'Tai nghe Gaming Cao Cấp SteelSeries Arctis Nova Pro Wireless',
    category_id: 'headset',
    price: 8990000,
    oldPrice: 9990000,
    discount: 10,
    rating: 5.0,
    reviewCount: 88,
    stock: 16,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    description: 'Đỉnh cao tai nghe gaming với chống ồn chủ động ANC 4 micro, dock trạm phát DAC có màn hình OLED tùy chỉnh EQ và hệ thống 2 pin thay nóng không bao giờ hết điện.',
    specifications: {
      'Driver': 'High Fidelity Drivers 40mm dải tần 10–40,000 Hz',
      'Chống ồn': 'Active Noise Cancellation (ANC) 4 mic hybrid',
      'Hệ thống Pin': '2 pin tháo rời (Infinity Power System), 44 tiếng tổng',
      'Kết nối': 'Dual Wireless 2.4GHz không độ trễ + Bluetooth đồng thời',
      'Dock điều khiển': 'Base Station tích hợp màn hình OLED & DAC rời'
    },
    features: [
      'Âm thanh vòm 360° Spatial Audio định vị chuẩn xác từng tiếng bước chân',
      'Chống ồn chủ động ANC loại bỏ tạp âm môi trường tuyệt đối',
      'Hệ thống 2 pin thay nóng liên tục 24/7 không cần cắm dây sạc',
      'Kết nối đồng thời 2 thiết bị vừa chơi game vừa nghe điện thoại'
    ]
  },
  {
    id: 'acc-001',
    name: 'Tản nhiệt nước AIO Corsair iCUE LINK H150i LCD 360mm White',
    category_id: 'accessories',
    price: 6890000,
    oldPrice: 7590000,
    discount: 9,
    rating: 4.9,
    reviewCount: 62,
    stock: 20,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
    description: 'Hệ sinh thái thông minh iCUE LINK kết nối 1 dây duy nhất, màn hình IPS LCD 2.1 inch hiển thị nhiệt độ hoặc ảnh GIF sống động.',
    specifications: {
      'Kích thước Radiator': '360mm (397mm x 120mm x 27mm)',
      'Màn hình': 'IPS LCD 2.1 inch (480x480) 60Hz 30fps 600 nits',
      'Quạt tản': '3x QX120 RGB Magnetic Dome Fans',
      'Tốc độ quạt': '480 - 2,400 RPM với chế độ Zero RPM',
      'Hỗ trợ Socket': 'Intel LGA 1700/1851, AMD AM5/AM4'
    },
    features: [
      'Công nghệ kết nối đơn dây iCUE LINK đi dây siêu gọn gàng',
      'Màn hình IPS LCD hiển thị thông số CPU/GPU thời gian thực hoặc ảnh GIF',
      'Bơm tản nhiệt công suất cao làm mát êm ái cho cả CPU i9 / R9',
      'Phần mềm iCUE đồng bộ hiệu ứng ánh sáng thông minh'
    ]
  },
  {
    id: 'acc-002',
    name: 'Giá Treo 2 Màn Hình Công Thái Học Human Motion T9 Pro Dual',
    category_id: 'accessories',
    price: 1890000,
    oldPrice: 2290000,
    discount: 17,
    rating: 4.8,
    reviewCount: 145,
    stock: 45,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    description: 'Tay nâng arm màn hình đôi chịu lực siêu khỏe lên đến 15kg mỗi tay, nâng đỡ màn hình lên tới 35 inch, trợ lực lò xo cơ học Gas Spring bền bỉ.',
    specifications: {
      'Tải trọng': '3kg - 15kg mỗi tay (Tổng 30kg)',
      'Kích thước màn hỗ trợ': '17 - 35 inch mỗi màn',
      'Chuẩn VESA': '75x75mm và 100x100mm',
      'Góc xoay': 'Xoay 360°, gập ngửa +90°/-45°, xoay ngang 180°',
      'Lắp đặt': 'Kẹp bàn hoặc khoan lỗ bàn (Bàn dày 10-85mm)'
    },
    features: [
      'Chịu tải khủng lên đến 15kg đỡ mượt màn cong lớn 34-35 inch',
      'Piston trợ lực Gas Spring nâng hạ nhẹ nhàng bằng 1 đầu ngón tay',
      'Rãnh giấu dây cáp thông minh giúp bàn làm việc gọn gàng tinh tế',
      'Chất liệu hợp kim nhôm đúc nguyên khối siêu cứng cáp'
    ]
  }
];

async function seed() {
  console.log('🌱 Bắt đầu thêm sản phẩm vào MySQL promart...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'promart',
  });

  for (const p of newProducts) {
    const query = `
      INSERT INTO products (
        id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
        isFeatured, isNew, isSale, isHot, image, description, specifications, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), category_id=VALUES(category_id), price=VALUES(price),
        oldPrice=VALUES(oldPrice), discount=VALUES(discount), rating=VALUES(rating),
        reviewCount=VALUES(reviewCount), stock=VALUES(stock), isFeatured=VALUES(isFeatured),
        isNew=VALUES(isNew), isSale=VALUES(isSale), isHot=VALUES(isHot), image=VALUES(image),
        description=VALUES(description), specifications=VALUES(specifications), features=VALUES(features)
    `;

    await connection.query(query, [
      p.id,
      p.name,
      p.category_id,
      p.price,
      p.oldPrice,
      p.discount,
      p.rating,
      p.reviewCount,
      p.stock,
      p.isFeatured,
      p.isNew,
      p.isSale,
      p.isHot,
      p.image,
      p.description,
      JSON.stringify(p.specifications),
      JSON.stringify(p.features),
    ]);
    console.log(` ✅ Đã thêm/cập nhật: [${p.id}] ${p.name}`);
  }

  // Cập nhật số lượng sản phẩm trong bảng categories
  const [catCounts] = await connection.query(`
    SELECT category_id, COUNT(*) as cnt FROM products GROUP BY category_id
  `);
  for (const row of catCounts) {
    await connection.query('UPDATE categories SET count = ? WHERE id = ?', [row.cnt, row.category_id]);
  }
  console.log('✅ Đã đồng bộ số lượng count trong danh mục!');

  const [allCount] = await connection.query('SELECT COUNT(*) as total FROM products');
  console.log(`\n🎉 TỔNG SỐ SẢN PHẨM HIỆN TẠI: ${allCount[0].total} sản phẩm!`);

  await connection.end();
}

seed().catch((err) => {
  console.error('❌ Lỗi khi seed sản phẩm:', err);
  process.exit(1);
});
