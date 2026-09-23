require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

// High quality curated tech images from Unsplash / Tech CDNs
const imgPool = {
  cpu: [
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1000&q=80',
  ],
  gamingPc: [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
  ],
  officePc: [
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
  ],
  monitor: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80',
  ],
  keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
  ],
  headset: [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
  ],
  ram: [
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  ],
  ssd: [
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
  ]
};

function getImg(cat, idx) {
  const list = imgPool[cat] || imgPool.cpu;
  return list[idx % list.length];
}

// 1. CPU items to add (16 items: cpu-006 -> cpu-021)
const newCpu = [
  { id: 'cpu-006', name: 'Intel Core i5-14400F (Up to 4.7GHz, 10C/16T, LGA1700)', price: 4990000, specs: { 'Số nhân': '10 nhân (6P + 4E)', 'Số luồng': '16 luồng', 'Xung nhịp': 'Lên tới 4.7 GHz', 'Socket': 'LGA 1700', 'TDP': '65W' } },
  { id: 'cpu-007', name: 'Intel Core i7-14700K (Up to 5.6GHz, 20C/28T, 33MB Cache)', price: 10490000, specs: { 'Số nhân': '20 nhân (8P + 12E)', 'Số luồng': '28 luồng', 'Xung nhịp': 'Lên tới 5.6 GHz', 'Socket': 'LGA 1700', 'TDP': '125W - 253W' } },
  { id: 'cpu-008', name: 'Intel Core i9-14900KS Special Edition (Up to 6.2GHz, 24C/32T)', price: 17990000, specs: { 'Số nhân': '24 nhân (8P + 16E)', 'Số luồng': '32 luồng', 'Xung nhịp Max': '6.2 GHz cực đại', 'Socket': 'LGA 1700', 'TDP': '150W - 320W' } },
  { id: 'cpu-009', name: 'Intel Core i3-12100F (Up to 4.3GHz, 4C/8T, 12MB Cache)', price: 1990000, specs: { 'Số nhân': '4 nhân hiệu năng cao', 'Số luồng': '8 luồng', 'Xung nhịp': 'Lên tới 4.3 GHz', 'Socket': 'LGA 1700', 'TDP': '58W' } },
  { id: 'cpu-010', name: 'Intel Core i5-12400F (Up to 4.4GHz, 6C/12T, 18MB Cache)', price: 2890000, specs: { 'Số nhân': '6 nhân', 'Số luồng': '12 luồng', 'Xung nhịp': 'Lên tới 4.4 GHz', 'Socket': 'LGA 1700', 'TDP': '65W' } },
  { id: 'cpu-011', name: 'Intel Core i5-13600K (Up to 5.1GHz, 14C/20T, 24MB Cache)', price: 7490000, specs: { 'Số nhân': '14 nhân (6P + 8E)', 'Số luồng': '20 luồng', 'Xung nhịp': 'Lên tới 5.1 GHz', 'Socket': 'LGA 1700', 'TDP': '125W' } },
  { id: 'cpu-012', name: 'Intel Core i7-13700F (Up to 5.2GHz, 16C/24T, 30MB Cache)', price: 8790000, specs: { 'Số nhân': '16 nhân (8P + 8E)', 'Số luồng': '24 luồng', 'Xung nhịp': 'Lên tới 5.2 GHz', 'Socket': 'LGA 1700', 'TDP': '65W' } },
  { id: 'cpu-013', name: 'AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8C/16T, 104MB 3D V-Cache)', price: 10690000, specs: { 'Số nhân': '8 Cores', 'Số luồng': '16 Threads', 'Cache': '104MB 3D V-Cache độc quyền', 'Socket': 'AM5', 'Kiến trúc': 'Zen 4' } },
  { id: 'cpu-014', name: 'AMD Ryzen 5 7600X (Up to 5.3GHz, 6C/12T, 38MB Cache, AM5)', price: 5490000, specs: { 'Số nhân': '6 Cores', 'Số luồng': '12 Threads', 'Xung nhịp': '4.7 GHz - 5.3 GHz', 'Socket': 'AM5', 'TDP': '105W' } },
  { id: 'cpu-015', name: 'AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16C/32T, 144MB Cache)', price: 16990000, specs: { 'Số nhân': '16 Cores', 'Số luồng': '32 Threads', 'Cache': '144MB 3D V-Cache', 'Socket': 'AM5', 'TDP': '120W' } },
  { id: 'cpu-016', name: 'AMD Ryzen 9 7900X (Up to 5.6GHz, 12C/24T, 76MB Cache, AM5)', price: 10990000, specs: { 'Số nhân': '12 Cores', 'Số luồng': '24 Threads', 'Xung nhịp': '4.7 GHz - 5.6 GHz', 'Socket': 'AM5', 'TDP': '170W' } },
  { id: 'cpu-017', name: 'AMD Ryzen 7 7700 (Up to 5.3GHz, 8C/16T, Kèm tản Wraith Prism RGB)', price: 7990000, specs: { 'Số nhân': '8 Cores', 'Số luồng': '16 Threads', 'Xung nhịp': '3.8 GHz - 5.3 GHz', 'Socket': 'AM5', 'TDP': '65W' } },
  { id: 'cpu-018', name: 'AMD Ryzen 5 5600 (Up to 4.4GHz, 6C/12T, Socket AM4)', price: 2990000, specs: { 'Số nhân': '6 Cores', 'Số luồng': '12 Threads', 'Xung nhịp': 'Lên tới 4.4 GHz', 'Socket': 'AM4', 'TDP': '65W' } },
  { id: 'cpu-019', name: 'AMD Ryzen 7 5700X3D (Up to 4.1GHz, 8C/16T, 100MB 3D V-Cache)', price: 5890000, specs: { 'Số nhân': '8 Cores', 'Số luồng': '16 Threads', 'Cache': '100MB 3D V-Cache', 'Socket': 'AM4', 'TDP': '105W' } },
  { id: 'cpu-020', name: 'Intel Core i9-13900KS (Up to 6.0GHz, 24C/32T, 36MB Cache)', price: 15490000, specs: { 'Số nhân': '24 nhân', 'Số luồng': '32 luồng', 'Xung nhịp Max': '6.0 GHz Out of Box', 'Socket': 'LGA 1700', 'TDP': '150W' } },
  { id: 'cpu-021', name: 'AMD Ryzen 5 8600G (Tích hợp AI NPU & Radeon 760M Graphics)', price: 5290000, specs: { 'Số nhân': '6 Cores / 12 Threads', 'Đồ họa': 'AMD Radeon 760M', 'AI Engine': 'Ryzen AI NPU 16 TOPS', 'Socket': 'AM5', 'TDP': '65W' } }
];

// 2. GPU items to add (16 items: gpu-006 -> gpu-021)
const newGpu = [
  { id: 'gpu-006', name: 'ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC Edition', price: 54990000, specs: { 'Nhân đồ họa': 'RTX 4090', 'VRAM': '24GB GDDR6X', 'Bus': '384-bit', 'Cổng kết nối': '2x HDMI 2.1a, 3x DisplayPort 1.4a', 'Nguồn đề xuất': '1000W' } },
  { id: 'gpu-007', name: 'MSI GeForce RTX 4080 Super 16GB GAMING X TRIO', price: 29990000, specs: { 'Nhân đồ họa': 'RTX 4080 Super', 'VRAM': '16GB GDDR6X', 'Bus': '256-bit', 'Tản nhiệt': 'Tri Frozr 3 Fan Torx 5.0', 'Nguồn đề xuất': '750W' } },
  { id: 'gpu-008', name: 'Gigabyte GeForce RTX 4070 Ti Super AERO OC 16GB White', price: 24990000, specs: { 'Nhân đồ họa': 'RTX 4070 Ti Super', 'VRAM': '16GB GDDR6X', 'Bus': '256-bit', 'Màu sắc': 'Trắng tinh khôi Full White', 'Nguồn đề xuất': '750W' } },
  { id: 'gpu-009', name: 'ASUS Dual GeForce RTX 4070 Super EVO OC 12GB', price: 16990000, specs: { 'Nhân đồ họa': 'RTX 4070 Super', 'VRAM': '12GB GDDR6X', 'Bus': '192-bit', 'Tản nhiệt': 'Dual Axial-tech Fan', 'Nguồn đề xuất': '650W' } },
  { id: 'gpu-010', name: 'MSI GeForce RTX 4060 Ti VENTUS 2X BLACK 16GB OC', price: 12490000, specs: { 'Nhân đồ họa': 'RTX 4060 Ti', 'VRAM': '16GB GDDR6 (Bộ nhớ lớn render AI)', 'Bus': '128-bit', 'Cổng kết nối': '1x HDMI 2.1a, 3x DP 1.4a', 'Nguồn đề xuất': '550W' } },
  { id: 'gpu-011', name: 'Gigabyte GeForce RTX 4060 EAGLE OC 8GB', price: 8490000, specs: { 'Nhân đồ họa': 'RTX 4060', 'VRAM': '8GB GDDR6', 'Bus': '128-bit', 'Tản nhiệt': 'Windforce 3 Fan 80mm', 'Nguồn đề xuất': '450W' } },
  { id: 'gpu-012', name: 'Colorful GeForce RTX 3060 NB DUO 12GB GDDR6', price: 6890000, specs: { 'Nhân đồ họa': 'RTX 3060', 'VRAM': '12GB GDDR6', 'Bus': '192-bit', 'Cuda Cores': '3584', 'Nguồn đề xuất': '550W' } },
  { id: 'gpu-013', name: 'ASUS Dual Radeon RX 7600 V2 OC Edition 8GB', price: 6990000, specs: { 'Nhân đồ họa': 'AMD Radeon RX 7600', 'VRAM': '8GB GDDR6', 'Kiến trúc': 'RDNA 3', 'Cổng kết nối': '1x HDMI 2.1, 3x DP 1.4', 'Nguồn đề xuất': '550W' } },
  { id: 'gpu-014', name: 'Sapphire PULSE Radeon RX 7700 XT 12GB GDDR6', price: 12990000, specs: { 'Nhân đồ họa': 'AMD Radeon RX 7700 XT', 'VRAM': '12GB GDDR6', 'Bus': '192-bit', 'Công nghệ': 'FSR 3 / AFMF / AV1 Encode', 'Nguồn đề xuất': '700W' } },
  { id: 'gpu-015', name: 'PowerColor Hellhound Radeon RX 7800 XT 16GB', price: 14990000, specs: { 'Nhân đồ họa': 'AMD Radeon RX 7800 XT', 'VRAM': '16GB GDDR6', 'Bus': '256-bit', 'LED': 'Đèn LED Ice Blue / Amethyst Purple', 'Nguồn đề xuất': '750W' } },
  { id: 'gpu-016', name: 'Sapphire NITRO+ Radeon RX 7900 XTX Vapor-X 24GB', price: 28990000, specs: { 'Nhân đồ họa': 'AMD Radeon RX 7900 XTX', 'VRAM': '24GB GDDR6', 'Bus': '384-bit', 'Tản nhiệt': 'Buồng hơi Vapor-X Chamber', 'Nguồn đề xuất': '800W' } },
  { id: 'gpu-017', name: 'Intel Arc A770 Phantom Gaming 16GB OC', price: 8990000, specs: { 'Nhân đồ họa': 'Intel Arc A770', 'VRAM': '16GB GDDR6 256-bit', 'Công nghệ': 'Intel XeSS / Ray Tracing / AV1 Hardware', 'Nguồn đề xuất': '650W' } },
  { id: 'gpu-018', name: 'ASRock Intel Arc A580 Challenger OC 8GB', price: 4790000, specs: { 'Nhân đồ họa': 'Intel Arc A580', 'VRAM': '8GB GDDR6', 'Xung nhịp': '2000 MHz', 'Cổng': '1x HDMI 2.1, 3x DP 2.0', 'Nguồn đề xuất': '500W' } },
  { id: 'gpu-019', name: 'ZOTAC GAMING GeForce RTX 4070 SUPER Twin Edge 12GB', price: 16490000, specs: { 'Nhân đồ họa': 'RTX 4070 Super', 'VRAM': '12GB GDDR6X', 'Kích thước': 'Siêu nhỏ gọn 2 slot chuẩn ITX', 'Nguồn đề xuất': '650W' } },
  { id: 'gpu-020', name: 'GALAX GeForce RTX 4060 1-Click OC 2X 8GB', price: 7890000, specs: { 'Nhân đồ họa': 'RTX 4060', 'VRAM': '8GB GDDR6', 'Tính năng': '1-Click OC qua App điện thoại', 'Nguồn đề xuất': '450W' } },
  { id: 'gpu-021', name: 'MSI GeForce RTX 3050 VENTUS 2X 6GB OC', price: 4690000, specs: { 'Nhân đồ họa': 'RTX 3050 6GB', 'VRAM': '6GB GDDR6', 'TDP': '70W (Không cần nguồn phụ)', 'Nguồn đề xuất': '350W' } }
];

