require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const batch2 = [
  {
    id: 'lap-006',
    name: 'Lenovo Legion Pro 7i Gen 9 (Core i9-14900HX • RTX 4090 16GB)',
    category_id: 'laptop',
    price: 85990000,
    oldPrice: 92990000,
    discount: 8,
    rating: 5.0,
    reviewCount: 48,
    stock: 7,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    description: 'Cỗ máy gaming hoàn hảo nhất của Lenovo với chip AI LA2-Q, tản nhiệt buồng hơi Legion Coldfront Vapor và màn hình PureSight 240Hz 500 nits.',
    specifications: {
      'CPU': 'Intel Core i9-14900HX (24 cores, 32 threads, 5.8 GHz)',
      'GPU': 'NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)',
      'RAM': '32GB DDR5 5600MHz Dual-Channel',
      'Ổ cứng': '2TB SSD M.2 PCIe Gen 4',
      'Màn hình': '16" WQXGA (2560x1600) IPS 240Hz, 500 nits, 100% DCI-P3',
      'Vỏ máy': 'Hợp kim nhôm Anodized cao cấp màu xám Eclipse Black'
    },
    features: [
      'Chip AI độc quyền Lenovo LA2-Q tự động tối ưu hóa FPS trong thời gian thực',
      'Card đồ họa RTX 4090 16GB VRAM chạy tối đa công suất 175W TGP',
      'Bàn phím Legion TrueStrike switch nảy 1.5mm chống bóng per-key RGB',
      'Hỗ trợ sạc siêu nhanh Super Rapid Charge 330W'
    ]
  },
  {
    id: 'lap-007',
    name: 'Acer Predator Helios 16 Neo (Core i7-14700HX • RTX 4060)',
    category_id: 'laptop',
    price: 33990000,
    oldPrice: 37990000,
    discount: 11,
    rating: 4.8,
    reviewCount: 115,
    stock: 18,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    description: 'Laptop gaming quốc dân phân khúc cận cao cấp, trang bị tản nhiệt quạt kim loại AeroBlade 3D thế hệ 5 và keo tản nhiệt kim loại lỏng mát lạnh.',
    specifications: {
      'CPU': 'Intel Core i7-14700HX (20 cores, 28 threads)',
      'GPU': 'NVIDIA GeForce RTX 4060 8GB GDDR6 140W MUX Switch',
      'RAM': '16GB DDR5 5600MHz',
      'Ổ cứng': '512GB PCIe NVMe SSD (Còn trống 1 khe M.2)',
      'Màn hình': '16 inch WQXGA (2560x1600) 165Hz 100% sRGB',
      'Tản nhiệt': '2 quạt thép AeroBlade 3D + Keo kim loại lỏng'
    },
    features: [
      'Hiệu năng RTX 4060 140W tối đa chiến mượt mọi game 2K',
      'Công nghệ quạt tản nhiệt cánh thép mỏng 0.08mm êm ái',
      'Màn hình chuẩn đồ họa 16:10 sắc nét 165Hz',
      'Hỗ trợ Wi-Fi 6E siêu tốc độ'
    ]
  },
  {
    id: 'lap-008',
    name: 'Apple MacBook Air 15 inch M3 (16GB RAM / 512GB SSD)',
    category_id: 'laptop',
    price: 36990000,
    oldPrice: 39990000,
    discount: 8,
    rating: 4.9,
    reviewCount: 82,
    stock: 22,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    description: 'Chiếc laptop 15 inch mỏng nhẹ nhất thế giới trang bị chip Apple M3, thiết kế không quạt hoàn toàn tĩnh lặng, pin 18 giờ và màu Midnight tuyệt đẹp.',
    specifications: {
      'Chip': 'Apple M3 chip (8-core CPU / 10-core GPU / 16-core Neural Engine)',
      'RAM': '16GB Unified Memory',
      'Ổ cứng': '512GB SSD',
      'Màn hình': '15.3 inch Liquid Retina (2880x1864) 500 nits True Tone',
      'Độ mỏng': 'Chỉ 11.5 mm siêu mỏng',
      'Trọng lượng': '1.51 kg'
    },
    features: [
      'Màn hình lớn 15.3 inch Liquid Retina hiển thị 1 tỷ màu',
      'Thiết kế Fanless không quạt tản nhiệt hoạt động im lặng 100%',
      'Hỗ trợ xuất đồng thời 2 màn hình ngoài khi gập máy',
      'Cổng sạc MagSafe 3 an toàn và 2 cổng Thunderbolt / USB 4'
    ]
  },
  {
    id: 'lap-009',
    name: 'ASUS Zenbook 14 OLED UX3405 (Intel Core Ultra 7 155H)',
    category_id: 'laptop',
    price: 26990000,
    oldPrice: 29990000,
    discount: 10,
    rating: 4.8,
    reviewCount: 65,
    stock: 14,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
    description: 'Ultrabook doanh nhân cao cấp mỏng nhẹ chuẩn quân đội với màn hình Lumina OLED 3K 120Hz, pin 75Wh dùng cả ngày và tích hợp trí tuệ nhân tạo Intel AI.',
    specifications: {
      'CPU': 'Intel Core Ultra 7 155H (16 nhân, 22 luồng, NPU AI)',
      'Đồ họa': 'Intel Arc Graphics tích hợp mạnh mẽ',
      'RAM': '32GB LPDDR5X 7467MHz',
      'Ổ cứng': '1TB PCIe 4.0 NVMe SSD',
      'Màn hình': '14 inch 3K OLED (2880 x 1800), 120Hz, 0.2ms, 100% DCI-P3',
      'Trọng lượng': '1.2 kg siêu nhẹ'
    },
    features: [
      'Màn hình 3K OLED 120Hz đạt chuẩn màu Pantone Validated',
      'Pin dung lượng khủng 75Wh cho thời lượng lên đến 15 giờ',
      'Tích hợp nhân NPU xử lý các tác vụ AI tạo sinh nhanh chóng',
      'Bàn phím êm ái ErgoSense và bàn di chuột ảo NumberPad'
    ]
  },
  {
    id: 'pc-005',
    name: 'PC Gaming Esport Valorant / CS2 Core i5-14400F • RTX 4060 8GB',
    category_id: 'gaming-pc',
    price: 19990000,
    oldPrice: 22490000,
    discount: 11,
    rating: 4.9,
    reviewCount: 220,
    stock: 25,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80',
    description: 'Bộ máy tính chuyên trị các tựa game Esport FPS cao (Valorant, CS2, LMHT, PUBG) ở độ phân giải Full HD / 2K, mức giá cực kỳ dễ tiếp cận.',
    specifications: {
      'CPU': 'Intel Core i5-14400F (10 nhân, 16 luồng)',
      'Tản nhiệt': 'Thermalright Assassin X 120 Refined SE ARGB',
      'Mainboard': 'ASUS PRIME B760M-A WIFI D4',
      'RAM': '16GB (2x8GB) Kingston Fury Beast RGB 3200MHz',
      'VGA': 'MSI GeForce RTX 4060 VENTUS 2X BLACK 8GB OC',
      'SSD': 'Kingston NV2 1TB PCIe 4.0',
      'Nguồn': 'DeepCool PK650D 650W 80 Plus Bronze',
      'Vỏ case': 'Xigmatek Aqua M Lite 3 Fan RGB'
    },
    features: [
      'Đạt trên 300+ FPS mượt mà trong Valorant, CS2 và Liên Minh',
      'Card đồ họa RTX 4060 hỗ trợ công nghệ DLSS 3 và NVIDIA Reflex giảm độ trễ',
      'Tích hợp sẵn Wi-Fi và Bluetooth kết nối tay cầm không dây tiện lợi',
      'Bảo hành chính hãng 36 tháng lỗi đổi mới'
    ]
  },
  {
    id: 'pc-006',
    name: 'PC Gaming ITX Valkyrie Mini Ryzen 7 7800X3D • RTX 4070 Ti Super',
    category_id: 'gaming-pc',
    price: 49990000,
    oldPrice: 54990000,
    discount: 9,
    rating: 5.0,
    reviewCount: 38,
    stock: 6,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    description: 'Tuyệt tác máy tính cỡ nhỏ Mini-ITX để bàn siêu gọn gàng nhưng chứa đựng sức mạnh khủng khiếp của CPU Ryzen 7 7800X3D và RTX 4070 Ti Super.',
    specifications: {
      'CPU': 'AMD Ryzen 7 7800X3D (8 nhân / 16 luồng, 3D V-Cache)',
      'Tản nhiệt': 'AIO Phanteks Glacier One 240 T30 V2',
      'Mainboard': 'ROG STRIX B650E-I GAMING WIFI Mini-ITX',
      'RAM': '32GB G.Skill Flare X5 DDR5 6000MHz',
      'VGA': 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB',
      'SSD': 'WD Black SN850X 1TB PCIe Gen4',
      'Nguồn': 'Corsair SF750 750W 80 Plus Platinum SFX',
      'Vỏ case': 'FormD T1 V2.1 Titanium Sandwich ITX'
    },
    features: [
      'Thể tích chỉ 9.95 Lít đặt vừa vặn trong balo mang đi du đấu',
      'Vỏ nhôm phay CNC cao cấp tiêu chuẩn hàng không vũ trụ',
      'Hiệu năng tản nhiệt tối ưu không bị nghẽn xung nhiệt độ',
      'Nguồn Platinum chuẩn SFX bền bỉ và êm ái tuyệt đối'
    ]
  },
  {
    id: 'pc-007',
    name: 'PC Đồng Bộ Dell Vostro 3020 MT Core i5-13400 (Chính Hãng)',
    category_id: 'office-pc',
    price: 14590000,
    oldPrice: 15990000,
    discount: 9,
    rating: 4.8,
    reviewCount: 88,
    stock: 20,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80',
    description: 'Dòng máy tính đồng bộ danh tiếng của Dell dành cho văn phòng, ngân hàng, trường học với độ ổn định 24/7 và bảo hành tận nơi ProSupport.',
    specifications: {
      'CPU': 'Intel Core i5-13400 (2.5GHz up to 4.6GHz, 20MB Cache)',
      'RAM': '16GB DDR4 3200MHz (Nâng cấp tối đa 64GB)',
      'Ổ cứng': '512GB M.2 PCIe NVMe SSD',
      'Hệ điều hành': 'Windows 11 Home SL + Office Home & Student',
      'Kết nối': 'Wi-Fi 6, Bluetooth 5.2, Cổng LAN Gigabit',
      'Bàn phím chuột': 'Tặng kèm bộ bàn phím và chuột quang Dell chính hãng'
    },
    features: [
      'Thiết kế đồng bộ tối ưu luồng gió làm việc bền bỉ nhiều năm',
      'Đầy đủ các cổng kết nối USB 3.2, HDMI, DisplayPort tiện lợi',
      'Bản quyền phần mềm Windows 11 và Office trọn đời',
      'Dịch vụ bảo hành tận nơi ProSupport của Dell Việt Nam'
    ]
  },
  {
    id: 'cpu-004',
    name: 'AMD Ryzen 9 7950X3D (16 Cores / 32 Threads, 144MB Cache)',
    category_id: 'cpu',
    price: 16990000,
    oldPrice: 18490000,
    discount: 8,
    rating: 5.0,
    reviewCount: 92,
    stock: 15,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80',
    description: 'CPU cao cấp nhất của đội Đỏ kết hợp hoàn hảo giữa 16 nhân làm việc đồ họa nặng và bộ nhớ đệm 3D V-Cache cho FPS game đỉnh chóp.',
    specifications: {
      'Số nhân / Luồng': '16 nhân / 32 luồng',
      'Xung nhịp': '4.2 GHz Boost lên 5.7 GHz',
      'Tổng bộ nhớ đệm': '144 MB (128MB L3 + 16MB L2)',
      'Socket': 'AM5 (PCIe 5.0, DDR5)',
      'TDP': '120W tiết kiệm điện'
    },
    features: [
      'Vừa render 3D / Premiere siêu tốc vừa chơi game max setting',
      'Bộ nhớ đệm 144MB khổng lồ khử hoàn toàn hiện tượng drop FPS',
      'Hỗ trợ ép xung tự động Precision Boost Overdrive (PBO)',
      'Tương thích socket AM5 hỗ trợ cập nhật lâu dài'
    ]
  },
  {
    id: 'cpu-005',
    name: 'Intel Core i5-14600K (14 Cores / 20 Threads, 5.3 GHz)',
    category_id: 'cpu',
    price: 7690000,
    oldPrice: 8490000,
    discount: 9,
    rating: 4.8,
    reviewCount: 260,
    stock: 45,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
    description: 'Vị vua CPU phân khúc tầm trung thế hệ 14 Raptor Lake Refresh, xung nhịp 5.3 GHz cân đẹp mọi cấu hình gaming từ RTX 4060 đến RTX 4070 Ti.',
    specifications: {
      'Số nhân / Luồng': '14 nhân (6P + 8E) / 20 luồng',
      'Xung nhịp Max': '5.3 GHz Intel Turbo Boost',
      'Intel Smart Cache': '24 MB',
      'Socket': 'LGA 1700',
      'Đồ họa': 'Intel UHD Graphics 770 tích hợp'
    },
    features: [
      'Hiệu năng chơi game ngang ngửa các dòng Core i9 thế hệ cũ',
      'Khả năng ép xung linh hoạt với hệ số nhân mở (K)',
      'Công nghệ Intel QuickSync tối ưu xuất video trong Premiere',
      'Mức giá cực kỳ hợp lý cho cấu hình tầm trung'
    ]
  },
  {
    id: 'gpu-004',
    name: 'Gigabyte Radeon RX 7900 XTX Gaming OC 24GB VRAM',
    category_id: 'gpu',
    price: 28990000,
    oldPrice: 31990000,
    discount: 9,
    rating: 4.9,
    reviewCount: 74,
    stock: 11,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    description: 'Card đồ họa đầu bảng kiến trúc RDNA 3 của AMD với bộ nhớ VRAM khổng lồ 24GB GDDR6, cổng kết nối DisplayPort 2.1 xuất hình ảnh 8K 165Hz.',
    specifications: {
      'Stream Processors': '6,144 Units',
      'VRAM': '24GB GDDR6 384-bit',
      'Xung nhịp Boost': '2,525 MHz',
      'Cổng xuất hình': 'DisplayPort 2.1 và HDMI 2.1a',
      'Tản nhiệt': 'Hệ thống tản nhiệt Windforce 3 quạt 100mm'
    },
    features: [
      'Dung lượng VRAM 24GB thoải mái load texture 4K và huấn luyện mô hình AI',
      'Băng thông chuẩn DisplayPort 2.1 mở khóa tần số quét màn hình 8K',
      'Công nghệ nâng cấp hình ảnh AMD FSR 3 Fluid Motion Frames',
      'Bảo hành chính hãng 4 năm từ Gigabyte'
    ]
  },
  {
    id: 'gpu-005',
    name: 'ASUS Dual GeForce RTX 4060 Ti White Edition 8GB OC',
    category_id: 'gpu',
    price: 10990000,
    oldPrice: 11990000,
    discount: 8,
    rating: 4.8,
    reviewCount: 165,
    stock: 28,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80',
    description: 'Thiết kế màu trắng tinh tế kích thước nhỏ gọn 2.5 slot, quạt Axial-tech làm mát hiệu quả cho các dàn PC Gaming tone White.',
    specifications: {
      'CUDA Cores': '4,352 Cores',
      'Bộ nhớ': '8GB GDDR6 128-bit',
      'Xung nhịp OC': '2,595 MHz',
      'Cổng xuất hình': '1x HDMI 2.1a, 3x DisplayPort 1.4a',
      'Kích thước': '22.7 x 12.3 x 4.96 cm'
    },
    features: [
      'Tone màu Trắng White Edition sang trọng dễ phối màu case',
      'Hỗ trợ Ray Tracing thế hệ 3 và DLSS 3 mượt mà',
      'Quạt làm mát công nghệ vòng bi kép tuổi thọ cao',
      'Chế độ 0dB yên tĩnh khi card hoạt động ở nhiệt độ thấp'
    ]
  },
  {
    id: 'ram-004',
    name: 'Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 7200MHz White',
    category_id: 'ram',
    price: 4990000,
    oldPrice: 5590000,
    discount: 11,
    rating: 5.0,
    reviewCount: 88,
    stock: 20,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
    description: 'Dòng RAM cao cấp nhất lịch sử Corsair với thanh tản nhiệt nhôm rèn nguyên khối, nắp trên có thể tháo rời tùy biến và tốc độ bus đỉnh cao 7200MHz.',
    specifications: {
      'Dung lượng': '32GB (2 x 16GB)',
      'Tốc độ Bus': '7200 MHz CL34 siêu nhanh',
      'LED': '11 bóng LED CAPELLIX RGB rực rỡ siêu sáng',
      'Tản nhiệt': 'Công nghệ làm mát DHX Patented cooling'
    },
    features: [
      'Bus 7200MHz phá vỡ mọi giới hạn băng thông bộ nhớ',
      'Thiết kế mô-đun nắp trên có thể thay đổi dạng tản nhiệt vây fin hoặc in 3D',
      'Được tuyển chọn từ các IC nhớ cao cấp nhất cho khả năng ép xung tối đa',
      'Đồng bộ hoàn hảo qua phần mềm Corsair iCUE'
    ]
  },
  {
    id: 'ssd-004',
    name: 'Kingston KC3000 2TB PCIe 4.0 NVMe M.2 (7000 MB/s)',
    category_id: 'ssd',
    price: 3890000,
    oldPrice: 4290000,
    discount: 9,
    rating: 4.9,
    reviewCount: 195,
    stock: 40,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80',
    description: 'Ổ cứng SSD hiệu năng cao trang bị bộ điều khiển Phison E18 và tấm tản nhiệt Graphene nhôm mỏng nhẹ, tốc độ đọc ghi 7000/7000 MB/s.',
    specifications: {
      'Dung lượng': '2TB (2048GB)',
      'Tốc độ đọc / ghi': '7,000 MB/s / 7,000 MB/s',
      'Đọc ghi ngẫu nhiên 4K': '1,000,000 IOPS',
      'Độ bền': '1600 TBW cực trâu bò',
      'Tản nhiệt': 'Graphene nhôm tản nhiệt thụ động hiệu quả cao'
    },
    features: [
      'Tốc độ đọc ghi đồng đều 7000MB/s cho cả đọc và ghi file nặng',
      'Độ bền ghi dữ liệu 1600 TBW gấp đôi các dòng SSD thông thường',
      'Tấm Graphene mỏng phù hợp cho cả laptop mỏng nhẹ và PS5',
      'Bảo hành chính hãng 5 năm'
    ]
  },
  {
    id: 'ssd-005',
    name: 'Crucial T700 1TB PCIe Gen5 NVMe (12.400 MB/s Thế Hệ Mới)',
    category_id: 'ssd',
    price: 4590000,
    oldPrice: 4990000,
    discount: 8,
    rating: 5.0,
    reviewCount: 64,
    stock: 15,
    isFeatured: 1,
    isNew: 1,
    isSale: 0,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    description: 'Kỷ nguyên SSD PCIe Gen 5 với tốc độ đọc kinh hoàng 12.400 MB/s, nhanh gần gấp đôi so với PCIe Gen 4, giải phóng hoàn toàn thời gian load game DirectStorage.',
    specifications: {
      'Chuẩn giao tiếp': 'PCIe 5.0 x4 NVMe 2.0',
      'Tốc độ đọc tuần tự': 'Lên tới 12,400 MB/s',
      'Tốc độ ghi tuần tự': 'Lên tới 11,800 MB/s',
      'Công nghệ': 'Micron 232-layer 3D TLC NAND',
      'Tản nhiệt': 'Kèm khối Heatsink nhôm và đồng tản nhiệt chủ động'
    },
    features: [
      'Tốc độ đọc ghi phá vỡ mọi kỷ lục thế giới (12.400 MB/s)',
      'Tối ưu hóa cho công nghệ Microsoft DirectStorage load cảnh game trong 1 giây',
      'Khối Heatsink thiết kế khí động học tản nhiệt cấp tốc',
      'Tương thích hoàn hảo các bo mạch chủ Intel Z790 và AMD X670E'
    ]
  },
  {
    id: 'mon-004',
    name: 'Màn hình Cong Siêu Rộng Samsung Odyssey OLED G9 49" 240Hz 0.03ms',
    category_id: 'monitor',
    price: 36990000,
    oldPrice: 41990000,
    discount: 12,
    rating: 5.0,
    reviewCount: 45,
    stock: 8,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    description: 'Màn hình gaming OLED tỷ lệ 32:9 tương đương 2 màn hình 27 inch ghép lại, độ cong 1800R bao trọn tầm nhìn, tần số quét 240Hz và chip xử lý Neo Quantum Processor Pro.',
    specifications: {
      'Kích thước': '49 inch siêu rộng Dual QHD (5120 x 1440)',
      'Tấm nền': 'OLED (Độ cong 1800R, độ tương phản 1.000.000:1)',
      'Tần số quét': '240 Hz',
      'Thời gian đáp ứng': '0.03 ms (GTG)',
      'Độ sáng': 'VESA DisplayHDR True Black 400',
      'Âm thanh': 'Loa stereo 5W x 2 tích hợp'
    },
    features: [
      'Tỷ lệ siêu rộng 32:9 trải nghiệm đua xe, bay lượn và đa nhiệm 3 cửa sổ',
      'Tấm nền OLED màu sắc tuyệt mỹ với độ sâu màu đen vô cực',
      'Thiết kế mặt lưng kim loại mỏng chỉ 4.5mm cùng vòng LED CoreSync RGB',
      'Tích hợp nền tảng Smart TV và Gaming Hub chơi game đám mây không cần PC'
    ]
  },
  {
    id: 'mon-005',
    name: 'Màn hình LG UltraGear 27GR93U 27" 4K UHD 144Hz 1ms IPS',
    category_id: 'monitor',
    price: 13990000,
    oldPrice: 15490000,
    discount: 10,
    rating: 4.8,
    reviewCount: 130,
    stock: 25,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    description: 'Màn hình 4K sắc nét chuẩn gaming với tần số quét 144Hz qua cổng HDMI 2.1, tấm nền Fast IPS góc nhìn rộng và dải màu 95% DCI-P3.',
    specifications: {
      'Kích thước': '27 inch 4K UHD (3840 x 2160)',
      'Tấm nền': 'IPS (144Hz, 1ms GTG)',
      'Chuẩn màu': 'DCI-P3 95% (CIE1976), VESA DisplayHDR 400',
      'Cổng kết nối': '2x HDMI 2.1 (4K@144Hz), 1x DisplayPort 1.4',
      'Chân đế': 'Nâng hạ độ cao, xoay dọc 90 độ, gập ngửa'
    },
    features: [
      'Độ phân giải 4K siêu sắc nét 163 điểm ảnh trên mỗi inch',
      'Cổng HDMI 2.1 băng thông tối đa tương thích hoàn hảo cho PS5 và Xbox Series X',
      'Hỗ trợ NVIDIA G-Sync Compatible và AMD FreeSync Premium',
      'Giao diện điều khiển OSD chuyên dụng cho game thủ'
    ]
  },
  {
    id: 'kbd-004',
    name: 'Bàn phím cơ Akko MOD007B PC Tokyo R2 Wireless (Magnetic Switch)',
    category_id: 'keyboard',
    price: 2490000,
    oldPrice: 2890000,
    discount: 14,
    rating: 4.9,
    reviewCount: 110,
    stock: 30,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    description: 'Bàn phím cơ sử dụng switch từ tính Magnetic Switch với tính năng Rapid Trigger đỉnh cao dành cho game thủ FPS (Valorant / CS2) di chuyển dừng ngắm tức thì.',
    specifications: {
      'Switch': 'Akko Cream Yellow Magnetic Switch (Hall Effect)',
      'Tính năng đặc biệt': 'Rapid Trigger điều chỉnh điểm nhận từ 0.1mm - 4.0mm',
      'Kết nối': '3 chế độ: Type-C, Bluetooth 5.0, Wireless 2.4GHz',
      'Keycap': 'PBT Dye-Sub OEM Profile chủ đề Hoa Anh Đào Tokyo',
      'Núm xoay': 'Knob nhôm điều khiển âm lượng đa phương tiện'
    },
    features: [
      'Tính năng Rapid Trigger nhận diện hành trình phím sub-millimeter 0.1mm',
      'Switch từ tính Hall Effect không điểm tiếp xúc cơ học, tuổi thọ 100 triệu lần nhấn',
      'Họa tiết hoa anh đào Tokyo R2 tuyệt đẹp cho góc làm việc',
      'Phần mềm Akko Cloud Driver tùy chỉnh macro và độ nhạy từng phím'
    ]
  },
  {
    id: 'kbd-005',
    name: 'Bàn phím cơ không dây Logitech G915 TKL Lightspeed White',
    category_id: 'keyboard',
    price: 4290000,
    oldPrice: 4890000,
    discount: 12,
    rating: 4.8,
    reviewCount: 140,
    stock: 22,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    description: 'Bàn phím cơ Low-Profile siêu mỏng vỏ nhôm xước phi thuyền, công nghệ không dây Lightspeed độ trễ 1ms và con lăn chỉnh âm lượng bằng kim loại sang trọng.',
    specifications: {
      'Layout': 'TKL (Tenkeyless) gọn gàng',
      'Switch': 'GL Tactile Low Profile (Hành trình ngắn 1.5mm)',
      'Kết nối': 'Lightspeed 2.4GHz (1ms) & Bluetooth',
      'Chất liệu': 'Hợp kim nhôm 5052 chải xước cao cấp',
      'Pin': 'Lên đến 40 giờ bật LED RGB 100%'
    },
    features: [
      'Thiết kế Low-Profile siêu mỏng gõ êm không cần kê tay',
      'Công nghệ không dây Lightspeed thi đấu thể thao điện tử chuẩn xác',
      'Con lăn âm lượng bằng nhôm xoay mượt mà',
      'LED RGB LIGHTSYNC 16.8 triệu màu đồng bộ'
    ]
  },
  {
    id: 'mouse-003',
    name: 'Chuột Gaming Siêu Nhẹ Razer Viper V3 Pro Wireless 54g',
    category_id: 'mouse',
    price: 3990000,
    oldPrice: 4390000,
    discount: 9,
    rating: 5.0,
    reviewCount: 180,
    stock: 45,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
    description: 'Mẫu chuột esport nhẹ nhất của Razer với trọng lượng chỉ 54g, tích hợp dongle HyperPolling 8000Hz không dây sẵn trong hộp và cảm biến Focus Pro 35K Gen-2.',
    specifications: {
      'Trọng lượng': '54 gram siêu nhẹ',
      'Cảm biến': 'Razer Focus Pro 35K Optical Sensor Gen-2 (35.000 DPI)',
      'Tần số phản hồi': 'HyperPolling Wireless 8000 Hz (0.125ms)',
      'Switch': 'Optical Mouse Switches Gen-3 (90 triệu lần bấm)',
      'Pin': 'Lên đến 95 giờ ở 1000Hz (17 giờ ở 8000Hz)'
    },
    features: [
      'Trọng lượng chỉ 54g cân bằng đối xứng hoàn hảo cho mọi kiểu cầm',
      'Tần số quét 8000Hz nhanh gấp 8 lần chuột gaming thông thường',
      'Cảm biến quang học Focus Pro 35K chính xác từng pixel trên mọi bề mặt kể cả kính',
      'Switch quang học thế hệ 3 loại bỏ hoàn toàn hiện tượng debounce delay'
    ]
  },
  {
    id: 'mouse-004',
    name: 'Chuột Công Thái Học Không Dây Logitech MX Master 3S',
    category_id: 'mouse',
    price: 2290000,
    oldPrice: 2690000,
    discount: 15,
    rating: 4.9,
    reviewCount: 350,
    stock: 55,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
    description: 'Chuột văn phòng và sáng tạo nội dung số 1 thế giới với nút bấm Quiet Click giảm 90% tiếng ồn, con lăn từ tính MagSpeed cuộn 1000 dòng/giây và cảm biến 8000 DPI.',
    specifications: {
      'Cảm biến': 'Darkfield High Precision (200 - 8000 DPI, di được trên mặt kính)',
      'Con lăn chính': 'MagSpeed SmartShift từ tính thép không gỉ',
      'Con lăn phụ': 'Con lăn ngón cái cuộn ngang trang tính Excel / Timeline video',
      'Kết nối': 'Bluetooth Low Energy & Đầu thu Logi Bolt',
      'Pin': 'Lên đến 70 ngày, sạc nhanh 1 phút dùng được 3 giờ'
    },
    features: [
      'Nút bấm Quiet Click giảm 90% tiếng ồn không làm phiền đồng nghiệp',
      'Con lăn từ tính MagSpeed cuộn 1000 dòng chỉ trong 1 giây',
      'Tính năng Logitech Flow sao chép văn bản, hình ảnh giữa 3 máy tính khác nhau',
      'Form cầm công thái học nâng đỡ lòng bàn tay và ngón cái tuyệt đối'
    ]
  },
  {
    id: 'headset-003',
    name: 'Tai nghe Gaming Không Dây Razer BlackShark V2 Pro 2023',
    category_id: 'headset',
    price: 4490000,
    oldPrice: 4990000,
    discount: 10,
    rating: 4.9,
    reviewCount: 160,
    stock: 28,
    isFeatured: 0,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    description: 'Tai nghe esport huyền thoại nâng cấp microphone HyperClear Super Wideband dải tần siêu rộng chuẩn phòng thu, thời lượng pin khủng 70 giờ và đệm tai thoáng khí.',
    specifications: {
      'Driver': 'Razer TriForce Titanium 50mm',
      'Microphone': 'Razer HyperClear Super Wideband Mic (Tháo rời được)',
      'Kết nối': 'Razer HyperSpeed Wireless 2.4GHz & Bluetooth 5.2',
      'Thời lượng Pin': 'Lên đến 70 giờ chơi liên tục',
      'Trọng lượng': '320 gram siêu êm ái'
    },
    features: [
      'Microphone đàm thoại trong trẻo chi tiết chuẩn phòng thu podcast',
      'Cấu hình âm thanh EQ được tinh chỉnh bởi các tuyển thủ Pro Player thế giới',
      'Đệm tai mút hoạt tính bọc vải siêu thoáng khí không bị nóng tai',
      'Thời lượng pin 70 giờ kết hợp sạc nhanh Type-C 15 phút nghe 6 giờ'
    ]
  },
  {
    id: 'headset-004',
    name: 'Tai nghe Gaming Không Dây Sony INZONE H9 Chống Ồn ANC',
    category_id: 'headset',
    price: 5890000,
    oldPrice: 6590000,
    discount: 11,
    rating: 4.8,
    reviewCount: 72,
    stock: 18,
    isFeatured: 1,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    description: 'Thừa hưởng công nghệ chống ồn danh tiếng của dòng Sony 1000X, tái tạo không gian âm thanh 360 Spatial Sound for Gaming tối ưu cho cả PC và PS5.',
    specifications: {
      'Chống ồn': 'Dual Noise Sensor Technology (Chống ồn chủ động ANC & Chế độ âm thanh xung quanh)',
      'Âm thanh': '360 Spatial Sound for Gaming định vị chính xác',
      'Kết nối': 'Wireless 2.4GHz qua USB dongle & Bluetooth',
      'Thời lượng Pin': '32 giờ tắt chống ồn, sạc nhanh 10 phút chơi 60 phút',
      'Đệm tai': 'Da nhân tạo mềm mại tương tự dòng tai nghe đầu bảng WH-1000XM5'
    },
    features: [
      'Khử sạch tiếng ồn quạt máy tính và âm thanh môi trường xung quanh',
      'Phần mềm INZONE Hub chụp hình dáng tai để tối ưu hóa âm trường 3D cá nhân hóa',
      'Cần micro gạt lên để tắt tiếng tiện lợi (Flip to mute)',
      'Đồng bộ hoàn hảo giao diện trạng thái âm lượng trên máy chơi game PS5'
    ]
  },
  {
    id: 'acc-003',
    name: 'Ghế Công Thái Học Ergonomic Sihoo Doro C300 Lưới Toàn Thân',
    category_id: 'accessories',
    price: 6490000,
    oldPrice: 7290000,
    discount: 11,
    rating: 4.9,
    reviewCount: 185,
    stock: 25,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1580481077194-c1598fefad19?auto=format&fit=crop&w=1200&q=80',
    description: 'Ghế công thái học bảo vệ cột sống thắt lưng cao cấp, đệm thắt lưng tự động thích ứng chuyển động cơ thể, tay vịn 6D điều chỉnh đa hướng linh hoạt.',
    specifications: {
      'Chất liệu': 'Lưới mây Polymer Cloud Mesh thoáng khí đàn hồi cao',
      'Đệm thắt lưng': 'Cơ chế tự động thích ứng Dynamic Lumbar Support',
      'Kê tay': 'Tay vịn 6D xoay đồng bộ theo tư thế ngả lưng',
      'Tựa đầu': 'Tựa đầu 3D ôm sát đốt sống cổ',
      'Piston': 'Thủy lực Class 4 đạt chuẩn chứng nhận an toàn TUV'
    },
    features: [
      'Hệ thống nâng đỡ lưng dưới tự động ôm sát lưng khi ngồi thẳng hay ngả nghiêng',
      'Lưới toàn thân Cloud Mesh mát mẻ không tích tụ nhiệt vào mùa hè',
      'Góc ngả lưng thư giãn 138 độ có kê chân mở rộng ngủ trưa tiện lợi',
      'Chịu tải trọng tối đa lên tới 150 kg cực kỳ vững chắc'
    ]
  },
  {
    id: 'acc-004',
    name: 'Ghế Gaming Da PU Cao Cấp Corsair T3 Rush Charcoal',
    category_id: 'accessories',
    price: 5990000,
    oldPrice: 6690000,
    discount: 10,
    rating: 4.8,
    reviewCount: 95,
    stock: 16,
    isFeatured: 0,
    isNew: 0,
    isSale: 1,
    isHot: 0,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=1200&q=80',
    description: 'Thiết kế lấy cảm hứng từ ghế ngồi xe đua thể thao chuyên nghiệp, bọc vải nỉ cao cấp thoáng khí mát mẻ kết hợp gối đệm mút hoạt tính cao cấp.',
    specifications: {
      'Chất liệu': 'Vải nỉ thể thao mềm mại thoáng khí chống bám mồ hôi',
      'Khung ghế': 'Khung thép cường lực định hình bền bỉ',
      'Kê tay': 'Tay vịn 4D nâng hạ, trượt trước sau, xoay trái phải',
      'Góc ngả': 'Ngả lưng phẳng 180 độ',
      'Bánh xe': 'Bánh xe đôi 65mm chống trầy xước sàn gỗ'
    },
    features: [
      'Chất liệu vải nỉ thoáng khí không bị nóng bí bách như da simili rẻ tiền',
      'Gối đệm cổ và đệm thắt lưng bọc nhung êm ái hỗ trợ tư thế ngồi chuẩn',
      'Khả năng ngả lưng 180 độ nghỉ ngơi thư giãn sau những trận game căng thẳng',
      'Khung thép dày dặn đảm bảo độ bền trên 5 năm sử dụng'
    ]
  },
  {
    id: 'acc-005',
    name: 'Micro Thu Âm Chuyên Nghiệp Elgato Wave:3 USB Condenser',
    category_id: 'accessories',
    price: 3790000,
    oldPrice: 4290000,
    discount: 12,
    rating: 4.9,
    reviewCount: 140,
    stock: 30,
    isFeatured: 1,
    isNew: 1,
    isSale: 1,
    isHot: 1,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    description: 'Chiếc micro streaming và podcast tiêu chuẩn vàng của Elgato với công nghệ chống vỡ tiếng độc quyền Clipguard và phần mềm trộn âm Wave Link 9 kênh.',
    specifications: {
      'Củ micro': '17mm Electret Condenser Capsule',
      'Định hướng thu': 'Cardioid (Thu âm định hướng phía trước)',
      'Tần số lấy mẫu': '24-bit / 96kHz độ phân giải cao',
      'Dải tần đáp ứng': '70 – 20,000 Hz',
      'Kết nối': 'Cáp Type-C to Type-A cắm là nhận (Plug & Play)'
    },
    features: [
      'Công nghệ độc quyền Clipguard tự động cân bằng âm thanh khi bạn hét lớn',
      'Nút cảm ứng trên đỉnh micro chạm nhẹ là tắt tiếng tức thì (Capacitive Mute)',
      'Phần mềm Wave Link trộn âm thanh chuyên nghiệp từ 9 nguồn âm thanh riêng biệt',
      'Tương thích hoàn hảo với bàn điều khiển Stream Deck'
    ]
  }
];

async function run() {
  console.log('🌱 Bắt đầu thêm 24 sản phẩm đợt 2 vào MySQL maytinh...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh',
  });

  for (const p of batch2) {
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
  console.log(`\n🎉 TỔNG SỐ SẢN PHẨM HIỆN TẠI TRONG CỬA HÀNG: ${allCount[0].total} sản phẩm!`);

  await connection.end();
}

run().catch((err) => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