// 3. PC Gaming items to add (17 items: pc-game-005 -> pc-game-021)
const newGamingPc = [
  { id: 'pc-game-005', name: 'PC Gaming DPC White Dragon (Core i5-14400F • RTX 4060 8GB • 16GB DDR5)', price: 19990000, specs: { 'CPU': 'Intel Core i5-14400F', 'VGA': 'MSI RTX 4060 Ventus White 8GB', 'Mainboard': 'B760M White Wifi', 'RAM': '16GB DDR5 5600MHz RGB', 'SSD': '512GB NVMe M.2 Gen4', 'Tản nhiệt': 'Tản nước AIO 240mm ARGB White', 'Nguồn': '650W 80 Plus Bronze' } },
  { id: 'pc-game-006', name: 'PC Gaming Esport Pro (Intel Core i3-12100F • GTX 1650 4GB • 16GB RAM)', price: 8990000, specs: { 'CPU': 'Intel Core i3-12100F (4C/8T)', 'VGA': 'NVIDIA GTX 1650 4GB GDDR6', 'Mainboard': 'H610M LGA1700', 'RAM': '16GB DDR4 3200MHz Dual Channel', 'SSD': '256GB NVMe SSD', 'Vỏ case': 'Kèm 3 quạt LED RGB mặt lưới mát' } },
  { id: 'pc-game-007', name: 'PC Gaming Cyber Esport (Core i5-12400F • RTX 3060 12GB • 16GB RAM)', price: 14490000, specs: { 'CPU': 'Intel Core i5-12400F', 'VGA': 'GeForce RTX 3060 12GB VRAM', 'Mainboard': 'B760M Gaming', 'RAM': '16GB DDR4 3200MHz Kingston Fury', 'SSD': '512GB PCIe 4.0 NVMe', 'Nguồn': '600W 80 Plus' } },
  { id: 'pc-game-008', name: 'PC Gaming Master V1 (Core i7-14700K • RTX 4070Ti Super • 32GB DDR5)', price: 44990000, specs: { 'CPU': 'Intel Core i7-14700K 20 nhân', 'VGA': 'Gigabyte RTX 4070Ti Super 16GB', 'Mainboard': 'Z790 Gaming Wifi', 'RAM': '32GB DDR5 6000MHz Corsair Vengeance', 'SSD': '1TB Samsung 980 Pro PCIe 4.0', 'Tản nhiệt': 'AIO 360mm LCD Liquid Cooler' } },
  { id: 'pc-game-009', name: 'PC Gaming GodLike ROG (Core i9-14900K • RTX 4090 24GB • 64GB DDR5)', price: 92990000, specs: { 'CPU': 'Intel Core i9-14900K', 'VGA': 'ASUS ROG Strix RTX 4090 24GB', 'Mainboard': 'ROG MAXIMUS Z790 HERO', 'RAM': '64GB (2x32GB) DDR5 6400MHz G.Skill', 'SSD': '2TB Samsung 990 Pro Gen5', 'Tản nhiệt': 'ROG Ryujin III 360 ARGB' } },
  { id: 'pc-game-010', name: 'PC Gaming AMD Ryzen 7 7800X3D • RTX 4080 Super • 32GB DDR5', price: 56990000, specs: { 'CPU': 'AMD Ryzen 7 7800X3D (Vua Gaming)', 'VGA': 'MSI RTX 4080 Super 16GB Gaming X', 'Mainboard': 'B650E AORUS ELITE AX', 'RAM': '32GB DDR5 6000MHz CL30 EXPO', 'SSD': '1TB WD Black SN850X', 'Nguồn': '850W Gold PCIe 5.0' } },
  { id: 'pc-game-011', name: 'PC Gaming Venom (Ryzen 5 7600 • Radeon RX 7700 XT 12GB • 16GB DDR5)', price: 23990000, specs: { 'CPU': 'AMD Ryzen 5 7600 6C/12T', 'VGA': 'Sapphire PULSE RX 7700 XT 12GB', 'Mainboard': 'B650M Gaming Wifi', 'RAM': '16GB DDR5 5600MHz Kingston Fury', 'SSD': '512GB NVMe M.2', 'Nguồn': '700W 80 Plus Bronze' } },
  { id: 'pc-game-012', name: 'PC Gaming Frost White (Core i5-13400F • RTX 4060 Ti 8GB • Tản Nước 240)', price: 22490000, specs: { 'CPU': 'Intel Core i5-13400F 10 nhân', 'VGA': 'Colorful RTX 4060 Ti Ultra White 8GB', 'RAM': '32GB (2x16GB) DDR4 3200 RGB White', 'SSD': '1TB Kingston NV2 NVMe', 'Vỏ case': 'Bể cá 2 mặt kính cường lực trong suốt' } },
  { id: 'pc-game-013', name: 'PC Gaming Streamer Studio (Ryzen 9 7900X • RTX 4070 Super • 32GB RAM)', price: 37990000, specs: { 'CPU': 'AMD Ryzen 9 7900X (12C/24T)', 'VGA': 'ASUS Dual RTX 4070 Super 12GB', 'Mainboard': 'X670 Gaming Wifi', 'RAM': '32GB DDR5 6000MHz', 'SSD': '1TB M.2 PCIe 4.0 5000MB/s', 'Phù hợp': 'Livestream song song 2 nền tảng mượt mà' } },
  { id: 'pc-game-014', name: 'PC Gaming Mini ITX Nhỏ Gọn (Core i5-14400 • RTX 4060 • 32GB RAM)', price: 24900000, specs: { 'CPU': 'Intel Core i5-14400 10 nhân', 'VGA': 'ZOTAC RTX 4060 Twin Edge', 'Mainboard': 'B760I ITX Có Wifi 6E', 'RAM': '32GB DDR5 5600MHz', 'Vỏ case': 'Kích thước 11 Lít xách tay tiện lợi' } },
  { id: 'pc-game-015', name: 'PC Gaming HAF High Airflow (Core i7-13700F • RTX 4070 12GB • 32GB DDR5)', price: 33990000, specs: { 'CPU': 'Intel Core i7-13700F 16 nhân', 'VGA': 'Gigabyte RTX 4070 Windforce 12GB', 'Mainboard': 'B760 AORUS PRO', 'RAM': '32GB DDR5 5600MHz', 'Vỏ case': 'Kèm 4 fan tản nhiệt 140mm cực mát' } },
  { id: 'pc-game-016', name: 'PC Gaming Valkyrie RGB (Core i5-12600KF • RTX 4060 Ti 16GB VRAM)', price: 24500000, specs: { 'CPU': 'Intel Core i5-12600KF (10C/16T)', 'VGA': 'GeForce RTX 4060 Ti 16GB đồ họa', 'Mainboard': 'Z690 Steel Legend', 'RAM': '32GB DDR4 3600MHz RGB', 'SSD': '1TB PCIe 4.0 NVMe' } },
  { id: 'pc-game-017', name: 'PC Gaming budget AMD Ryzen 5 5600 • Radeon RX 6600 8GB', price: 11990000, specs: { 'CPU': 'AMD Ryzen 5 5600 (6C/12T)', 'VGA': 'AMD Radeon RX 6600 8GB GDDR6', 'Mainboard': 'B450M Pro Max', 'RAM': '16GB DDR4 3200MHz', 'SSD': '500GB NVMe M.2' } },
  { id: 'pc-game-018', name: 'PC Gaming Shadow Hunter (Core i5-13600K • RTX 4070 Super 12GB)', price: 31990000, specs: { 'CPU': 'Intel Core i5-13600K 14 nhân', 'VGA': 'MSI RTX 4070 Super Ventus 2X', 'Mainboard': 'MSI MAG B760 TOMAHAWK WIFI', 'RAM': '32GB DDR5 6000MHz RGB', 'Tản nhiệt': 'Thermalright Peerless Assassin 120 SE' } },
  { id: 'pc-game-019', name: 'PC Gaming Apex Predator (Ryzen 7 5700X3D • RTX 4070 12GB)', price: 27900000, specs: { 'CPU': 'AMD Ryzen 7 5700X3D 3D V-Cache', 'VGA': 'Colorful RTX 4070 12GB GDDR6X', 'Mainboard': 'B550 Gaming Plus', 'RAM': '32GB DDR4 3600MHz', 'SSD': '1TB M.2 PCIe 4.0' } },
  { id: 'pc-game-020', name: 'PC Gaming Bể Cá Mini Vision (Core i5-12400F • RTX 4060 White)', price: 18490000, specs: { 'CPU': 'Intel Core i5-12400F', 'VGA': 'Galax RTX 4060 8GB EX White', 'RAM': '16GB DDR4 3200MHz White', 'Vỏ case': 'Bể cá cong panorama không cột chống góc' } },
  { id: 'pc-game-021', name: 'PC Gaming Ultra Titan (Core i9-14900KS • RTX 4090 OC Custom Loop)', price: 115000000, specs: { 'CPU': 'Intel Core i9-14900KS Tuyển Chọn', 'VGA': 'ASUS ROG Strix RTX 4090 OC', 'RAM': '64GB DDR5 7200MHz G.Skill Trident Z5', 'Tản nhiệt': 'Tản nước Custom ống cứng EKWB toàn bộ' } }
];

// 4. PC Văn Phòng items to add (19 items: pc-off-003 -> pc-off-021)
const newOfficePc = [
  { id: 'pc-off-003', name: 'PC Văn Phòng Dell OptiPlex 7010 MT (Core i5-13500 • 16GB • SSD 512GB)', price: 12490000, specs: { 'CPU': 'Intel Core i5-13500 (14 cores, 20 threads)', 'RAM': '16GB DDR4 3200MHz', 'Ổ cứng': '512GB PCIe NVMe SSD', 'Kết nối': 'Wifi 6E, Bluetooth 5.3, LAN Gigabit', 'Độ bền': 'Chuẩn doanh nghiệp hoạt động 24/7' } },
  { id: 'pc-off-004', name: 'PC Đồng Bộ HP ProDesk 400 G9 MT (Core i5-12500 • 8GB • 256GB SSD)', price: 9990000, specs: { 'CPU': 'Intel Core i5-12500 (6C/12T up to 4.6GHz)', 'RAM': '8GB DDR4 (Nâng cấp tối đa 64GB)', 'Ổ cứng': '256GB SSD PCIe NVMe', 'Hệ điều hành': 'Windows 11 Home Bản quyền' } },
  { id: 'pc-off-005', name: 'PC Mini Lenovo ThinkCentre Neo 50q Gen 4 (Core i5-13420H • 16GB • 512GB)', price: 10990000, specs: { 'CPU': 'Intel Core i5-13420H 8 nhân 12 luồng', 'RAM': '16GB DDR4 SO-DIMM', 'Ổ cứng': '512GB SSD M.2 PCIe', 'Kích thước': 'Siêu nhỏ gọn 1 lít gắn sau màn hình' } },
  { id: 'pc-off-006', name: 'PC Văn Phòng Kế Toán Siêu Bền (Core i3-12100 • 8GB RAM • 256GB SSD)', price: 5490000, specs: { 'CPU': 'Intel Core i3-12100 4 nhân 8 luồng', 'RAM': '8GB DDR4 3200MHz', 'Ổ cứng': '256GB SSD M.2 tốc độ cao', 'Cổng xuất hình': 'VGA + HDMI đa năng', 'Nguồn': 'Nguồn công suất thực 400W 80 Plus' } },
  { id: 'pc-off-007', name: 'PC Văn Phòng Đa Nhiệm Mượt (Core i5-12400 • 16GB RAM • 512GB SSD)', price: 7490000, specs: { 'CPU': 'Intel Core i5-12400 (6C/12T đồ họa UHD 730)', 'RAM': '16GB DDR4 3200MHz Dual Channel', 'Ổ cứng': '512GB M.2 NVMe SSD', 'Bảo hành': '36 tháng chính hãng linh kiện mới 100%' } },
  { id: 'pc-off-008', name: 'PC Mini ASUS NUC 13 Pro Desk Edition (Core i7-1360P • 16GB • 512GB SSD)', price: 15990000, specs: { 'CPU': 'Intel Core i7-1360P (12 cores, 16 threads)', 'RAM': '16GB DDR4 3200MHz', 'Ổ cứng': '512GB Gen4 NVMe SSD', 'Cổng kết nối': '2x Thunderbolt 4, 2x HDMI 2.1, 2.5G LAN' } },
  { id: 'pc-off-009', name: 'Apple Mac mini M2 (8-core CPU, 10-core GPU, 8GB Unified, 256GB SSD)', price: 13990000, specs: { 'Chip': 'Apple M2 8-core CPU / 10-core GPU', 'RAM': '8GB Unified Memory siêu tốc', 'Ổ cứng': '256GB SSD', 'Hệ điều hành': 'macOS Sequoia mượt mà, bảo mật' } },
  { id: 'pc-off-010', name: 'PC All-in-One HP 24-df (Core i5-1235U • 16GB • 512GB • 23.8 inch FHD)', price: 14990000, specs: { 'Thiết kế': 'Tất cả trong một All-in-One màn 23.8" FHD IPS', 'CPU': 'Intel Core i5-1235U 10 nhân', 'RAM': '16GB DDR4', 'Phụ kiện': 'Kèm sẵn bàn phím + chuột không dây HP' } },
  { id: 'pc-off-011', name: 'PC All-in-One Dell Inspiron 5420 (Core i7-1355U • 16GB • 512GB • 23.8" FHD)', price: 21990000, specs: { 'Màn hình': '23.8 inch FHD IPS viền siêu mỏng cảm ứng', 'CPU': 'Intel Core i7-1355U (10 nhân 12 luồng)', 'RAM': '16GB DDR4 3200MHz', 'Camera': 'Webcam FHD Pop-up ẩn hiện bảo mật' } },
  { id: 'pc-off-012', name: 'PC Văn Phòng ASUS ExpertCenter D500 (Core i3-13100 • 8GB • 256GB SSD)', price: 7990000, specs: { 'CPU': 'Intel Core i3-13100 Gen 13th', 'RAM': '8GB DDR4', 'Ổ cứng': '256GB SSD PCIe 4.0', 'Bảo mật': 'Chip TPM 2.0 chuẩn bảo mật quân sự' } },
  { id: 'pc-off-013', name: 'PC Văn Phòng Đồ Họa 2D Photoshop/AutoCAD (Core i5-13400 • 32GB • 512GB)', price: 9890000, specs: { 'CPU': 'Intel Core i5-13400 10 nhân 16 luồng', 'RAM': '32GB DDR4 3200MHz chạy mượt file thiết kế nặng', 'Ổ cứng': '512GB NVMe tốc độ cao 3500MB/s' } },
  { id: 'pc-off-014', name: 'PC Mini HP EliteDesk 800 G9 Desktop Mini (Core i7-13700T • 16GB • 512GB)', price: 18900000, specs: { 'CPU': 'Intel Core i7-13700T vPro 16 nhân', 'RAM': '16GB DDR5 4800MHz', 'Kích thước': 'Bỏ vừa túi xách mang đi làm hàng ngày' } },
  { id: 'pc-off-015', name: 'PC Đồng Bộ Lenovo V50t Gen 2 (Core i5-10400 • 8GB • 256GB SSD)', price: 6890000, specs: { 'CPU': 'Intel Core i5-10400 6 nhân 12 luồng', 'RAM': '8GB DDR4 2666MHz', 'Ổ cứng': '256GB SSD M.2 NVMe', 'Thương hiệu': 'Lenovo chính hãng xuất xứ rõ ràng' } },
  { id: 'pc-off-016', name: 'PC Văn Phòng Giá Rẻ DPC Celeron G6900 • 8GB RAM • 128GB SSD', price: 3690000, specs: { 'CPU': 'Intel Celeron G6900 Socket LGA1700', 'RAM': '8GB DDR4', 'Ổ cứng': '128GB SSD M.2', 'Nhu cầu': 'Lướt web, học online, bán hàng và in hóa đơn' } },
  { id: 'pc-off-017', name: 'PC Văn Phòng AMD Ryzen 5 4600G (6C/12T Vega 7 Graphics • 16GB RAM)', price: 5990000, specs: { 'CPU': 'AMD Ryzen 5 4600G 6 nhân 12 luồng', 'Đồ họa tích hợp': 'AMD Radeon Vega 7 mạnh mẽ', 'RAM': '16GB DDR4 3200MHz Dual Channel' } },
  { id: 'pc-off-018', name: 'PC Văn Phòng Cao Cấp Quiet Edition (Core i7-14700 • 32GB RAM • Vỏ Chống Ồn)', price: 16900000, specs: { 'CPU': 'Intel Core i7-14700 20 nhân', 'RAM': '32GB DDR5 5600MHz', 'Vỏ case': 'Lót mút tiêu âm be quiet! tĩnh lặng tuyệt đối' } },
  { id: 'pc-off-019', name: 'PC All-in-One ASUS A3402 (Core i3-1215U • 8GB • 512GB • 23.8 inch IPS)', price: 11990000, specs: { 'Thiết kế': 'Chân đế chữ V sang trọng tối giản bàn làm việc', 'CPU': 'Intel Core i3-1215U 6 nhân', 'Loa': 'Âm thanh SonicMaster to rõ' } },
  { id: 'pc-off-020', name: 'PC Mini Beelink SER5 Max (AMD Ryzen 7 5800H • 16GB • 512GB SSD)', price: 8290000, specs: { 'CPU': 'AMD Ryzen 7 5800H (8 nhân 16 luồng)', 'RAM': '16GB DDR4 (Hỗ trợ 64GB)', 'Xuất hình': 'Hỗ trợ đồng thời 3 màn hình 4K 60Hz' } },
  { id: 'pc-off-021', name: 'PC Mini Mac mini M2 Pro (10-core CPU, 16-core GPU, 16GB, 512GB SSD)', price: 31990000, specs: { 'Chip': 'Apple M2 Pro chuyên nghiệp', 'RAM': '16GB Unified Memory', 'Cổng kết nối': '4 cổng Thunderbolt 4, HDMI 8K' } }
];

// 5. Màn Hình items to add (17 items: mon-005 -> mon-021)
const newMonitors = [
  { id: 'mon-005', name: 'Màn hình ASUS ROG Swift OLED PG27AQDM (27" 2K OLED 240Hz 0.03ms)', price: 23990000, specs: { 'Kích thước': '26.5 inch', 'Tấm nền': 'OLED tương phản vô cực', 'Độ phân giải': '2K QHD (2560 x 1440)', 'Tần số quét': '240Hz', 'Thời gian phản hồi': '0.03ms' } },
  { id: 'mon-006', name: 'Màn hình LG UltraGear 27GR95QE-B (27 inch OLED 240Hz 0.03ms G-Sync)', price: 19990000, specs: { 'Tấm nền': 'OLED chống chói', 'Độ phân giải': 'QHD 2560x1440', 'Chuẩn màu': 'DCI-P3 98.5%', 'Cổng': 'HDMI 2.1, DisplayPort 1.4' } },
  { id: 'mon-007', name: 'Màn hình Samsung Odyssey OLED G9 G95SC (49" Kép cong 240Hz 0.03ms)', price: 32990000, specs: { 'Kích thước': '49 inch siêu rộng 32:9', 'Độ phân giải': 'Dual QHD (5120 x 1440)', 'Độ cong': '1800R', 'Tần số quét': '240Hz' } },
  { id: 'mon-008', name: 'Màn hình Dell UltraSharp U2724D (27" 2K IPS Black 120Hz 100% sRGB)', price: 10490000, specs: { 'Kích thước': '27 inch', 'Tấm nền': 'IPS Black độ tương phản 2000:1', 'Độ phân giải': '2K QHD (2560 x 1440)', 'Tần số quét': '120Hz mượt mà', 'Cổng': 'Cảm biến ánh sáng tự động cân chỉnh' } },
  { id: 'mon-009', name: 'Màn hình Dell UltraSharp U2424E (24 inch FHD IPS Hub Type-C 90W RJ45)', price: 6890000, specs: { 'Kích thước': '23.8 inch IPS', 'Tần số quét': '120Hz Eye-Comfort', 'Cổng kết nối': 'USB-C sạc ngược 90W PD, Cổng mạng LAN RJ45' } },
  { id: 'mon-010', name: 'Màn hình BenQ ZOWIE XL2546K (24.5" FHD 240Hz 0.5ms DyAc+ Chuyên Esport)', price: 11490000, specs: { 'Kích thước': '24.5 inch TN Gaming', 'Tần số quét': '240Hz', 'Công nghệ độc quyền': 'DyAc+ triệt tiêu bóng mờ khi sấy đạn CS2/Valorant' } },
  { id: 'mon-011', name: 'Màn hình ViewSonic VX2758A-2K-PRO-2 (27" 2K Fast IPS 170Hz 1ms)', price: 4490000, specs: { 'Kích thước': '27 inch Fast IPS', 'Độ phân giải': '2K (2560x1440)', 'Tần số quét': '170Hz', 'Giá trị': 'Màn hình 2K quốc dân giá tốt nhất phân khúc' } },
  { id: 'mon-012', name: 'Màn hình MSI MAG 274UPF (27" 4K UHD 144Hz Rapid IPS Type-C 65W)', price: 11990000, specs: { 'Độ phân giải': '4K UHD (3840 x 2160)', 'Tấm nền': 'Rapid IPS 144Hz 1ms GtG', 'Chuẩn màu': 'DCI-P3 97%, sRGB 129%' } },
  { id: 'mon-013', name: 'Màn hình Gigabyte M27Q (27" 2K SS IPS 170Hz 0.5ms KVM Switch)', price: 6490000, specs: { 'Kích thước': '27 inch Super Speed IPS', 'Độ phân giải': '2560x1440', 'Tính năng KVM': 'Chuyển đổi phím chuột giữa 2 máy tính tức thì' } },
  { id: 'mon-014', name: 'Màn hình ASUS TUF Gaming VG259QR (24.5" FHD IPS 165Hz 1ms G-Sync)', price: 3890000, specs: { 'Kích thước': '24.5 inch FHD IPS', 'Tần số quét': '165Hz', 'Chân đế': 'Công thái học xoay dọc 90 độ, nâng hạ tiện lợi' } },
  { id: 'mon-015', name: 'Màn hình AOC 24G2SP (23.8 inch FHD IPS 165Hz 1ms sRGB 126%)', price: 2990000, specs: { 'Kích thước': '23.8 inch IPS', 'Tần số quét': '165Hz', 'Độ phủ màu': '126% sRGB chuyên game và dựng phim' } },
  { id: 'mon-016', name: 'Màn hình Philips Evnia 34M2C7600MV (34" Cong Mini LED WQHD 165Hz)', price: 18990000, specs: { 'Kích thước': '34 inch cong 1500R Mini LED', 'Vùng sáng': '1152 Local Dimming Zones', 'Độ sáng': 'HDR 1400 nits đỉnh cao' } },
  { id: 'mon-017', name: 'Màn hình Di Động ASUS ZenScreen MB166C (15.6" FHD IPS Type-C Siêu Mỏng)', price: 3690000, specs: { 'Kích thước': '15.6 inch xách tay', 'Trọng lượng': 'Chỉ 780g dày 11.8mm', 'Kết nối': '1 dây Type-C duy nhất cấp nguồn và tín hiệu' } },
  { id: 'mon-018', name: 'Màn hình Đồ Họa ProArt PA278CV (27" 2K IPS Calman Verified 100% sRGB)', price: 8990000, specs: { 'Chuẩn màu': 'Delta E < 2 cân màu sẵn tại nhà máy', 'Cổng': 'USB-C DisplayPort 65W Daisy Chain', 'Chân xoay': 'Xoay 4 chiều mượt mà' } },
  { id: 'mon-019', name: 'Màn hình Xiaomi Gaming G24i (23.8" Fast IPS 180Hz 1ms HDR10)', price: 2290000, specs: { 'Kích thước': '23.8 inch', 'Tần số quét': '180Hz siêu mượt', 'Tấm nền': 'Fast IPS góc nhìn 178 độ' } },
  { id: 'mon-020', name: 'Màn hình Samsung Smart Monitor M8 M80C (32" 4K UHD Kèm Camera SlimFit)', price: 10990000, specs: { 'Kích thước': '32 inch 4K', 'Hệ điều hành': 'Tizen OS xem Netflix, YouTube không cần PC', 'Camera': 'SlimFit 1080p nam châm tiện lợi' } },
  { id: 'mon-021', name: 'Màn hình LG DualUp 28MQ780-B (27.6" Tỉ lệ độc lạ 16:18 SDQHD Kèm Arm Ergo)', price: 14490000, specs: { 'Tỉ lệ': '16:18 tương đương 2 màn hình 21.5" xếp chồng', 'Độ phân giải': 'SDQHD (2560 x 2880)', 'Chân đế': 'Arm kẹp bàn công thái học xoay gập đa hướng' } }
];

// 6. Bàn Phím items to add (18 items: kb-004 -> kb-021)
const newKeyboards = [
  { id: 'kb-004', name: 'Bàn phím cơ không dây Akko 3098B Plus Multi-modes (CS Jelly Pink)', price: 1790000, specs: { 'Kết nối': '3 chế độ: Bluetooth 5.0, Wireless 2.4G, Type-C', 'Switch': 'Akko CS Jelly Pink êm ái', 'Keycap': 'PBT Double-shot ASA profile', 'Pin': '3000mAh dùng nhiều tuần' } },
  { id: 'kb-005', name: 'Bàn phím cơ Keychron Q1 Pro Wireless QMK/VIA Nhôm Nguyên Khối', price: 4490000, specs: { 'Chất liệu': 'Khung nhôm CNC 6063 cao cấp', 'Layout': '75% Gasket Mount', 'Hỗ trợ': 'QMK/VIA tùy biến từng nút và núm xoay', 'Kết nối': 'Bluetooth 5.1 & Type-C' } },
  { id: 'kb-006', name: 'Bàn phím cơ Razer BlackWidow V4 Pro Green Switch RGB', price: 4990000, specs: { 'Switch': 'Razer Green Clicky', 'Đèn LED': 'Chroma RGB từng phím kèm dải LED gầm', 'Núm xoay': 'Razer Command Dial đa năng', 'Kê tay': 'Đệm da từ tính có LED' } },
  { id: 'kb-007', name: 'Bàn phím cơ Corsair K100 RGB Optical-Mechanical OPX Switch', price: 5490000, specs: { 'Switch': 'Corsair OPX Quang Học nhận lệnh 1mm', 'Tần số quét': 'Axon 8000Hz Hyper-polling', 'Vòng xoay': 'iCUE Control Wheel điều khiển media' } },
  { id: 'kb-008', name: 'Bàn phím cơ Logitech G Pro X TKL Lightspeed Wireless', price: 3790000, specs: { 'Kết nối': 'Công nghệ không dây Lightspeed siêu nhanh', 'Layout': 'Tenkeyless gọn nhẹ thi đấu', 'Keycap': 'PBT Dual-shot chống mài mòn', 'Bao đựng': 'Kèm túi cứng du lịch tiện lợi' } },
  { id: 'kb-009', name: 'Bàn phím cơ Leopold FC900R PD Sweden Red Switch Cherry', price: 3190000, specs: { 'Switch': 'Cherry MX Red siêu êm', 'Keycap': 'PBT Double-Shot dày 1.5mm trứ danh Leopold', 'Độ bền': 'Tiêu chuẩn gia công cơ khí cao cấp Hàn Quốc' } },
  { id: 'kb-010', name: 'Bàn phím cơ Ducky One 3 RGB Matcha Fullsize (Cherry MX Brown)', price: 2990000, specs: { 'Thiết kế': 'Triết lý QUACK Mechanics chống ồn đỉnh cao', 'Hot-swap': 'Kailh socket thay switch không cần hàn', 'Màu sắc': 'Matcha xanh trà sang trọng' } },
  { id: 'kb-011', name: 'Bàn phím cơ MonsGeek M1W V3 Wireless Nhôm CNC 75% Gasket Mount', price: 1890000, specs: { 'Khung': 'Nhôm CNC anode tĩnh điện', 'Cấu trúc': 'Gasket Mount tiêu âm đầy đủ 5 lớp', 'Switch': 'Akko V3 Piano Pro siêu mượt' } },
  { id: 'kb-012', name: 'Bàn phím cơ Darmoshark TOP75 Tri-Mode TFT Screen Knob', price: 1690000, specs: { 'Màn hình': 'Màn hình màu TFT hiển thị ảnh GIF, pin, giờ', 'Núm kim loại': 'Vặn tăng giảm volume', 'Switch': 'TTC Iron Switch cao cấp' } },
  { id: 'kb-013', name: 'Bàn phím cơ NuPhy Air75 V2 Low-Profile Wireless Siêu Mỏng', price: 2790000, specs: { 'Độ mỏng': 'Bàn phím cơ siêu mỏng đặt lên trên MacBook', 'Switch': 'Gateron Low-profile Cowberry', 'Tần số': '1000Hz Polling rate qua 2.4G' } },
  { id: 'kb-014', name: 'Bàn phím cơ công thái học Feker Alice 80 Ergo Wireless', price: 2190000, specs: { 'Layout': 'Alice Ergo uốn cong bảo vệ cổ tay', 'Kết nối': '3 Mode không dây và có dây', 'Led': 'RGB từng phím và led viền' } },
  { id: 'kb-015', name: 'Bàn phím cơ SteelSeries Apex Pro TKL OmniPoint 2.0 Switch', price: 5290000, specs: { 'Switch': 'OmniPoint 2.0 chỉnh điểm kích hoạt từ 0.2mm - 3.8mm', 'Màn hình': 'OLED Smart Display hiển thị thông số', 'Chức năng': 'Rapid Trigger chuyên game FPS' } },
  { id: 'kb-016', name: 'Bàn phím không dây Logitech MX Keys S Advanced Wireless Silent', price: 2490000, specs: { 'Phím bấm': 'Perfect Stroke lõm ôm đầu ngón tay', 'Đèn nền': 'Tự động sáng khi đưa tay lại gần', 'Kết nối': 'Logi Bolt & Bluetooth 3 thiết bị' } },
  { id: 'kb-017', name: 'Bàn phím cơ Aula F75 Gasket Mount 3 Mode (Reaper Switch)', price: 890000, specs: { 'Switch': 'LEOBOG Reaper Switch âm thanh clack giòn tan', 'Hot-swap': '5 pin tương thích mọi loại switch', 'Đánh giá': 'Vua bàn phím cơ giá rẻ phân khúc dưới 1 triệu' } },
  { id: 'kb-018', name: 'Bàn phím cơ không dây FL-Esports OG87 Retro Classic', price: 2490000, specs: { 'Phong cách': 'Retro hoài cổ máy tính cổ điển', 'Switch': 'Kailh Box Ice Mint', 'Keycap': 'FSA Profile độc quyền gõ cực sướng' } },
  { id: 'kb-019', name: 'Bàn phím cơ DareU EK87 V2 Multi-Led Red Switch', price: 490000, specs: { 'Layout': 'TKL 87 phím gọn gàng', 'Switch': 'DareU D-Switch bền bỉ 50 triệu lần bấm', 'Phù hợp': 'Học sinh sinh viên chơi game giá cực rẻ' } },
  { id: 'kb-020', name: 'Bàn phím cơ Asus ROG Azoth 75% OLED Wireless Tri-Mode', price: 6290000, specs: { 'Màn hình': 'OLED 2 inch hiển thị thông số hệ thống', 'Kèm theo': 'Bộ kit bôi trơn switch ROG DIY Lube Kit', 'Thời lượng pin': 'Hơn 2000 giờ sử dụng' } },
  { id: 'kb-021', name: 'Bàn phím không dây Apple Magic Keyboard with Touch ID & Numeric', price: 4290000, specs: { 'Bảo mật': 'Touch ID mở khóa Mac tức thì', 'Thiết kế': 'Nhôm nguyên khối siêu mỏng sang trọng', 'Tương thích': 'Tối ưu hoàn hảo cho máy tính Mac' } }
];

// 7. Chuột items to add (18 items: mouse-004 -> mouse-021)
const newMice = [
  { id: 'mouse-004', name: 'Chuột không dây Logitech G Pro X Superlight 2 Wireless 60g', price: 3490000, specs: { 'Trọng lượng': 'Chỉ 60g siêu nhẹ', 'Mắt đọc': 'Hero 2 độ phân giải 32.000 DPI', 'Switch': 'Lightforce Lai Cơ - Quang Học', 'Tần số': 'Polling rate 4000Hz mượt mà' } },
  { id: 'mouse-005', name: 'Chuột không dây Razer Viper V3 Pro Wireless 54g Ultra-lightweight', price: 3990000, specs: { 'Trọng lượng': '54g nhẹ nhất phân khúc thi đấu Esport', 'Mắt đọc': 'Focus Pro 35K Gen-2 Optical', 'Polling rate': 'Hỗ trợ không dây 8000Hz HyperPolling' } },
  { id: 'mouse-006', name: 'Chuột không dây Razer DeathAdder V3 Pro White 63g Ergonomic', price: 3190000, specs: { 'Form cầm': 'Công thái học tay phải huyền thoại', 'Switch': 'Razer Optical Gen-3 không double click', 'Pin': 'Thời lượng pin 90 giờ liên tục' } },
  { id: 'mouse-007', name: 'Chuột không dây Logitech MX Master 3S Silent MagSpeed 8K DPI', price: 2190000, specs: { 'Cuộn chuột': 'Con lăn điện từ MagSpeed cuộn 1000 dòng/giây', 'Độ ồn': 'Click tĩnh âm Quiet Clicks giảm 90% tiếng', 'Mắt đọc': 'Darkfield hoạt động trên mặt kính' } },
  { id: 'mouse-008', name: 'Chuột không dây Zowie EC2-CW Wireless Esport Chuẩn Thi Đấu', price: 3690000, specs: { 'Form cầm': 'EC2 công thái học được game thủ CS/Valorant tin dùng', 'Đầu thu': 'Trạm thu sóng Enhancer Receiver chống nhiễu tuyệt đối' } },
  { id: 'mouse-009', name: 'Chuột không dây Pulsar X2 V2 Mini Wireless 51g Red', price: 2290000, specs: { 'Trọng lượng': '51g không đục lỗ', 'Mắt đọc': 'PixArt PAW3395 26.000 DPI', 'Switch': 'Quang học Optical Switch chống bụi' } },
  { id: 'mouse-010', name: 'Chuột không dây Lamzu Atlantis OG V2 Pro 4K Wireless', price: 2390000, specs: { 'Form cầm': 'Đối xứng vuốt nhẹ ôm trọn lòng bàn tay Claw-grip', 'Polling Rate': 'Kèm sẵn Dongle 4K Receiver', 'Phụ kiện': 'Kèm sẵn Grip tape chống trơn' } },
  { id: 'mouse-011', name: 'Chuột không dây Ninjutso Sora V2 Siêu Nhẹ 39g Không Lỗ', price: 2690000, specs: { 'Trọng lượng': '39g nhẹ số 1 thế giới', 'Chất liệu': 'Nhựa Polycarbonate đúc liền khối nguyên bản' } },
  { id: 'mouse-012', name: 'Chuột Gaming ASUS ROG Harpe Ace Aim Lab Edition 54g', price: 2890000, specs: { 'Cảm biến': 'ROG AimPoint 36.000 DPI', 'Phần mềm': 'Tích hợp tính năng Aim Lab Settings Optimizer' } },
  { id: 'mouse-013', name: 'Chuột không dây Logitech G502 X Plus Lightspeed RGB', price: 3290000, specs: { 'Nút bấm': '13 nút bấm có thể lập trình', 'Switch': 'Lightforce hybrid switches', 'Đèn LED': 'RGB 8 vùng chủ động' } },
  { id: 'mouse-014', name: 'Chuột Gaming Glorious Model O 2 Wireless White 68g', price: 1890000, specs: { 'Thiết kế': 'Tổ ong thoáng khí chống mồ hôi tay', 'Mắt đọc': 'BAMF 2.0 26K DPI', 'Pin': 'Lên tới 210 giờ sử dụng' } },
  { id: 'mouse-015', name: 'Chuột không dây ATK Blazing Sky F1 Ultimate 38g 8K', price: 1790000, specs: { 'Trọng lượng': '38g phá vỡ mọi giới hạn', 'Chip xử lý': 'Nordic 52840 cao cấp nhất', 'Tần số': 'Hỗ trợ 8000Hz mượt như tơ' } },
  { id: 'mouse-016', name: 'Chuột không dây E-Dra EM610X Wireless 2.4G Silent', price: 290000, specs: { 'Đặc điểm': 'Click không tiếng ồn, kết nối USB receiver', 'Nhu cầu': 'Học tập văn phòng giá siêu rẻ' } },
  { id: 'mouse-017', name: 'Chuột Gaming SteelSeries Aerox 3 Wireless Ghost Edition', price: 1890000, specs: { 'Đạt chuẩn': 'Chống nước IP54 AquaBarrier chống bụi bẩn', 'Trọng lượng': '68g LED Prism RGB rực rỡ' } },
  { id: 'mouse-018', name: 'Chuột công thái học Logitech Lift Vertical Ergonomic Wireless', price: 1490000, specs: { 'Góc nghiêng': '57 độ tự nhiên thư giãn cổ tay cả ngày', 'Phù hợp': 'Bàn tay vừa và nhỏ của người Việt' } },
  { id: 'mouse-019', name: 'Chuột không dây Apple Magic Mouse White Multi-Touch Surface', price: 1990000, specs: { 'Mặt cảm ứng': 'Vuốt cuộn mượt mà như màn hình cảm ứng iPhone', 'Thiết kế': 'Liền mạch tối giản sang trọng đặc trưng Apple' } },
  { id: 'mouse-020', name: 'Chuột Gaming DareU EM901X RGB Wireless Kèm Dock Sạc Từ Tính', price: 790000, specs: { 'Kèm theo': 'Dock sạc nam châm có đèn viền RGB siêu đẹp', 'Pin': 'Dung lượng pin 930mAh' } },
  { id: 'mouse-021', name: 'Chuột Gaming VGN Dragonfly F1 Pro Max Wireless 55g', price: 990000, specs: { 'Mắt đọc': 'PAW3395 chuẩn flagship', 'Pin': 'Dung lượng 500mAh dùng 130 giờ', 'Giá trị': 'Chuột gaming quốc dân cấu hình khủng giá mềm' } }
];

// 8. Tai Nghe items to add (18 items: hs-004 -> hs-021)
const newHeadsets = [
  { id: 'hs-004', name: 'Tai nghe HyperX Cloud III Wireless (Âm thanh vòm DTS:X, Pin 120H)', price: 3490000, specs: { 'Thời lượng pin': '120 giờ chỉ với 1 lần sạc', 'Màng loa': '53mm tinh chỉnh góc cạnh', 'Micro': '10mm lọc tạp âm trong trẻo', 'Kết nối': 'Không dây 2.4GHz không độ trễ' } },
  { id: 'hs-005', name: 'Tai nghe Logitech G Pro X 2 Lightspeed Wireless Graphene Driver', price: 5490000, specs: { 'Màng loa': '50mm màng Graphene siêu nhẹ độ nhạy cao', 'Kết nối': '3 chế độ: Lightspeed, Bluetooth, Jack 3.5mm', 'Công nghệ Mic': 'Blue VO!CE khử nhiễu AI' } },
  { id: 'hs-006', name: 'Tai nghe SteelSeries Arctis Nova Pro Wireless Chống Ồn Chủ Động ANC', price: 8490000, specs: { 'Chống ồn': 'Active Noise Cancellation 4 micro', 'Trạm điều khiển': 'Base Station màn hình OLED kép thay pin nóng Infinity Power System' } },
  { id: 'hs-007', name: 'Tai nghe Razer BlackShark V2 Pro 2023 Wireless (Mic HyperClear Super Wideband)', price: 4490000, specs: { 'Driver': 'Razer TriForce Titanium 50mm', 'Microphone': 'Super Wideband thu âm chuẩn phòng thu', 'Thời lượng pin': 'Lên tới 70 giờ' } },
  { id: 'hs-008', name: 'Tai nghe Corsair Virtuoso RGB Wireless XT Siêu Cấp', price: 5990000, specs: { 'Chất âm': 'Hi-Res Audio 24bit/96kHz', 'Vật liệu': 'Nhôm phay gia công CNC sang trọng', 'Kết nối kép': 'Nghe đồng thời âm thanh PC và điện thoại' } },
  { id: 'hs-009', name: 'Tai nghe kiểm âm Audio-Technica ATH-M50xBT2 Wireless', price: 4890000, specs: { 'Driver': '45mm khẩu độ lớn chuẩn phòng thu chuyên nghiệp', 'DAC': 'Tích hợp chip DAC AK4331 cao cấp', 'Âm thanh': 'Tái tạo dải âm thanh chân thực chính xác tuyệt đối' } },
  { id: 'hs-010', name: 'Tai nghe Sennheiser EPOS H6PRO Closed Acoustic Gaming', price: 3990000, specs: { 'Thiết kế': 'Closed-back cách âm thụ động hoàn hảo', 'Micro': 'Gạt lên là tắt tiếng nam châm tháo rời' } },
  { id: 'hs-011', name: 'Tai nghe Sony INZONE H9 Wireless Noise Canceling Gaming', price: 5990000, specs: { 'Công nghệ': 'Spatial Sound 360 độ định vị hướng chân kẻ địch', 'Chống ồn': 'Thừa hưởng thuật toán chống ồn từ Sony WH-1000XM5' } },
  { id: 'hs-012', name: 'Tai nghe ASUS ROG Delta S Animate (Màn Hình LED AniMe Matrix)', price: 5190000, specs: { 'Đèn LED': 'Màn hình LED AniMe Matrix hiển thị hiệu ứng độc đáo', 'DAC': 'Hi-Fi ESS 9281 Quad-DAC', 'Trọng lượng': 'Chỉ 310g siêu êm ái' } },
  { id: 'hs-013', name: 'Tai nghe Beyerdynamic DT 770 Pro 80 Ohm Studio Headphone', price: 3790000, specs: { 'Sản xuất': 'Made in Germany nguyên bản', 'Đệm tai': 'Vải nhung Velour trứ danh êm ái thoáng khí', 'Độ bền': 'Huyền thoại phòng thu studio toàn cầu' } },
  { id: 'hs-014', name: 'Tai nghe HyperX Cloud II Red 7.1 Virtual Surround Sound', price: 1690000, specs: { 'Card âm thanh': 'Kèm USB Audio Control Box 7.1', 'Khung': 'Khung nhôm siêu bền bỉ uốn cong không gãy' } },
  { id: 'hs-015', name: 'Tai nghe E-Dra EH410 Pro RGB 7.1 Jack USB', price: 390000, specs: { 'Âm thanh': 'Giả lập 7.1 qua cổng USB', 'Đèn LED': 'LED RGB tự đổi màu', 'Giá trị': 'Tai nghe gaming phổ thông học sinh sinh viên' } },
  { id: 'hs-016', name: 'Tai nghe DareU EH469 RGB 7.1 Driver 50mm', price: 490000, specs: { 'Driver': '50mm nam châm neodymium', 'Ốp tai': 'Bọc da mềm cách âm tốt', 'Cổng cắm': 'USB mạ vàng chống nhiễu' } },
  { id: 'hs-017', name: 'Tai nghe Razer Kraken X Multi-Platform Ultralight 250g', price: 990000, specs: { 'Trọng lượng': 'Chỉ 250g siêu nhẹ không mỏi cổ', 'Tương thích': 'PC, Laptop, PS5, Xbox, Nintendo Switch qua jack 3.5mm' } },
  { id: 'hs-018', name: 'Tai nghe Logitech G435 Lightspeed Wireless & Bluetooth Siêu Nhẹ 165g', price: 1390000, specs: { 'Trọng lượng': '165g nhẹ nhất thế giới tai nghe không dây', 'Micro': 'Mic dạng chùm tia kép tích hợp không cần cần mic vướng víu' } },
  { id: 'hs-019', name: 'Tai nghe Apple AirPods Max (Âm thanh Không gian & Chống Ồn Chủ Động)', price: 12490000, specs: { 'Chất liệu': 'Vòm lưới thoáng khí và quai chụp thép không gỉ', 'Chip âm thanh': '2 chip Apple H1 tính toán âm thanh thông minh' } },
  { id: 'hs-020', name: 'Tai nghe Sony WH-1000XM5 Wireless Noise Cancelling Headphone', price: 7490000, specs: { 'Chống ồn': 'Bộ xử lý V1 + QN1 dẫn đầu thị trường', 'Thời lượng pin': '30 giờ nghe nhạc liên tục' } },
  { id: 'hs-021', name: 'Tai nghe In-ear Gaming Moondrop Chu II Type-C DSP Hi-Fi', price: 590000, specs: { 'Dạng tai': 'In-ear nhét tai nhỏ gọn đeo mát mẻ mùa hè', 'Cáp': 'Type-C tích hợp DAC giải mã âm thanh cao cấp' } }
];

// 9. RAM items to add (18 items: ram-004 -> ram-021)
const newRams = [
  { id: 'ram-004', name: 'Kit RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz White', price: 4690000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '32GB (2x16GB)', 'Bus': '6000MHz', 'LED': 'Capellix RGB 11 bóng siêu sáng', 'Hỗ trợ': 'Intel XMP 3.0 & AMD EXPO' } },
  { id: 'ram-005', name: 'Kit RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz Black', price: 3790000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '32GB (2x16GB)', 'Bus': '6400MHz CL32', 'Tản nhiệt': 'Nhôm phay xước cao cấp biểu tượng Trident' } },
  { id: 'ram-006', name: 'Kit RAM G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz AMD EXPO', price: 3490000, specs: { 'Chuẩn RAM': 'DDR5 Tối ưu hóa riêng cho AMD Ryzen 7000/8000/9000', 'Timing': 'CL30 cực thấp cho độ trễ tối thiểu' } },
  { id: 'ram-007', name: 'Kit RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz', price: 2990000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '32GB (2x16GB)', 'Bus': '5600MHz', 'Tính năng': 'Kingston FURY Infrared Sync Technology đồng bộ LED' } },
  { id: 'ram-008', name: 'Kit RAM TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz White', price: 3190000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '32GB (2x16GB)', 'Bus': '6000MHz', 'Thiết kế': 'Góc mở rộng 120 độ LED RGB toàn cảnh rực rỡ' } },
  { id: 'ram-009', name: 'Kit RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5200MHz Black', price: 2790000, specs: { 'Chuẩn RAM': 'DDR5', 'Bus': '5200MHz', 'Phần mềm': 'Tùy biến qua Corsair iCUE' } },
  { id: 'ram-010', name: 'Kit RAM Adata XPG Lancer Blade RGB 32GB (2x16GB) DDR5 6000MHz', price: 2990000, specs: { 'Chuẩn RAM': 'DDR5', 'Chiều cao': 'Low-profile tương thích mọi loại tản nhiệt khí lớn' } },
  { id: 'ram-011', name: 'Kit RAM G.Skill Ripjaws S5 32GB (2x16GB) DDR5 5600MHz Không LED', price: 2490000, specs: { 'Chuẩn RAM': 'DDR5', 'Thiết kế': 'Tối giản không đèn LED gọn gàng', 'Chiều cao': 'Chỉ 33mm' } },
  { id: 'ram-012', name: 'Kit RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz Black', price: 990000, specs: { 'Chuẩn RAM': 'DDR4', 'Dung lượng': '16GB (2x8GB)', 'Bus': '3200MHz CL16', 'Quốc dân': 'Thanh RAM DDR4 bán chạy số 1 lịch sử' } },
  { id: 'ram-013', name: 'Kit RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz', price: 950000, specs: { 'Chuẩn RAM': 'DDR4', 'Bus': '3200MHz', 'Tản nhiệt': 'Nhôm đen nguyên khối mỏng gọn' } },
  { id: 'ram-014', name: 'Kit RAM Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3200MHz', price: 1390000, specs: { 'Chuẩn RAM': 'DDR4', 'LED': '10 bóng LED RGB sống động từng module' } },
  { id: 'ram-015', name: 'Kit RAM G.Skill Trident Z Royal Gold 32GB (2x16GB) DDR4 3600MHz Cắt Pha Lê', price: 3490000, specs: { 'Chuẩn RAM': 'DDR4', 'Vỏ ngoài': 'Mạ vàng hoàng gia 24K kèm thanh tản sáng dạng vương miện pha lê' } },
  { id: 'ram-016', name: 'Kit RAM Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5 5600MHz', price: 6890000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '64GB (2 thanh 32GB)', 'Bus': '5600MHz', 'Chuyên dụng': 'Dựng phim 4K, đồ họa 3D và máy ảo chuyên nghiệp' } },
  { id: 'ram-017', name: 'RAM Laptop Kingston 16GB DDR5 4800MHz SODIMM', price: 1290000, specs: { 'Chuẩn RAM': 'DDR5 SODIMM cho Laptop', 'Dung lượng': '16GB 1 thanh', 'Bus': '4800MHz', 'Điện áp': '1.1V tiết kiệm pin' } },
  { id: 'ram-018', name: 'RAM Laptop Crucial 16GB DDR4 3200MHz SODIMM', price: 850000, specs: { 'Chuẩn RAM': 'DDR4 SODIMM cho Laptop', 'Dung lượng': '16GB', 'Bus': '3200MHz', 'Tương thích': 'Dễ dàng nâng cấp cho mọi laptop Intel & AMD' } },
  { id: 'ram-019', name: 'RAM Laptop Samsung 8GB DDR4 3200MHz SODIMM', price: 490000, specs: { 'Chuẩn RAM': 'DDR4 SODIMM', 'Dung lượng': '8GB', 'Nhà sản xuất': 'Samsung chính hãng độ bền số 1' } },
  { id: 'ram-020', name: 'Kit RAM TeamGroup T-Create Expert 64GB (2x32GB) DDR5 6000MHz Creator', price: 5490000, specs: { 'Chuẩn RAM': 'DDR5', 'Dung lượng': '64GB cực lớn', 'Định hướng': 'Dành riêng cho nhà sáng tạo nội dung và studio đồ họa' } },
  { id: 'ram-021', name: 'RAM Desktop Lexar Thor 16GB (1x16GB) DDR4 3200MHz Tản Nhôm', price: 790000, specs: { 'Chuẩn RAM': 'DDR4', 'Dung lượng': '16GB', 'Bus': '3200MHz', 'Giá tốt': 'Giải pháp nâng cấp tiết kiệm hiệu quả cao' } }
];

// 10. SSD items to add (18 items: ssd-004 -> ssd-021)
const newSsds = [
  { id: 'ssd-004', name: 'SSD Samsung 990 Pro 2TB NVMe PCIe 4.0 (Đọc 7.450 MB/s, Ghi 6.900 MB/s)', price: 4690000, specs: { 'Chuẩn kết nối': 'PCIe Gen 4.0 x4, NVMe 2.0', 'Tốc độ đọc': 'Lên tới 7,450 MB/s', 'Tốc độ ghi': 'Lên tới 6,900 MB/s', 'Bảo hành': '5 năm chính hãng Samsung' } },
  { id: 'ssd-005', name: 'SSD Samsung 990 Pro with Heatsink 1TB PCIe 4.0 Tản Nhiệt Nhôm Chuyên PS5', price: 3190000, specs: { 'Tích hợp tản nhiệt': 'Heatsink mỏng gọn đạt chuẩn lắp trực tiếp vào PlayStation 5', 'Tốc độ đọc': '7450 MB/s' } },
  { id: 'ssd-006', name: 'SSD WD Black SN850X 1TB PCIe Gen4 NVMe (Đọc 7.300 MB/s Chuyên Game)', price: 2790000, specs: { 'Chuẩn giao tiếp': 'PCIe Gen 4.0 x4', 'Tốc độ đọc': '7,300 MB/s', 'Công nghệ': 'Game Mode 2.0 tối ưu hóa tốc độ load cảnh game' } },
  { id: 'ssd-007', name: 'SSD WD Black SN850X 2TB PCIe Gen4 NVMe (Đọc 7.300 MB/s)', price: 4490000, specs: { 'Dung lượng': '2TB thả ga cài đặt hơn 30 game AAA', 'Tốc độ đọc ghi': '7,300 / 6,600 MB/s' } },
  { id: 'ssd-008', name: 'SSD Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (Đọc 7.000 MB/s, Ghi 6.000 MB/s)', price: 2490000, specs: { 'Bộ điều khiển': 'Phison E18 Controller cao cấp', 'Tản nhiệt': 'Miếng tản nhôm graphene siêu mỏng' } },
  { id: 'ssd-009', name: 'SSD Crucial T705 1TB PCIe Gen5 NVMe (Đọc Kỷ Lục 14.500 MB/s)', price: 5490000, specs: { 'Chuẩn kết nối': 'PCIe Gen 5.0 x4 thế hệ mới nhất', 'Tốc độ đọc': '14,500 MB/s nhanh gấp đôi Gen 4', 'Độ bền': '600 TBW' } },
  { id: 'ssd-010', name: 'SSD Crucial P3 Plus 1TB M.2 PCIe Gen4 NVMe (Đọc 5.000 MB/s)', price: 1790000, specs: { 'Chuẩn giao tiếp': 'PCIe Gen 4.0 NVMe', 'Tốc độ đọc': '5,000 MB/s', 'Giá trị': 'SSD Gen4 1TB có p/p tốt nhất thị trường' } },
  { id: 'ssd-011', name: 'SSD Crucial P3 Plus 2TB M.2 PCIe Gen4 NVMe', price: 3190000, specs: { 'Dung lượng': '2TB lưu trữ dữ liệu khổng lồ', 'Tốc độ đọc': '5,000 MB/s' } },
  { id: 'ssd-012', name: 'SSD Kioxia Exceria Pro 1TB PCIe Gen4 x4 NVMe (Made in Japan)', price: 2190000, specs: { 'Xuất xứ': 'Sản xuất tại Nhật Bản bởi tập đoàn Kioxia (Toshiba Memory)', 'Tốc độ đọc': '7,300 MB/s' } },
  { id: 'ssd-013', name: 'SSD Lexar NM790 2TB M.2 2280 PCIe Gen 4x4 (Đọc 7.400 MB/s, Ghi 6.500 MB/s)', price: 3890000, specs: { 'Chuẩn giao tiếp': 'PCIe Gen 4x4 HMB', 'Tốc độ đọc': '7,400 MB/s', 'Tương thích': 'Hoạt động cực mát trên PC và PS5' } },
  { id: 'ssd-014', name: 'SSD Kingston NV2 500GB PCIe 4.0 NVMe M.2 (Đọc 3.500 MB/s)', price: 1090000, specs: { 'Dung lượng': '500GB', 'Chuẩn cắm': 'M.2 2280 NVMe', 'Phù hợp': 'Cài Windows và phần mềm văn phòng, đồ họa cơ bản' } },
  { id: 'ssd-015', name: 'SSD Kingston NV2 1TB PCIe 4.0 NVMe M.2', price: 1690000, specs: { 'Dung lượng': '1TB', 'Tốc độ đọc': '3,500 MB/s', 'Bảo hành': '3 năm chính hãng' } },
  { id: 'ssd-016', name: 'SSD WD Blue SN580 1TB PCIe Gen4 NVMe (Đọc 4.150 MB/s nCache 4.0)', price: 1890000, specs: { 'Chuẩn': 'PCIe Gen 4.0 x4', 'Tốc độ': '4,150 MB/s', 'Tính năng': 'Công nghệ nCache 4.0 sao chép file lớn không bị tụt tốc' } },
  { id: 'ssd-017', name: 'SSD Samsung 870 EVO 1TB SATA III 2.5 inch (Đọc 560 MB/s)', price: 2290000, specs: { 'Kích thước': '2.5 inch chuẩn SATA 3', 'Tương thích': 'Nâng cấp máy tính bàn cũ và laptop đời cũ không có khe M.2' } },
  { id: 'ssd-018', name: 'SSD Samsung 870 EVO 500GB SATA III 2.5 inch', price: 1450000, specs: { 'Kích thước': '2.5 inch', 'Tốc độ đọc ghi': '560 MB/s / 530 MB/s' } },
  { id: 'ssd-019', name: 'SSD Di Động Samsung T7 Shield 1TB Chống Nước Chống Rơi Type-C (Đọc 1.050 MB/s)', price: 2790000, specs: { 'Thiết kế': 'Vỏ bọc cao su chống nước bụi chuẩn IP65, chịu va đập rơi từ 3m', 'Tốc độ': '1,050 MB/s qua cổng USB 3.2 Gen 2' } },
  { id: 'ssd-020', name: 'SSD Di Động SanDisk Extreme Portable V2 1TB Type-C (Đọc 1.050 MB/s)', price: 2690000, specs: { 'Kích thước': 'Bỏ túi siêu gọn kèm móc khóa carabiner', 'Bảo mật': 'Mã hóa phần cứng AES 256-bit' } },
  { id: 'ssd-021', name: 'SSD Corsair MP600 PRO LPX 1TB PCIe Gen4 M.2 Tản Nhiệt Nhôm Đen', price: 2690000, specs: { 'Tốc độ đọc': '7,100 MB/s', 'Tản nhiệt': 'Khối nhôm tản nhiệt thấp tối ưu hóa cho PS5 và khe hẹp' } }
];

// 11. Phụ Kiện items to add (13 items: acc-010 -> acc-022)
const newAccessories = [
  { id: 'acc-010', name: 'Giá Treo Màn Hình Đôi Human Motion T9 Pro Dual RGB 17-35 inch Piston Gas', price: 1890000, specs: { 'Tải trọng': 'Mỗi tay nâng chịu lực 15kg', 'Kích cỡ màn': 'Từ 17 inch đến 35 inch', 'Trợ lực': 'Piston khí nén Gas Spring cao cấp', 'LED': 'Đèn RGB viền chân đế' } },
  { id: 'acc-011', name: 'Giá Treo Màn Hình North Bayou NB-F80 (17-30 inch Xoay 360 Độ)', price: 349000, specs: { 'Kích thước màn': '17 - 30 inch', 'Tải trọng': '2kg - 9kg', 'Chuẩn VESA': '75x75mm và 100x100mm', 'Đánh giá': 'Tay nâng màn hình quốc dân bán chạy số 1' } },
  { id: 'acc-012', name: 'Bàn Di Chuột Cỡ Lớn SteelSeries QcK Prism Cloth 3XL RGB (1220 x 590mm)', price: 2190000, specs: { 'Kích thước': 'Khổng lồ 3XL (1220 x 590 x 4 mm) phủ kín cả bàn', 'Đèn LED': 'RGB 2 vùng đồng bộ âm thanh Discord và game' } },
  { id: 'acc-013', name: 'Bàn Di Chuột Artisan Hien FX Soft L Red (Made in Japan Chuyên Esport)', price: 1490000, specs: { 'Xuất xứ': 'Sản xuất thủ công tại Nhật Bản', 'Chất liệu': 'Bề mặt Amundsen dệt sợi đặc biệt cân bằng kiểm soát và tốc độ' } },
  { id: 'acc-014', name: 'Đèn Treo Màn Hình Chống Mỏi Mắt BenQ ScreenBar Halo Điều Khiển Không Dây', price: 4290000, specs: { 'Thiết kế quang học': 'Bất đối xứng chiếu sáng mặt bàn, tuyệt đối không lóa màn hình', 'Remote': 'Núm xoay cảm ứng không dây điều chỉnh độ sáng và nhiệt độ màu' } },
  { id: 'acc-015', name: 'Bàn Phím Điều Khiển Stream Deck Elgato MK.2 15 Phím Màn Hình LCD Đổi Màu', price: 3790000, specs: { 'Số phím': '15 phím có màn hình LCD tùy biến icon theo ý muốn', 'Công dụng': 'Một chạm chuyển cảnh OBS, mở ứng dụng, tắt mic, kích hoạt macro' } },
  { id: 'acc-016', name: 'Webcam Chuyên Nghiệp Elgato Facecam Full HD 1080p 60fps Cảm Biến Sony', price: 3690000, specs: { 'Cảm biến': 'Sony STARVIS CMOS đỉnh cao hình ảnh trong nhà', 'Ống kính': 'Kính quang học Elgato Prime Lens f/2.4 tiêu cự cố định' } },
  { id: 'acc-017', name: 'Micro Thu Âm USB Rode NT-USB Mini (Chống Rung Kèm Chân Đế Từ Tính)', price: 2490000, specs: { 'Củ mic': 'Condenser định hướng Cardioid bắt giọng ấm áp', 'Tích hợp': 'Màng lọc gió pop-filter bên trong củ mic' } },
  { id: 'acc-018', name: 'Giá Đỡ Tai Nghe Kèm Hub USB Corsair ST100 RGB Âm Thanh 7.1', price: 1490000, specs: { 'Chất liệu': 'Khung nhôm nguyên khối vững chắc', 'Cổng': '2 cổng USB 3.1 và cổng 3.5mm giả lập âm thanh vòm 7.1' } },
  { id: 'acc-019', name: 'Túi Chống Sốc Laptop Tomtoc 360 Protective CornerArmor 14-16 inch', price: 690000, specs: { 'Công nghệ': 'CornerArmor chống sốc đạt tiêu chuẩn thả rơi quân sự Mỹ', 'Khóa kéo': 'Khóa YKK Nhật Bản mượt mà bền bỉ' } },
  { id: 'acc-020', name: 'Balo Laptop Gaming Predator SUV Backpack Chống Nước Ngăn Chứa 17.3 inch', price: 1990000, specs: { 'Sức chứa': 'Laptop 17.3 inch, bàn phím cơ, tai nghe, chuột và phụ kiện', 'Chất liệu': 'Vải Polyester chống thấm nước cực tốt' } },
  { id: 'acc-021', name: 'Hub Chuyển Đổi Type-C 9 in 1 Ugreen Đa Năng 4K 60Hz PD 100W RJ45', price: 890000, specs: { 'Cổng kết nối': '1x HDMI 4K 60Hz, 1x USB-C PD 100W, 3x USB 3.0, 1x RJ45 Gigabit, SD/TF' } },
  { id: 'acc-022', name: 'Bộ Vệ Sinh Bàn Phím & Màn Hình Laptop Đa Năng 8 Trong 1', price: 99000, specs: { 'Bao gồm': 'Chổi quét bụi, dụng cụ nhổ keycap, bút lau tai nghe, bình xịt cồn và khăn lau nhung' } }
];

// Combine all groups into a unified product builder
const catalogGroups = [
  { cat: 'cpu', items: newCpu, imgCat: 'cpu', descPrefix: 'Bộ vi xử lý CPU hiệu năng cao hàng chính hãng' },
  { cat: 'gpu', items: newGpu, imgCat: 'gpu', descPrefix: 'Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa' },
  { cat: 'gaming-pc', items: newGamingPc, imgCat: 'gamingPc', descPrefix: 'Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS' },
  { cat: 'office-pc', items: newOfficePc, imgCat: 'officePc', descPrefix: 'Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện' },
  { cat: 'monitor', items: newMonitors, imgCat: 'monitor', descPrefix: 'Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác' },
  { cat: 'keyboard', items: newKeyboards, imgCat: 'keyboard', descPrefix: 'Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ' },
  { cat: 'mouse', items: newMice, imgCat: 'mouse', descPrefix: 'Chuột máy tính độ chính xác cao, thao tác nhanh nhạy' },
  { cat: 'headset', items: newHeadsets, imgCat: 'headset', descPrefix: 'Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét' },
  { cat: 'ram', items: newRams, imgCat: 'ram', descPrefix: 'Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà' },
  { cat: 'ssd', items: newSsds, imgCat: 'ssd', descPrefix: 'Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc' },
  { cat: 'accessories', items: newAccessories, imgCat: 'accessories', descPrefix: 'Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp' },
];

const allProducts = [];

catalogGroups.forEach(group => {
  group.items.forEach((item, idx) => {
    const discount = (idx % 3 === 0) ? 10 : (idx % 2 === 0) ? 8 : 12;
    const oldPrice = Math.round((item.price * (1 + discount / 100)) / 10000) * 10000;
    const rating = parseFloat((4.7 + (idx % 4) * 0.1).toFixed(1));
    const reviewCount = 20 + ((idx * 9) % 130);
    const stock = 10 + ((idx * 4) % 25);
    const image = getImg(group.imgCat, idx);

    const features = [
      'Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng',
      'Chính sách bảo hành đổi mới uy tín từ nhà phân phối',
      'Được kiểm tra và chạy thử ổn định trước khi giao',
      'Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc'
    ];

    const description = `${group.descPrefix} - ${item.name}. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.`;

    allProducts.push({
      id: item.id,
      name: item.name,
      category_id: group.cat,
      price: item.price,
      oldPrice,
      discount,
      rating,
      reviewCount,
      stock,
      isFeatured: (idx % 4 === 0) ? 1 : 0,
      isNew: (idx % 3 === 0) ? 1 : 0,
      isSale: (idx % 2 === 0) ? 1 : 0,
      isHot: (idx % 5 === 0) ? 1 : 0,
      image,
      description,
      specifications: item.specs,
      features
    });
  });
});

console.log(`Prepared ${allProducts.length} new products across all 11 categories.`);

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  console.log('Inserting/Upserting products into MySQL...');

  const query = `
    INSERT INTO products (
      id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
      isFeatured, isNew, isSale, isHot, image, description, specifications, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      category_id = VALUES(category_id),
      price = VALUES(price),
      oldPrice = VALUES(oldPrice),
      discount = VALUES(discount),
      rating = VALUES(rating),
      reviewCount = VALUES(reviewCount),
      stock = VALUES(stock),
      isFeatured = VALUES(isFeatured),
      isNew = VALUES(isNew),
      isSale = VALUES(isSale),
      isHot = VALUES(isHot),
      image = VALUES(image),
      description = VALUES(description),
      specifications = VALUES(specifications),
      features = VALUES(features)
  `;

  for (const p of allProducts) {
    await connection.execute(query, [
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
      JSON.stringify(p.features)
    ]);
  }

  // Update counts in categories table
  const [counts] = await connection.query(`
    SELECT category_id, COUNT(*) as cnt FROM products GROUP BY category_id
  `);

  for (const row of counts) {
    await connection.execute(`UPDATE categories SET count = ? WHERE id = ?`, [row.cnt, row.category_id]);
  }

  console.log('Category product counts after update:');
  const [finalCategories] = await connection.query(`SELECT id, name, count FROM categories ORDER BY id ASC`);
  console.table(finalCategories);

  const [totalRow] = await connection.query(`SELECT COUNT(*) as total FROM products`);
  console.log(`🎉 Total products in MySQL database: ${totalRow[0].total}`);

  await connection.end();

  // Export full SQL to server/database.sql and sync data/products.ts
  console.log('Now triggering sync to data/products.ts...');
  require('child_process').execSync('node scripts/sync-products-to-data.js', { stdio: 'inherit' });
}

run().catch(err => {
  console.error('Error during catalog expansion:', err);
  process.exit(1);
});
