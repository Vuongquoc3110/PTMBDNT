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
    "count": 22,
    "icon": "🔌",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "cpu",
    "name": "CPU",
    "count": 21,
    "icon": "⚙️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "gaming-pc",
    "name": "PC Gaming",
    "count": 21,
    "icon": "🖥️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "gpu",
    "name": "GPU",
    "count": 21,
    "icon": "🎮",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "headset",
    "name": "Tai Nghe",
    "count": 21,
    "icon": "🎧",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "keyboard",
    "name": "Bàn Phím",
    "count": 21,
    "icon": "⌨️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "laptop",
    "name": "Laptop",
    "count": 97,
    "icon": "💻",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "monitor",
    "name": "Màn Hình",
    "count": 20,
    "icon": "🖥️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "mouse",
    "name": "Chuột",
    "count": 20,
    "icon": "🖱️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "office-pc",
    "name": "PC Văn Phòng",
    "count": 21,
    "icon": "🧑‍💻",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "ram",
    "name": "RAM",
    "count": 20,
    "icon": "🧠",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "ssd",
    "name": "SSD",
    "count": 21,
    "icon": "💾",
    "createdAt": "2026-09-22T14:02:40.000Z"
  }
];

export const products: Product[] = [
  {
    "id": "l360-dell-001",
    "name": "[Like New] Dell G3 3500 (Core i5-10300H, 8GB, 512GB, GTX 1650 4GB, 15.6 FHD 120Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12500000,
    "oldPrice": 13750000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-26-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-26-247x247.jpg"
    ],
    "description": "Sản phẩm [Like New] Dell G3 3500 (Core i5-10300H, 8GB, 512GB, GTX 1650 4GB, 15.6 FHD 120Hz) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Like New 99% Zin nguyên bản",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Gaming Series chiến game mượt mà",
      "Card đồ họa": "NVIDIA GTX 1650 4GB"
    }
  },
  {
    "id": "l360-dell-002",
    "name": "[Mới 100% ] Dell Inspiron 14 Plus 7430 (Core i5-13420H, 16GB, 1TB, 14.0\"\" 2.5K 90HZ)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18690000,
    "oldPrice": 20190000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Dell Inspiron 14 Plus 7430 (Core i5-13420H, 16GB, 1TB, 14.0\"\" 2.5K 90HZ) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-003",
    "name": "[Mới 100% ] Dell Inspiron 14 Plus 7430 (Core i5-13500H, 16GB, 512GB, 14.0\"\" 2.5K 90HZ)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17000000,
    "oldPrice": 18360000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Dell Inspiron 14 Plus 7430 (Core i5-13500H, 16GB, 512GB, 14.0\"\" 2.5K 90HZ) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-004",
    "name": "[Mới 100% ] Dell Inspiron 7430 N7430I58W1 (Core i5-1335U | 8GB | 512GB | Intel Iris Xe | 14 inch FHD +)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18490000,
    "oldPrice": 20340000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Dell Inspiron 7430 N7430I58W1 (Core i5-1335U | 8GB | 512GB | Intel Iris Xe | 14 inch FHD +) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ IPS chống chói",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-005",
    "name": "[Mới 100% ] Laptop Dell Inspiron 14 Plus 7430 (Core i7-13620H, Ram 16GB, SSD 1TB, 14inch 2.5K, Win 11)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 20490000,
    "oldPrice": 22130000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Laptop Dell Inspiron 14 Plus 7430 (Core i7-13620H, Ram 16GB, SSD 1TB, 14inch 2.5K, Win 11) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-006",
    "name": "[Mới 100% ] Laptop Dell Latitude 5530 Core i5 1235U/ Ram 16GB/ SSD 256GB",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12490000,
    "oldPrice": 13490000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-43-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-43-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Laptop Dell Latitude 5530 Core i5 1235U/ Ram 16GB/ SSD 256GB được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ IPS chống chói",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-007",
    "name": "[Mới 100%] - Dell Inspiron 5415",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12000000,
    "oldPrice": 13200000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-10-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-10-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Dell Inspiron 5415 được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-008",
    "name": "[Mới 100%] - Dell Inspiron 5425 (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12300000,
    "oldPrice": 13280000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-29-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-29-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Dell Inspiron 5425 (2022) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ IPS chống chói",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-009",
    "name": "[Mới 100%] - Dell Inspiron 5515",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13490000,
    "oldPrice": 14570000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-2-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-2-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Dell Inspiron 5515 được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "l360-dell-010",
    "name": "[Mới 100%] Dell Alienware M15 R7 2022",
    "category": "laptop",
    "category_id": "laptop",
    "price": 36500000,
    "oldPrice": 40150000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/12/Thiet-ke-chua-co-ten-8-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/12/Thiet-ke-chua-co-ten-8-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100%] Dell Alienware M15 R7 2022 được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Alienware Gaming cao cấp nhất",
      "Card đồ họa": "NVIDIA GeForce RTX 3070Ti 8GB GDDR6",
      "CPU": "AMD Ryzen 7 6800H / Intel Core i7 Gen 12th"
    }
  },
  {
    "id": "l360-dell-011",
    "name": "[Mới 100%] Dell Gaming G15 5530 2023 (Core i5-13450HX, 8GB, 256GB, NVIDIA RTX 3050 6GB, 15\" FHD 120Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18990000,
    "oldPrice": 20510000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/04/Thiet-ke-chua-co-ten-4-1-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/04/Thiet-ke-chua-co-ten-4-1-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100%] Dell Gaming G15 5530 2023 (Core i5-13450HX, 8GB, 256GB, NVIDIA RTX 3050 6GB, 15\" FHD 120Hz) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Gaming Series chiến game mượt mà",
      "Card đồ họa": "NVIDIA GeForce RTX 3050 6GB"
    }
  },
  {
    "id": "l360-dell-012",
    "name": "[Mới 100%] Dell Inspiron 14 5430 (i5-1340P ,Ram 16G,SSD 512G, 14 inch FHD+)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15990000,
    "oldPrice": 17270000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 12,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-46-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-46-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100%] Dell Inspiron 14 5430 (i5-1340P ,Ram 16G,SSD 512G, 14 inch FHD+) được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.",
    "features": [
      "Cam kết zin nguyên bản 100% từ nhà sản xuất",
      "Bảo hành toàn diện 12 tháng tại Laptop360",
      "Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời",
      "Hỗ trợ trả góp lãi suất 0%"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ IPS chống chói",
      "Tặng kèm": "Balo chống sốc Laptop360 + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron / Latitude Văn phòng - Học tập",
      "Card đồ họa": "Intel Iris Xe Graphics / AMD Radeon Graphics"
    }
  },
  {
    "id": "ssd-022",
    "name": "SSD Seagate FireCuda 530 1TB PCIe Gen4 NVMe (Đọc 7.300 MB/s Bền Bỉ)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2890000,
    "oldPrice": 3290000,
    "discount": 12,
    "rating": 4.9,
    "reviewCount": 56,
    "stock": 14,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "SSD gaming chuyên nghiệp Seagate FireCuda 530 đạt tốc độ đọc 7300 MB/s, độ bền TBW cao nhất ngành, tương thích hoàn hảo PS5 và bo mạch chủ cao cấp.",
    "features": [
      "Tốc độ đọc 7,300 MB/s",
      "Độ bền TBW cao gấp 2 lần tiêu chuẩn",
      "Tương thích hoàn hảo PS5"
    ],
    "specifications": {
      "Tốc độ đọc": "7,300 MB/s",
      "Chuẩn giao tiếp": "PCIe Gen 4.0 x4",
      "Độ bền": "1275 TBW siêu bền",
      "Bảo hành": "5 năm kèm gói cứu hộ dữ liệu Rescue Data Recovery"
    }
  },
  {
    "id": "ssd-023",
    "name": "SSD TeamGroup MP44L 1TB M.2 PCIe 4.0 NVMe (Đọc 5.000 MB/s Mỏng Gọn)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1750000,
    "oldPrice": 1990000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 42,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "SSD PCIe 4.0 mỏng nhẹ trang bị lá tản nhiệt graphene độc quyền dán sẵn, tối ưu hóa cho laptop mỏng và PC mini.",
    "features": [
      "Tốc độ đọc 5,000 MB/s",
      "Tản nhiệt Graphene độc quyền",
      "Bảo hành 5 năm"
    ],
    "specifications": {
      "Tốc độ đọc": "5,000 MB/s",
      "Tản nhiệt": "Nhãn tản nhiệt Graphene dẫn nhiệt độc quyền",
      "Chuẩn": "M.2 2280 NVMe 1.4"
    }
  },
  {
    "id": "acc-010",
    "name": "Giá Treo Màn Hình Đôi Human Motion T9 Pro Dual RGB 17-35 inch Piston Gas",
    "category": "accessories",
    "category_id": "accessories",
    "price": 1890000,
    "oldPrice": 2080000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Giá Treo Màn Hình Đôi Human Motion T9 Pro Dual RGB 17-35 inch Piston Gas. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Tải trọng": "Mỗi tay nâng chịu lực 15kg",
      "Kích cỡ màn": "Từ 17 inch đến 35 inch",
      "Trợ lực": "Piston khí nén Gas Spring cao cấp",
      "LED": "Đèn RGB viền chân đế"
    }
  },
  {
    "id": "acc-011",
    "name": "Giá Treo Màn Hình North Bayou NB-F80 (17-30 inch Xoay 360 Độ)",
    "category": "accessories",
    "category_id": "accessories",
    "price": 349000,
    "oldPrice": 390000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Giá Treo Màn Hình North Bayou NB-F80 (17-30 inch Xoay 360 Độ). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước màn": "17 - 30 inch",
      "Tải trọng": "2kg - 9kg",
      "Chuẩn VESA": "75x75mm và 100x100mm",
      "Đánh giá": "Tay nâng màn hình quốc dân bán chạy số 1"
    }
  },
  {
    "id": "acc-012",
    "name": "Bàn Di Chuột Cỡ Lớn SteelSeries QcK Prism Cloth 3XL RGB (1220 x 590mm)",
    "category": "accessories",
    "category_id": "accessories",
    "price": 2190000,
    "oldPrice": 2370000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Bàn Di Chuột Cỡ Lớn SteelSeries QcK Prism Cloth 3XL RGB (1220 x 590mm). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "Khổng lồ 3XL (1220 x 590 x 4 mm) phủ kín cả bàn",
      "Đèn LED": "RGB 2 vùng đồng bộ âm thanh Discord và game"
    }
  },
  {
    "id": "acc-013",
    "name": "Bàn Di Chuột Artisan Hien FX Soft L Red (Made in Japan Chuyên Esport)",
    "category": "accessories",
    "category_id": "accessories",
    "price": 1490000,
    "oldPrice": 1640000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Bàn Di Chuột Artisan Hien FX Soft L Red (Made in Japan Chuyên Esport). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Xuất xứ": "Sản xuất thủ công tại Nhật Bản",
      "Chất liệu": "Bề mặt Amundsen dệt sợi đặc biệt cân bằng kiểm soát và tốc độ"
    }
  },
  {
    "id": "acc-014",
    "name": "Đèn Treo Màn Hình Chống Mỏi Mắt BenQ ScreenBar Halo Điều Khiển Không Dây",
    "category": "accessories",
    "category_id": "accessories",
    "price": 4290000,
    "oldPrice": 4630000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Đèn Treo Màn Hình Chống Mỏi Mắt BenQ ScreenBar Halo Điều Khiển Không Dây. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế quang học": "Bất đối xứng chiếu sáng mặt bàn, tuyệt đối không lóa màn hình",
      "Remote": "Núm xoay cảm ứng không dây điều chỉnh độ sáng và nhiệt độ màu"
    }
  },
  {
    "id": "acc-015",
    "name": "Bàn Phím Điều Khiển Stream Deck Elgato MK.2 15 Phím Màn Hình LCD Đổi Màu",
    "category": "accessories",
    "category_id": "accessories",
    "price": 3790000,
    "oldPrice": 4240000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Bàn Phím Điều Khiển Stream Deck Elgato MK.2 15 Phím Màn Hình LCD Đổi Màu. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số phím": "15 phím có màn hình LCD tùy biến icon theo ý muốn",
      "Công dụng": "Một chạm chuyển cảnh OBS, mở ứng dụng, tắt mic, kích hoạt macro"
    }
  },
  {
    "id": "acc-016",
    "name": "Webcam Chuyên Nghiệp Elgato Facecam Full HD 1080p 60fps Cảm Biến Sony",
    "category": "accessories",
    "category_id": "accessories",
    "price": 3690000,
    "oldPrice": 4060000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Webcam Chuyên Nghiệp Elgato Facecam Full HD 1080p 60fps Cảm Biến Sony. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Cảm biến": "Sony STARVIS CMOS đỉnh cao hình ảnh trong nhà",
      "Ống kính": "Kính quang học Elgato Prime Lens f/2.4 tiêu cự cố định"
    }
  },
  {
    "id": "acc-017",
    "name": "Micro Thu Âm USB Rode NT-USB Mini (Chống Rung Kèm Chân Đế Từ Tính)",
    "category": "accessories",
    "category_id": "accessories",
    "price": 2490000,
    "oldPrice": 2790000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Micro Thu Âm USB Rode NT-USB Mini (Chống Rung Kèm Chân Đế Từ Tính). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Củ mic": "Condenser định hướng Cardioid bắt giọng ấm áp",
      "Tích hợp": "Màng lọc gió pop-filter bên trong củ mic"
    }
  },
  {
    "id": "acc-018",
    "name": "Giá Đỡ Tai Nghe Kèm Hub USB Corsair ST100 RGB Âm Thanh 7.1",
    "category": "accessories",
    "category_id": "accessories",
    "price": 1490000,
    "oldPrice": 1610000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Giá Đỡ Tai Nghe Kèm Hub USB Corsair ST100 RGB Âm Thanh 7.1. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chất liệu": "Khung nhôm nguyên khối vững chắc",
      "Cổng": "2 cổng USB 3.1 và cổng 3.5mm giả lập âm thanh vòm 7.1"
    }
  },
  {
    "id": "acc-019",
    "name": "Túi Chống Sốc Laptop Tomtoc 360 Protective CornerArmor 14-16 inch",
    "category": "accessories",
    "category_id": "accessories",
    "price": 690000,
    "oldPrice": 760000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Túi Chống Sốc Laptop Tomtoc 360 Protective CornerArmor 14-16 inch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Công nghệ": "CornerArmor chống sốc đạt tiêu chuẩn thả rơi quân sự Mỹ",
      "Khóa kéo": "Khóa YKK Nhật Bản mượt mà bền bỉ"
    }
  },
  {
    "id": "acc-020",
    "name": "Balo Laptop Gaming Predator SUV Backpack Chống Nước Ngăn Chứa 17.3 inch",
    "category": "accessories",
    "category_id": "accessories",
    "price": 1990000,
    "oldPrice": 2150000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Balo Laptop Gaming Predator SUV Backpack Chống Nước Ngăn Chứa 17.3 inch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Sức chứa": "Laptop 17.3 inch, bàn phím cơ, tai nghe, chuột và phụ kiện",
      "Chất liệu": "Vải Polyester chống thấm nước cực tốt"
    }
  },
  {
    "id": "acc-021",
    "name": "Hub Chuyển Đổi Type-C 9 in 1 Ugreen Đa Năng 4K 60Hz PD 100W RJ45",
    "category": "accessories",
    "category_id": "accessories",
    "price": 890000,
    "oldPrice": 1000000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Hub Chuyển Đổi Type-C 9 in 1 Ugreen Đa Năng 4K 60Hz PD 100W RJ45. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Cổng kết nối": "1x HDMI 4K 60Hz, 1x USB-C PD 100W, 3x USB 3.0, 1x RJ45 Gigabit, SD/TF"
    }
  },
  {
    "id": "acc-022",
    "name": "Bộ Vệ Sinh Bàn Phím & Màn Hình Laptop Đa Năng 8 Trong 1",
    "category": "accessories",
    "category_id": "accessories",
    "price": 99000,
    "oldPrice": 110000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Phụ kiện công nghệ cao cấp hỗ trợ góc làm việc chuyên nghiệp - Bộ Vệ Sinh Bàn Phím & Màn Hình Laptop Đa Năng 8 Trong 1. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Bao gồm": "Chổi quét bụi, dụng cụ nhổ keycap, bút lau tai nghe, bình xịt cồn và khăn lau nhung"
    }
  },
  {
    "id": "cpu-006",
    "name": "Intel Core i5-14400F (Up to 4.7GHz, 10C/16T, LGA1700)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 4990000,
    "oldPrice": 5490000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i5-14400F (Up to 4.7GHz, 10C/16T, LGA1700). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "10 nhân (6P + 4E)",
      "Số luồng": "16 luồng",
      "Xung nhịp": "Lên tới 4.7 GHz",
      "Socket": "LGA 1700",
      "TDP": "65W"
    }
  },
  {
    "id": "cpu-007",
    "name": "Intel Core i7-14700K (Up to 5.6GHz, 20C/28T, 33MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 10490000,
    "oldPrice": 11750000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i7-14700K (Up to 5.6GHz, 20C/28T, 33MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "20 nhân (8P + 12E)",
      "Số luồng": "28 luồng",
      "Xung nhịp": "Lên tới 5.6 GHz",
      "Socket": "LGA 1700",
      "TDP": "125W - 253W"
    }
  },
  {
    "id": "cpu-008",
    "name": "Intel Core i9-14900KS Special Edition (Up to 6.2GHz, 24C/32T)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 17990000,
    "oldPrice": 19430000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i9-14900KS Special Edition (Up to 6.2GHz, 24C/32T). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "24 nhân (8P + 16E)",
      "Số luồng": "32 luồng",
      "Xung nhịp Max": "6.2 GHz cực đại",
      "Socket": "LGA 1700",
      "TDP": "150W - 320W"
    }
  },
  {
    "id": "cpu-009",
    "name": "Intel Core i3-12100F (Up to 4.3GHz, 4C/8T, 12MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 1990000,
    "oldPrice": 2190000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i3-12100F (Up to 4.3GHz, 4C/8T, 12MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "4 nhân hiệu năng cao",
      "Số luồng": "8 luồng",
      "Xung nhịp": "Lên tới 4.3 GHz",
      "Socket": "LGA 1700",
      "TDP": "58W"
    }
  },
  {
    "id": "cpu-010",
    "name": "Intel Core i5-12400F (Up to 4.4GHz, 6C/12T, 18MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 2890000,
    "oldPrice": 3120000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i5-12400F (Up to 4.4GHz, 6C/12T, 18MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "6 nhân",
      "Số luồng": "12 luồng",
      "Xung nhịp": "Lên tới 4.4 GHz",
      "Socket": "LGA 1700",
      "TDP": "65W"
    }
  },
  {
    "id": "cpu-011",
    "name": "Intel Core i5-13600K (Up to 5.1GHz, 14C/20T, 24MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 7490000,
    "oldPrice": 8390000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i5-13600K (Up to 5.1GHz, 14C/20T, 24MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "14 nhân (6P + 8E)",
      "Số luồng": "20 luồng",
      "Xung nhịp": "Lên tới 5.1 GHz",
      "Socket": "LGA 1700",
      "TDP": "125W"
    }
  },
  {
    "id": "cpu-012",
    "name": "Intel Core i7-13700F (Up to 5.2GHz, 16C/24T, 30MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 8790000,
    "oldPrice": 9670000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i7-13700F (Up to 5.2GHz, 16C/24T, 30MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "16 nhân (8P + 8E)",
      "Số luồng": "24 luồng",
      "Xung nhịp": "Lên tới 5.2 GHz",
      "Socket": "LGA 1700",
      "TDP": "65W"
    }
  },
  {
    "id": "cpu-013",
    "name": "AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8C/16T, 104MB 3D V-Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 10690000,
    "oldPrice": 11970000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8C/16T, 104MB 3D V-Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "8 Cores",
      "Số luồng": "16 Threads",
      "Cache": "104MB 3D V-Cache độc quyền",
      "Socket": "AM5",
      "Kiến trúc": "Zen 4"
    }
  },
  {
    "id": "cpu-014",
    "name": "AMD Ryzen 5 7600X (Up to 5.3GHz, 6C/12T, 38MB Cache, AM5)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 5490000,
    "oldPrice": 5930000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 5 7600X (Up to 5.3GHz, 6C/12T, 38MB Cache, AM5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "6 Cores",
      "Số luồng": "12 Threads",
      "Xung nhịp": "4.7 GHz - 5.3 GHz",
      "Socket": "AM5",
      "TDP": "105W"
    }
  },
  {
    "id": "cpu-015",
    "name": "AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16C/32T, 144MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 16990000,
    "oldPrice": 18690000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16C/32T, 144MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "16 Cores",
      "Số luồng": "32 Threads",
      "Cache": "144MB 3D V-Cache",
      "Socket": "AM5",
      "TDP": "120W"
    }
  },
  {
    "id": "cpu-016",
    "name": "AMD Ryzen 9 7900X (Up to 5.6GHz, 12C/24T, 76MB Cache, AM5)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 10990000,
    "oldPrice": 11870000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 9 7900X (Up to 5.6GHz, 12C/24T, 76MB Cache, AM5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "12 Cores",
      "Số luồng": "24 Threads",
      "Xung nhịp": "4.7 GHz - 5.6 GHz",
      "Socket": "AM5",
      "TDP": "170W"
    }
  },
  {
    "id": "cpu-017",
    "name": "AMD Ryzen 7 7700 (Up to 5.3GHz, 8C/16T, Kèm tản Wraith Prism RGB)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 7990000,
    "oldPrice": 8950000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 7 7700 (Up to 5.3GHz, 8C/16T, Kèm tản Wraith Prism RGB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "8 Cores",
      "Số luồng": "16 Threads",
      "Xung nhịp": "3.8 GHz - 5.3 GHz",
      "Socket": "AM5",
      "TDP": "65W"
    }
  },
  {
    "id": "cpu-018",
    "name": "AMD Ryzen 5 5600 (Up to 4.4GHz, 6C/12T, Socket AM4)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 2990000,
    "oldPrice": 3290000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 5 5600 (Up to 4.4GHz, 6C/12T, Socket AM4). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "6 Cores",
      "Số luồng": "12 Threads",
      "Xung nhịp": "Lên tới 4.4 GHz",
      "Socket": "AM4",
      "TDP": "65W"
    }
  },
  {
    "id": "cpu-019",
    "name": "AMD Ryzen 7 5700X3D (Up to 4.1GHz, 8C/16T, 100MB 3D V-Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 5890000,
    "oldPrice": 6600000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 7 5700X3D (Up to 4.1GHz, 8C/16T, 100MB 3D V-Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "8 Cores",
      "Số luồng": "16 Threads",
      "Cache": "100MB 3D V-Cache",
      "Socket": "AM4",
      "TDP": "105W"
    }
  },
  {
    "id": "cpu-020",
    "name": "Intel Core i9-13900KS (Up to 6.0GHz, 24C/32T, 36MB Cache)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 15490000,
    "oldPrice": 16730000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - Intel Core i9-13900KS (Up to 6.0GHz, 24C/32T, 36MB Cache). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "24 nhân",
      "Số luồng": "32 luồng",
      "Xung nhịp Max": "6.0 GHz Out of Box",
      "Socket": "LGA 1700",
      "TDP": "150W"
    }
  },
  {
    "id": "cpu-021",
    "name": "AMD Ryzen 5 8600G (Tích hợp AI NPU & Radeon 760M Graphics)",
    "category": "cpu",
    "category_id": "cpu",
    "price": 5290000,
    "oldPrice": 5820000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ vi xử lý CPU hiệu năng cao hàng chính hãng - AMD Ryzen 5 8600G (Tích hợp AI NPU & Radeon 760M Graphics). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Số nhân": "6 Cores / 12 Threads",
      "Đồ họa": "AMD Radeon 760M",
      "AI Engine": "Ryzen AI NPU 16 TOPS",
      "Socket": "AM5",
      "TDP": "65W"
    }
  },
  {
    "id": "gpu-006",
    "name": "ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC Edition",
    "category": "gpu",
    "category_id": "gpu",
    "price": 54990000,
    "oldPrice": 60490000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC Edition. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4090",
      "VRAM": "24GB GDDR6X",
      "Bus": "384-bit",
      "Cổng kết nối": "2x HDMI 2.1a, 3x DisplayPort 1.4a",
      "Nguồn đề xuất": "1000W"
    }
  },
  {
    "id": "gpu-007",
    "name": "MSI GeForce RTX 4080 Super 16GB GAMING X TRIO",
    "category": "gpu",
    "category_id": "gpu",
    "price": 29990000,
    "oldPrice": 33590000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - MSI GeForce RTX 4080 Super 16GB GAMING X TRIO. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4080 Super",
      "VRAM": "16GB GDDR6X",
      "Bus": "256-bit",
      "Tản nhiệt": "Tri Frozr 3 Fan Torx 5.0",
      "Nguồn đề xuất": "750W"
    }
  },
  {
    "id": "gpu-008",
    "name": "Gigabyte GeForce RTX 4070 Ti Super AERO OC 16GB White",
    "category": "gpu",
    "category_id": "gpu",
    "price": 24990000,
    "oldPrice": 26990000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Gigabyte GeForce RTX 4070 Ti Super AERO OC 16GB White. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4070 Ti Super",
      "VRAM": "16GB GDDR6X",
      "Bus": "256-bit",
      "Màu sắc": "Trắng tinh khôi Full White",
      "Nguồn đề xuất": "750W"
    }
  },
  {
    "id": "gpu-009",
    "name": "ASUS Dual GeForce RTX 4070 Super EVO OC 12GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 16990000,
    "oldPrice": 18690000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - ASUS Dual GeForce RTX 4070 Super EVO OC 12GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4070 Super",
      "VRAM": "12GB GDDR6X",
      "Bus": "192-bit",
      "Tản nhiệt": "Dual Axial-tech Fan",
      "Nguồn đề xuất": "650W"
    }
  },
  {
    "id": "gpu-010",
    "name": "MSI GeForce RTX 4060 Ti VENTUS 2X BLACK 16GB OC",
    "category": "gpu",
    "category_id": "gpu",
    "price": 12490000,
    "oldPrice": 13490000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - MSI GeForce RTX 4060 Ti VENTUS 2X BLACK 16GB OC. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4060 Ti",
      "VRAM": "16GB GDDR6 (Bộ nhớ lớn render AI)",
      "Bus": "128-bit",
      "Cổng kết nối": "1x HDMI 2.1a, 3x DP 1.4a",
      "Nguồn đề xuất": "550W"
    }
  },
  {
    "id": "gpu-011",
    "name": "Gigabyte GeForce RTX 4060 EAGLE OC 8GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 8490000,
    "oldPrice": 9510000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Gigabyte GeForce RTX 4060 EAGLE OC 8GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4060",
      "VRAM": "8GB GDDR6",
      "Bus": "128-bit",
      "Tản nhiệt": "Windforce 3 Fan 80mm",
      "Nguồn đề xuất": "450W"
    }
  },
  {
    "id": "gpu-012",
    "name": "Colorful GeForce RTX 3060 NB DUO 12GB GDDR6",
    "category": "gpu",
    "category_id": "gpu",
    "price": 6890000,
    "oldPrice": 7580000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Colorful GeForce RTX 3060 NB DUO 12GB GDDR6. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 3060",
      "VRAM": "12GB GDDR6",
      "Bus": "192-bit",
      "Cuda Cores": "3584",
      "Nguồn đề xuất": "550W"
    }
  },
  {
    "id": "gpu-013",
    "name": "ASUS Dual Radeon RX 7600 V2 OC Edition 8GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 6990000,
    "oldPrice": 7830000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - ASUS Dual Radeon RX 7600 V2 OC Edition 8GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "AMD Radeon RX 7600",
      "VRAM": "8GB GDDR6",
      "Kiến trúc": "RDNA 3",
      "Cổng kết nối": "1x HDMI 2.1, 3x DP 1.4",
      "Nguồn đề xuất": "550W"
    }
  },
  {
    "id": "gpu-014",
    "name": "Sapphire PULSE Radeon RX 7700 XT 12GB GDDR6",
    "category": "gpu",
    "category_id": "gpu",
    "price": 12990000,
    "oldPrice": 14030000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Sapphire PULSE Radeon RX 7700 XT 12GB GDDR6. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "AMD Radeon RX 7700 XT",
      "VRAM": "12GB GDDR6",
      "Bus": "192-bit",
      "Công nghệ": "FSR 3 / AFMF / AV1 Encode",
      "Nguồn đề xuất": "700W"
    }
  },
  {
    "id": "gpu-015",
    "name": "PowerColor Hellhound Radeon RX 7800 XT 16GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 14990000,
    "oldPrice": 16490000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - PowerColor Hellhound Radeon RX 7800 XT 16GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "AMD Radeon RX 7800 XT",
      "VRAM": "16GB GDDR6",
      "Bus": "256-bit",
      "LED": "Đèn LED Ice Blue / Amethyst Purple",
      "Nguồn đề xuất": "750W"
    }
  },
  {
    "id": "gpu-016",
    "name": "Sapphire NITRO+ Radeon RX 7900 XTX Vapor-X 24GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 28990000,
    "oldPrice": 31310000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Sapphire NITRO+ Radeon RX 7900 XTX Vapor-X 24GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "AMD Radeon RX 7900 XTX",
      "VRAM": "24GB GDDR6",
      "Bus": "384-bit",
      "Tản nhiệt": "Buồng hơi Vapor-X Chamber",
      "Nguồn đề xuất": "800W"
    }
  },
  {
    "id": "gpu-017",
    "name": "Intel Arc A770 Phantom Gaming 16GB OC",
    "category": "gpu",
    "category_id": "gpu",
    "price": 8990000,
    "oldPrice": 10070000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - Intel Arc A770 Phantom Gaming 16GB OC. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "Intel Arc A770",
      "VRAM": "16GB GDDR6 256-bit",
      "Công nghệ": "Intel XeSS / Ray Tracing / AV1 Hardware",
      "Nguồn đề xuất": "650W"
    }
  },
  {
    "id": "gpu-018",
    "name": "ASRock Intel Arc A580 Challenger OC 8GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 4790000,
    "oldPrice": 5270000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - ASRock Intel Arc A580 Challenger OC 8GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "Intel Arc A580",
      "VRAM": "8GB GDDR6",
      "Xung nhịp": "2000 MHz",
      "Cổng": "1x HDMI 2.1, 3x DP 2.0",
      "Nguồn đề xuất": "500W"
    }
  },
  {
    "id": "gpu-019",
    "name": "ZOTAC GAMING GeForce RTX 4070 SUPER Twin Edge 12GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 16490000,
    "oldPrice": 18470000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - ZOTAC GAMING GeForce RTX 4070 SUPER Twin Edge 12GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4070 Super",
      "VRAM": "12GB GDDR6X",
      "Kích thước": "Siêu nhỏ gọn 2 slot chuẩn ITX",
      "Nguồn đề xuất": "650W"
    }
  },
  {
    "id": "gpu-020",
    "name": "GALAX GeForce RTX 4060 1-Click OC 2X 8GB",
    "category": "gpu",
    "category_id": "gpu",
    "price": 7890000,
    "oldPrice": 8520000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - GALAX GeForce RTX 4060 1-Click OC 2X 8GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 4060",
      "VRAM": "8GB GDDR6",
      "Tính năng": "1-Click OC qua App điện thoại",
      "Nguồn đề xuất": "450W"
    }
  },
  {
    "id": "gpu-021",
    "name": "MSI GeForce RTX 3050 VENTUS 2X 6GB OC",
    "category": "gpu",
    "category_id": "gpu",
    "price": 4690000,
    "oldPrice": 5160000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Card màn hình đồ họa GPU đỉnh cao chuyên game và đồ họa - MSI GeForce RTX 3050 VENTUS 2X 6GB OC. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nhân đồ họa": "RTX 3050 6GB",
      "VRAM": "6GB GDDR6",
      "TDP": "70W (Không cần nguồn phụ)",
      "Nguồn đề xuất": "350W"
    }
  },
  {
    "id": "hs-004",
    "name": "Tai nghe HyperX Cloud III Wireless (Âm thanh vòm DTS:X, Pin 120H)",
    "category": "headset",
    "category_id": "headset",
    "price": 3490000,
    "oldPrice": 3840000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe HyperX Cloud III Wireless (Âm thanh vòm DTS:X, Pin 120H). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thời lượng pin": "120 giờ chỉ với 1 lần sạc",
      "Màng loa": "53mm tinh chỉnh góc cạnh",
      "Micro": "10mm lọc tạp âm trong trẻo",
      "Kết nối": "Không dây 2.4GHz không độ trễ"
    }
  },
  {
    "id": "hs-005",
    "name": "Tai nghe Logitech G Pro X 2 Lightspeed Wireless Graphene Driver",
    "category": "headset",
    "category_id": "headset",
    "price": 5490000,
    "oldPrice": 6150000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Logitech G Pro X 2 Lightspeed Wireless Graphene Driver. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Màng loa": "50mm màng Graphene siêu nhẹ độ nhạy cao",
      "Kết nối": "3 chế độ: Lightspeed, Bluetooth, Jack 3.5mm",
      "Công nghệ Mic": "Blue VO!CE khử nhiễu AI"
    }
  },
  {
    "id": "hs-006",
    "name": "Tai nghe SteelSeries Arctis Nova Pro Wireless Chống Ồn Chủ Động ANC",
    "category": "headset",
    "category_id": "headset",
    "price": 8490000,
    "oldPrice": 9170000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe SteelSeries Arctis Nova Pro Wireless Chống Ồn Chủ Động ANC. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chống ồn": "Active Noise Cancellation 4 micro",
      "Trạm điều khiển": "Base Station màn hình OLED kép thay pin nóng Infinity Power System"
    }
  },
  {
    "id": "hs-007",
    "name": "Tai nghe Razer BlackShark V2 Pro 2023 Wireless (Mic HyperClear Super Wideband)",
    "category": "headset",
    "category_id": "headset",
    "price": 4490000,
    "oldPrice": 4940000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Razer BlackShark V2 Pro 2023 Wireless (Mic HyperClear Super Wideband). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Driver": "Razer TriForce Titanium 50mm",
      "Microphone": "Super Wideband thu âm chuẩn phòng thu",
      "Thời lượng pin": "Lên tới 70 giờ"
    }
  },
  {
    "id": "hs-008",
    "name": "Tai nghe Corsair Virtuoso RGB Wireless XT Siêu Cấp",
    "category": "headset",
    "category_id": "headset",
    "price": 5990000,
    "oldPrice": 6470000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Corsair Virtuoso RGB Wireless XT Siêu Cấp. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chất âm": "Hi-Res Audio 24bit/96kHz",
      "Vật liệu": "Nhôm phay gia công CNC sang trọng",
      "Kết nối kép": "Nghe đồng thời âm thanh PC và điện thoại"
    }
  },
  {
    "id": "hs-009",
    "name": "Tai nghe kiểm âm Audio-Technica ATH-M50xBT2 Wireless",
    "category": "headset",
    "category_id": "headset",
    "price": 4890000,
    "oldPrice": 5480000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe kiểm âm Audio-Technica ATH-M50xBT2 Wireless. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Driver": "45mm khẩu độ lớn chuẩn phòng thu chuyên nghiệp",
      "DAC": "Tích hợp chip DAC AK4331 cao cấp",
      "Âm thanh": "Tái tạo dải âm thanh chân thực chính xác tuyệt đối"
    }
  },
  {
    "id": "hs-010",
    "name": "Tai nghe Sennheiser EPOS H6PRO Closed Acoustic Gaming",
    "category": "headset",
    "category_id": "headset",
    "price": 3990000,
    "oldPrice": 4390000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Sennheiser EPOS H6PRO Closed Acoustic Gaming. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Closed-back cách âm thụ động hoàn hảo",
      "Micro": "Gạt lên là tắt tiếng nam châm tháo rời"
    }
  },
  {
    "id": "hs-011",
    "name": "Tai nghe Sony INZONE H9 Wireless Noise Canceling Gaming",
    "category": "headset",
    "category_id": "headset",
    "price": 5990000,
    "oldPrice": 6710000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Sony INZONE H9 Wireless Noise Canceling Gaming. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Công nghệ": "Spatial Sound 360 độ định vị hướng chân kẻ địch",
      "Chống ồn": "Thừa hưởng thuật toán chống ồn từ Sony WH-1000XM5"
    }
  },
  {
    "id": "hs-012",
    "name": "Tai nghe ASUS ROG Delta S Animate (Màn Hình LED AniMe Matrix)",
    "category": "headset",
    "category_id": "headset",
    "price": 5190000,
    "oldPrice": 5610000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe ASUS ROG Delta S Animate (Màn Hình LED AniMe Matrix). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Đèn LED": "Màn hình LED AniMe Matrix hiển thị hiệu ứng độc đáo",
      "DAC": "Hi-Fi ESS 9281 Quad-DAC",
      "Trọng lượng": "Chỉ 310g siêu êm ái"
    }
  },
  {
    "id": "hs-013",
    "name": "Tai nghe Beyerdynamic DT 770 Pro 80 Ohm Studio Headphone",
    "category": "headset",
    "category_id": "headset",
    "price": 3790000,
    "oldPrice": 4170000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Beyerdynamic DT 770 Pro 80 Ohm Studio Headphone. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Sản xuất": "Made in Germany nguyên bản",
      "Đệm tai": "Vải nhung Velour trứ danh êm ái thoáng khí",
      "Độ bền": "Huyền thoại phòng thu studio toàn cầu"
    }
  },
  {
    "id": "hs-014",
    "name": "Tai nghe HyperX Cloud II Red 7.1 Virtual Surround Sound",
    "category": "headset",
    "category_id": "headset",
    "price": 1690000,
    "oldPrice": 1830000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe HyperX Cloud II Red 7.1 Virtual Surround Sound. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Card âm thanh": "Kèm USB Audio Control Box 7.1",
      "Khung": "Khung nhôm siêu bền bỉ uốn cong không gãy"
    }
  },
  {
    "id": "hs-015",
    "name": "Tai nghe E-Dra EH410 Pro RGB 7.1 Jack USB",
    "category": "headset",
    "category_id": "headset",
    "price": 390000,
    "oldPrice": 440000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe E-Dra EH410 Pro RGB 7.1 Jack USB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Âm thanh": "Giả lập 7.1 qua cổng USB",
      "Đèn LED": "LED RGB tự đổi màu",
      "Giá trị": "Tai nghe gaming phổ thông học sinh sinh viên"
    }
  },
  {
    "id": "hs-016",
    "name": "Tai nghe DareU EH469 RGB 7.1 Driver 50mm",
    "category": "headset",
    "category_id": "headset",
    "price": 490000,
    "oldPrice": 540000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe DareU EH469 RGB 7.1 Driver 50mm. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Driver": "50mm nam châm neodymium",
      "Ốp tai": "Bọc da mềm cách âm tốt",
      "Cổng cắm": "USB mạ vàng chống nhiễu"
    }
  },
  {
    "id": "hs-017",
    "name": "Tai nghe Razer Kraken X Multi-Platform Ultralight 250g",
    "category": "headset",
    "category_id": "headset",
    "price": 990000,
    "oldPrice": 1110000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Razer Kraken X Multi-Platform Ultralight 250g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "Chỉ 250g siêu nhẹ không mỏi cổ",
      "Tương thích": "PC, Laptop, PS5, Xbox, Nintendo Switch qua jack 3.5mm"
    }
  },
  {
    "id": "hs-018",
    "name": "Tai nghe Logitech G435 Lightspeed Wireless & Bluetooth Siêu Nhẹ 165g",
    "category": "headset",
    "category_id": "headset",
    "price": 1390000,
    "oldPrice": 1500000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Logitech G435 Lightspeed Wireless & Bluetooth Siêu Nhẹ 165g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "165g nhẹ nhất thế giới tai nghe không dây",
      "Micro": "Mic dạng chùm tia kép tích hợp không cần cần mic vướng víu"
    }
  },
  {
    "id": "hs-019",
    "name": "Tai nghe Apple AirPods Max (Âm thanh Không gian & Chống Ồn Chủ Động)",
    "category": "headset",
    "category_id": "headset",
    "price": 12490000,
    "oldPrice": 13740000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Apple AirPods Max (Âm thanh Không gian & Chống Ồn Chủ Động). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chất liệu": "Vòm lưới thoáng khí và quai chụp thép không gỉ",
      "Chip âm thanh": "2 chip Apple H1 tính toán âm thanh thông minh"
    }
  },
  {
    "id": "hs-020",
    "name": "Tai nghe Sony WH-1000XM5 Wireless Noise Cancelling Headphone",
    "category": "headset",
    "category_id": "headset",
    "price": 7490000,
    "oldPrice": 8090000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe Sony WH-1000XM5 Wireless Noise Cancelling Headphone. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chống ồn": "Bộ xử lý V1 + QN1 dẫn đầu thị trường",
      "Thời lượng pin": "30 giờ nghe nhạc liên tục"
    }
  },
  {
    "id": "hs-021",
    "name": "Tai nghe In-ear Gaming Moondrop Chu II Type-C DSP Hi-Fi",
    "category": "headset",
    "category_id": "headset",
    "price": 590000,
    "oldPrice": 660000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Tai nghe chất lượng âm thanh sống động, micro đàm thoại rõ nét - Tai nghe In-ear Gaming Moondrop Chu II Type-C DSP Hi-Fi. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Dạng tai": "In-ear nhét tai nhỏ gọn đeo mát mẻ mùa hè",
      "Cáp": "Type-C tích hợp DAC giải mã âm thanh cao cấp"
    }
  },
  {
    "id": "kb-004",
    "name": "Bàn phím cơ không dây Akko 3098B Plus Multi-modes (CS Jelly Pink)",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 1790000,
    "oldPrice": 1970000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ không dây Akko 3098B Plus Multi-modes (CS Jelly Pink). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kết nối": "3 chế độ: Bluetooth 5.0, Wireless 2.4G, Type-C",
      "Switch": "Akko CS Jelly Pink êm ái",
      "Keycap": "PBT Double-shot ASA profile",
      "Pin": "3000mAh dùng nhiều tuần"
    }
  },
  {
    "id": "kb-005",
    "name": "Bàn phím cơ Keychron Q1 Pro Wireless QMK/VIA Nhôm Nguyên Khối",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 4490000,
    "oldPrice": 5030000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Keychron Q1 Pro Wireless QMK/VIA Nhôm Nguyên Khối. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chất liệu": "Khung nhôm CNC 6063 cao cấp",
      "Layout": "75% Gasket Mount",
      "Hỗ trợ": "QMK/VIA tùy biến từng nút và núm xoay",
      "Kết nối": "Bluetooth 5.1 & Type-C"
    }
  },
  {
    "id": "kb-006",
    "name": "Bàn phím cơ Razer BlackWidow V4 Pro Green Switch RGB",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 4990000,
    "oldPrice": 5390000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Razer BlackWidow V4 Pro Green Switch RGB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Switch": "Razer Green Clicky",
      "Đèn LED": "Chroma RGB từng phím kèm dải LED gầm",
      "Núm xoay": "Razer Command Dial đa năng",
      "Kê tay": "Đệm da từ tính có LED"
    }
  },
  {
    "id": "kb-007",
    "name": "Bàn phím cơ Corsair K100 RGB Optical-Mechanical OPX Switch",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 5490000,
    "oldPrice": 6040000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Corsair K100 RGB Optical-Mechanical OPX Switch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Switch": "Corsair OPX Quang Học nhận lệnh 1mm",
      "Tần số quét": "Axon 8000Hz Hyper-polling",
      "Vòng xoay": "iCUE Control Wheel điều khiển media"
    }
  },
  {
    "id": "kb-008",
    "name": "Bàn phím cơ Logitech G Pro X TKL Lightspeed Wireless",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 3790000,
    "oldPrice": 4090000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Logitech G Pro X TKL Lightspeed Wireless. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kết nối": "Công nghệ không dây Lightspeed siêu nhanh",
      "Layout": "Tenkeyless gọn nhẹ thi đấu",
      "Keycap": "PBT Dual-shot chống mài mòn",
      "Bao đựng": "Kèm túi cứng du lịch tiện lợi"
    }
  },
  {
    "id": "kb-009",
    "name": "Bàn phím cơ Leopold FC900R PD Sweden Red Switch Cherry",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 3190000,
    "oldPrice": 3570000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Leopold FC900R PD Sweden Red Switch Cherry. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Switch": "Cherry MX Red siêu êm",
      "Keycap": "PBT Double-Shot dày 1.5mm trứ danh Leopold",
      "Độ bền": "Tiêu chuẩn gia công cơ khí cao cấp Hàn Quốc"
    }
  },
  {
    "id": "kb-010",
    "name": "Bàn phím cơ Ducky One 3 RGB Matcha Fullsize (Cherry MX Brown)",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2990000,
    "oldPrice": 3290000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Ducky One 3 RGB Matcha Fullsize (Cherry MX Brown). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Triết lý QUACK Mechanics chống ồn đỉnh cao",
      "Hot-swap": "Kailh socket thay switch không cần hàn",
      "Màu sắc": "Matcha xanh trà sang trọng"
    }
  },
  {
    "id": "kb-011",
    "name": "Bàn phím cơ MonsGeek M1W V3 Wireless Nhôm CNC 75% Gasket Mount",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 1890000,
    "oldPrice": 2120000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ MonsGeek M1W V3 Wireless Nhôm CNC 75% Gasket Mount. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Khung": "Nhôm CNC anode tĩnh điện",
      "Cấu trúc": "Gasket Mount tiêu âm đầy đủ 5 lớp",
      "Switch": "Akko V3 Piano Pro siêu mượt"
    }
  },
  {
    "id": "kb-012",
    "name": "Bàn phím cơ Darmoshark TOP75 Tri-Mode TFT Screen Knob",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 1690000,
    "oldPrice": 1830000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Darmoshark TOP75 Tri-Mode TFT Screen Knob. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Màn hình": "Màn hình màu TFT hiển thị ảnh GIF, pin, giờ",
      "Núm kim loại": "Vặn tăng giảm volume",
      "Switch": "TTC Iron Switch cao cấp"
    }
  },
  {
    "id": "kb-013",
    "name": "Bàn phím cơ NuPhy Air75 V2 Low-Profile Wireless Siêu Mỏng",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2790000,
    "oldPrice": 3070000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ NuPhy Air75 V2 Low-Profile Wireless Siêu Mỏng. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Độ mỏng": "Bàn phím cơ siêu mỏng đặt lên trên MacBook",
      "Switch": "Gateron Low-profile Cowberry",
      "Tần số": "1000Hz Polling rate qua 2.4G"
    }
  },
  {
    "id": "kb-014",
    "name": "Bàn phím cơ công thái học Feker Alice 80 Ergo Wireless",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2190000,
    "oldPrice": 2370000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ công thái học Feker Alice 80 Ergo Wireless. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Layout": "Alice Ergo uốn cong bảo vệ cổ tay",
      "Kết nối": "3 Mode không dây và có dây",
      "Led": "RGB từng phím và led viền"
    }
  },
  {
    "id": "kb-015",
    "name": "Bàn phím cơ SteelSeries Apex Pro TKL OmniPoint 2.0 Switch",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 5290000,
    "oldPrice": 5920000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ SteelSeries Apex Pro TKL OmniPoint 2.0 Switch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Switch": "OmniPoint 2.0 chỉnh điểm kích hoạt từ 0.2mm - 3.8mm",
      "Màn hình": "OLED Smart Display hiển thị thông số",
      "Chức năng": "Rapid Trigger chuyên game FPS"
    }
  },
  {
    "id": "kb-016",
    "name": "Bàn phím không dây Logitech MX Keys S Advanced Wireless Silent",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2490000,
    "oldPrice": 2740000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím không dây Logitech MX Keys S Advanced Wireless Silent. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Phím bấm": "Perfect Stroke lõm ôm đầu ngón tay",
      "Đèn nền": "Tự động sáng khi đưa tay lại gần",
      "Kết nối": "Logi Bolt & Bluetooth 3 thiết bị"
    }
  },
  {
    "id": "kb-017",
    "name": "Bàn phím cơ Aula F75 Gasket Mount 3 Mode (Reaper Switch)",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 890000,
    "oldPrice": 1000000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Aula F75 Gasket Mount 3 Mode (Reaper Switch). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Switch": "LEOBOG Reaper Switch âm thanh clack giòn tan",
      "Hot-swap": "5 pin tương thích mọi loại switch",
      "Đánh giá": "Vua bàn phím cơ giá rẻ phân khúc dưới 1 triệu"
    }
  },
  {
    "id": "kb-018",
    "name": "Bàn phím cơ không dây FL-Esports OG87 Retro Classic",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 2490000,
    "oldPrice": 2690000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ không dây FL-Esports OG87 Retro Classic. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Phong cách": "Retro hoài cổ máy tính cổ điển",
      "Switch": "Kailh Box Ice Mint",
      "Keycap": "FSA Profile độc quyền gõ cực sướng"
    }
  },
  {
    "id": "kb-019",
    "name": "Bàn phím cơ DareU EK87 V2 Multi-Led Red Switch",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 490000,
    "oldPrice": 540000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ DareU EK87 V2 Multi-Led Red Switch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Layout": "TKL 87 phím gọn gàng",
      "Switch": "DareU D-Switch bền bỉ 50 triệu lần bấm",
      "Phù hợp": "Học sinh sinh viên chơi game giá cực rẻ"
    }
  },
  {
    "id": "kb-020",
    "name": "Bàn phím cơ Asus ROG Azoth 75% OLED Wireless Tri-Mode",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 6290000,
    "oldPrice": 6790000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím cơ Asus ROG Azoth 75% OLED Wireless Tri-Mode. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Màn hình": "OLED 2 inch hiển thị thông số hệ thống",
      "Kèm theo": "Bộ kit bôi trơn switch ROG DIY Lube Kit",
      "Thời lượng pin": "Hơn 2000 giờ sử dụng"
    }
  },
  {
    "id": "kb-021",
    "name": "Bàn phím không dây Apple Magic Keyboard with Touch ID & Numeric",
    "category": "keyboard",
    "category_id": "keyboard",
    "price": 4290000,
    "oldPrice": 4800000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bàn phím cơ cao cấp cảm giác gõ êm ái, bền bỉ - Bàn phím không dây Apple Magic Keyboard with Touch ID & Numeric. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Bảo mật": "Touch ID mở khóa Mac tức thì",
      "Thiết kế": "Nhôm nguyên khối siêu mỏng sang trọng",
      "Tương thích": "Tối ưu hoàn hảo cho máy tính Mac"
    }
  },
  {
    "id": "mon-006",
    "name": "Màn hình LG UltraGear 27GR95QE-B (27 inch OLED 240Hz 0.03ms G-Sync)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 19990000,
    "oldPrice": 22390000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình LG UltraGear 27GR95QE-B (27 inch OLED 240Hz 0.03ms G-Sync). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Tấm nền": "OLED chống chói",
      "Độ phân giải": "QHD 2560x1440",
      "Chuẩn màu": "DCI-P3 98.5%",
      "Cổng": "HDMI 2.1, DisplayPort 1.4"
    }
  },
  {
    "id": "mon-007",
    "name": "Màn hình Samsung Odyssey OLED G9 G95SC (49\" Kép cong 240Hz 0.03ms)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 32990000,
    "oldPrice": 35630000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Samsung Odyssey OLED G9 G95SC (49\" Kép cong 240Hz 0.03ms). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "49 inch siêu rộng 32:9",
      "Độ phân giải": "Dual QHD (5120 x 1440)",
      "Độ cong": "1800R",
      "Tần số quét": "240Hz"
    }
  },
  {
    "id": "mon-008",
    "name": "Màn hình Dell UltraSharp U2724D (27\" 2K IPS Black 120Hz 100% sRGB)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 10490000,
    "oldPrice": 11540000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Dell UltraSharp U2724D (27\" 2K IPS Black 120Hz 100% sRGB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "27 inch",
      "Tấm nền": "IPS Black độ tương phản 2000:1",
      "Độ phân giải": "2K QHD (2560 x 1440)",
      "Tần số quét": "120Hz mượt mà",
      "Cổng": "Cảm biến ánh sáng tự động cân chỉnh"
    }
  },
  {
    "id": "mon-009",
    "name": "Màn hình Dell UltraSharp U2424E (24 inch FHD IPS Hub Type-C 90W RJ45)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 6890000,
    "oldPrice": 7440000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Dell UltraSharp U2424E (24 inch FHD IPS Hub Type-C 90W RJ45). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "23.8 inch IPS",
      "Tần số quét": "120Hz Eye-Comfort",
      "Cổng kết nối": "USB-C sạc ngược 90W PD, Cổng mạng LAN RJ45"
    }
  },
  {
    "id": "mon-010",
    "name": "Màn hình BenQ ZOWIE XL2546K (24.5\" FHD 240Hz 0.5ms DyAc+ Chuyên Esport)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 11490000,
    "oldPrice": 12870000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình BenQ ZOWIE XL2546K (24.5\" FHD 240Hz 0.5ms DyAc+ Chuyên Esport). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "24.5 inch TN Gaming",
      "Tần số quét": "240Hz",
      "Công nghệ độc quyền": "DyAc+ triệt tiêu bóng mờ khi sấy đạn CS2/Valorant"
    }
  },
  {
    "id": "mon-011",
    "name": "Màn hình ViewSonic VX2758A-2K-PRO-2 (27\" 2K Fast IPS 170Hz 1ms)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 4490000,
    "oldPrice": 4940000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình ViewSonic VX2758A-2K-PRO-2 (27\" 2K Fast IPS 170Hz 1ms). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "27 inch Fast IPS",
      "Độ phân giải": "2K (2560x1440)",
      "Tần số quét": "170Hz",
      "Giá trị": "Màn hình 2K quốc dân giá tốt nhất phân khúc"
    }
  },
  {
    "id": "mon-012",
    "name": "Màn hình MSI MAG 274UPF (27\" 4K UHD 144Hz Rapid IPS Type-C 65W)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 11990000,
    "oldPrice": 13430000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình MSI MAG 274UPF (27\" 4K UHD 144Hz Rapid IPS Type-C 65W). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Độ phân giải": "4K UHD (3840 x 2160)",
      "Tấm nền": "Rapid IPS 144Hz 1ms GtG",
      "Chuẩn màu": "DCI-P3 97%, sRGB 129%"
    }
  },
  {
    "id": "mon-013",
    "name": "Màn hình Gigabyte M27Q (27\" 2K SS IPS 170Hz 0.5ms KVM Switch)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 6490000,
    "oldPrice": 7010000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Gigabyte M27Q (27\" 2K SS IPS 170Hz 0.5ms KVM Switch). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "27 inch Super Speed IPS",
      "Độ phân giải": "2560x1440",
      "Tính năng KVM": "Chuyển đổi phím chuột giữa 2 máy tính tức thì"
    }
  },
  {
    "id": "mon-014",
    "name": "Màn hình ASUS TUF Gaming VG259QR (24.5\" FHD IPS 165Hz 1ms G-Sync)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 3890000,
    "oldPrice": 4280000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình ASUS TUF Gaming VG259QR (24.5\" FHD IPS 165Hz 1ms G-Sync). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "24.5 inch FHD IPS",
      "Tần số quét": "165Hz",
      "Chân đế": "Công thái học xoay dọc 90 độ, nâng hạ tiện lợi"
    }
  },
  {
    "id": "mon-015",
    "name": "Màn hình AOC 24G2SP (23.8 inch FHD IPS 165Hz 1ms sRGB 126%)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 2990000,
    "oldPrice": 3230000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình AOC 24G2SP (23.8 inch FHD IPS 165Hz 1ms sRGB 126%). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "23.8 inch IPS",
      "Tần số quét": "165Hz",
      "Độ phủ màu": "126% sRGB chuyên game và dựng phim"
    }
  },
  {
    "id": "mon-016",
    "name": "Màn hình Philips Evnia 34M2C7600MV (34\" Cong Mini LED WQHD 165Hz)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 18990000,
    "oldPrice": 21270000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Philips Evnia 34M2C7600MV (34\" Cong Mini LED WQHD 165Hz). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "34 inch cong 1500R Mini LED",
      "Vùng sáng": "1152 Local Dimming Zones",
      "Độ sáng": "HDR 1400 nits đỉnh cao"
    }
  },
  {
    "id": "mon-017",
    "name": "Màn hình Di Động ASUS ZenScreen MB166C (15.6\" FHD IPS Type-C Siêu Mỏng)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 3690000,
    "oldPrice": 4060000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Di Động ASUS ZenScreen MB166C (15.6\" FHD IPS Type-C Siêu Mỏng). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "15.6 inch xách tay",
      "Trọng lượng": "Chỉ 780g dày 11.8mm",
      "Kết nối": "1 dây Type-C duy nhất cấp nguồn và tín hiệu"
    }
  },
  {
    "id": "mon-018",
    "name": "Màn hình Đồ Họa ProArt PA278CV (27\" 2K IPS Calman Verified 100% sRGB)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 8990000,
    "oldPrice": 10070000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Đồ Họa ProArt PA278CV (27\" 2K IPS Calman Verified 100% sRGB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn màu": "Delta E < 2 cân màu sẵn tại nhà máy",
      "Cổng": "USB-C DisplayPort 65W Daisy Chain",
      "Chân xoay": "Xoay 4 chiều mượt mà"
    }
  },
  {
    "id": "mon-019",
    "name": "Màn hình Xiaomi Gaming G24i (23.8\" Fast IPS 180Hz 1ms HDR10)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 2290000,
    "oldPrice": 2470000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Xiaomi Gaming G24i (23.8\" Fast IPS 180Hz 1ms HDR10). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "23.8 inch",
      "Tần số quét": "180Hz siêu mượt",
      "Tấm nền": "Fast IPS góc nhìn 178 độ"
    }
  },
  {
    "id": "mon-020",
    "name": "Màn hình Samsung Smart Monitor M8 M80C (32\" 4K UHD Kèm Camera SlimFit)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 10990000,
    "oldPrice": 12090000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình Samsung Smart Monitor M8 M80C (32\" 4K UHD Kèm Camera SlimFit). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "32 inch 4K",
      "Hệ điều hành": "Tizen OS xem Netflix, YouTube không cần PC",
      "Camera": "SlimFit 1080p nam châm tiện lợi"
    }
  },
  {
    "id": "mon-021",
    "name": "Màn hình LG DualUp 28MQ780-B (27.6\" Tỉ lệ độc lạ 16:18 SDQHD Kèm Arm Ergo)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 14490000,
    "oldPrice": 15650000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình LG DualUp 28MQ780-B (27.6\" Tỉ lệ độc lạ 16:18 SDQHD Kèm Arm Ergo). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Tỉ lệ": "16:18 tương đương 2 màn hình 21.5\" xếp chồng",
      "Độ phân giải": "SDQHD (2560 x 2880)",
      "Chân đế": "Arm kẹp bàn công thái học xoay gập đa hướng"
    }
  },
  {
    "id": "mouse-005",
    "name": "Chuột không dây Razer Viper V3 Pro Wireless 54g Ultra-lightweight",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3990000,
    "oldPrice": 4470000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Razer Viper V3 Pro Wireless 54g Ultra-lightweight. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "54g nhẹ nhất phân khúc thi đấu Esport",
      "Mắt đọc": "Focus Pro 35K Gen-2 Optical",
      "Polling rate": "Hỗ trợ không dây 8000Hz HyperPolling"
    }
  },
  {
    "id": "mouse-006",
    "name": "Chuột không dây Razer DeathAdder V3 Pro White 63g Ergonomic",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3190000,
    "oldPrice": 3450000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Razer DeathAdder V3 Pro White 63g Ergonomic. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Form cầm": "Công thái học tay phải huyền thoại",
      "Switch": "Razer Optical Gen-3 không double click",
      "Pin": "Thời lượng pin 90 giờ liên tục"
    }
  },
  {
    "id": "mouse-007",
    "name": "Chuột không dây Logitech MX Master 3S Silent MagSpeed 8K DPI",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2190000,
    "oldPrice": 2410000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Logitech MX Master 3S Silent MagSpeed 8K DPI. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Cuộn chuột": "Con lăn điện từ MagSpeed cuộn 1000 dòng/giây",
      "Độ ồn": "Click tĩnh âm Quiet Clicks giảm 90% tiếng",
      "Mắt đọc": "Darkfield hoạt động trên mặt kính"
    }
  },
  {
    "id": "mouse-008",
    "name": "Chuột không dây Zowie EC2-CW Wireless Esport Chuẩn Thi Đấu",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3690000,
    "oldPrice": 3990000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Zowie EC2-CW Wireless Esport Chuẩn Thi Đấu. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Form cầm": "EC2 công thái học được game thủ CS/Valorant tin dùng",
      "Đầu thu": "Trạm thu sóng Enhancer Receiver chống nhiễu tuyệt đối"
    }
  },
  {
    "id": "mouse-009",
    "name": "Chuột không dây Pulsar X2 V2 Mini Wireless 51g Red",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2290000,
    "oldPrice": 2560000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Pulsar X2 V2 Mini Wireless 51g Red. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "51g không đục lỗ",
      "Mắt đọc": "PixArt PAW3395 26.000 DPI",
      "Switch": "Quang học Optical Switch chống bụi"
    }
  },
  {
    "id": "mouse-010",
    "name": "Chuột không dây Lamzu Atlantis OG V2 Pro 4K Wireless",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2390000,
    "oldPrice": 2630000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Lamzu Atlantis OG V2 Pro 4K Wireless. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Form cầm": "Đối xứng vuốt nhẹ ôm trọn lòng bàn tay Claw-grip",
      "Polling Rate": "Kèm sẵn Dongle 4K Receiver",
      "Phụ kiện": "Kèm sẵn Grip tape chống trơn"
    }
  },
  {
    "id": "mouse-011",
    "name": "Chuột không dây Ninjutso Sora V2 Siêu Nhẹ 39g Không Lỗ",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2690000,
    "oldPrice": 3010000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Ninjutso Sora V2 Siêu Nhẹ 39g Không Lỗ. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "39g nhẹ số 1 thế giới",
      "Chất liệu": "Nhựa Polycarbonate đúc liền khối nguyên bản"
    }
  },
  {
    "id": "mouse-012",
    "name": "Chuột Gaming ASUS ROG Harpe Ace Aim Lab Edition 54g",
    "category": "mouse",
    "category_id": "mouse",
    "price": 2890000,
    "oldPrice": 3120000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột Gaming ASUS ROG Harpe Ace Aim Lab Edition 54g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Cảm biến": "ROG AimPoint 36.000 DPI",
      "Phần mềm": "Tích hợp tính năng Aim Lab Settings Optimizer"
    }
  },
  {
    "id": "mouse-013",
    "name": "Chuột không dây Logitech G502 X Plus Lightspeed RGB",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3290000,
    "oldPrice": 3620000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Logitech G502 X Plus Lightspeed RGB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Nút bấm": "13 nút bấm có thể lập trình",
      "Switch": "Lightforce hybrid switches",
      "Đèn LED": "RGB 8 vùng chủ động"
    }
  },
  {
    "id": "mouse-014",
    "name": "Chuột Gaming Glorious Model O 2 Wireless White 68g",
    "category": "mouse",
    "category_id": "mouse",
    "price": 1890000,
    "oldPrice": 2040000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột Gaming Glorious Model O 2 Wireless White 68g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Tổ ong thoáng khí chống mồ hôi tay",
      "Mắt đọc": "BAMF 2.0 26K DPI",
      "Pin": "Lên tới 210 giờ sử dụng"
    }
  },
  {
    "id": "mouse-015",
    "name": "Chuột không dây ATK Blazing Sky F1 Ultimate 38g 8K",
    "category": "mouse",
    "category_id": "mouse",
    "price": 1790000,
    "oldPrice": 2000000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây ATK Blazing Sky F1 Ultimate 38g 8K. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "38g phá vỡ mọi giới hạn",
      "Chip xử lý": "Nordic 52840 cao cấp nhất",
      "Tần số": "Hỗ trợ 8000Hz mượt như tơ"
    }
  },
  {
    "id": "mouse-016",
    "name": "Chuột không dây E-Dra EM610X Wireless 2.4G Silent",
    "category": "mouse",
    "category_id": "mouse",
    "price": 290000,
    "oldPrice": 320000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây E-Dra EM610X Wireless 2.4G Silent. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Đặc điểm": "Click không tiếng ồn, kết nối USB receiver",
      "Nhu cầu": "Học tập văn phòng giá siêu rẻ"
    }
  },
  {
    "id": "mouse-017",
    "name": "Chuột Gaming SteelSeries Aerox 3 Wireless Ghost Edition",
    "category": "mouse",
    "category_id": "mouse",
    "price": 1890000,
    "oldPrice": 2120000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột Gaming SteelSeries Aerox 3 Wireless Ghost Edition. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Đạt chuẩn": "Chống nước IP54 AquaBarrier chống bụi bẩn",
      "Trọng lượng": "68g LED Prism RGB rực rỡ"
    }
  },
  {
    "id": "mouse-018",
    "name": "Chuột công thái học Logitech Lift Vertical Ergonomic Wireless",
    "category": "mouse",
    "category_id": "mouse",
    "price": 1490000,
    "oldPrice": 1610000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột công thái học Logitech Lift Vertical Ergonomic Wireless. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Góc nghiêng": "57 độ tự nhiên thư giãn cổ tay cả ngày",
      "Phù hợp": "Bàn tay vừa và nhỏ của người Việt"
    }
  },
  {
    "id": "mouse-019",
    "name": "Chuột không dây Apple Magic Mouse White Multi-Touch Surface",
    "category": "mouse",
    "category_id": "mouse",
    "price": 1990000,
    "oldPrice": 2190000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Apple Magic Mouse White Multi-Touch Surface. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Mặt cảm ứng": "Vuốt cuộn mượt mà như màn hình cảm ứng iPhone",
      "Thiết kế": "Liền mạch tối giản sang trọng đặc trưng Apple"
    }
  },
  {
    "id": "mouse-020",
    "name": "Chuột Gaming DareU EM901X RGB Wireless Kèm Dock Sạc Từ Tính",
    "category": "mouse",
    "category_id": "mouse",
    "price": 790000,
    "oldPrice": 850000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột Gaming DareU EM901X RGB Wireless Kèm Dock Sạc Từ Tính. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kèm theo": "Dock sạc nam châm có đèn viền RGB siêu đẹp",
      "Pin": "Dung lượng pin 930mAh"
    }
  },
  {
    "id": "mouse-021",
    "name": "Chuột Gaming VGN Dragonfly F1 Pro Max Wireless 55g",
    "category": "mouse",
    "category_id": "mouse",
    "price": 990000,
    "oldPrice": 1110000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột Gaming VGN Dragonfly F1 Pro Max Wireless 55g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Mắt đọc": "PAW3395 chuẩn flagship",
      "Pin": "Dung lượng 500mAh dùng 130 giờ",
      "Giá trị": "Chuột gaming quốc dân cấu hình khủng giá mềm"
    }
  },
  {
    "id": "pc-game-005",
    "name": "PC Gaming DPC White Dragon (Core i5-14400F • RTX 4060 8GB • 16GB DDR5)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 19990000,
    "oldPrice": 21990000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming DPC White Dragon (Core i5-14400F • RTX 4060 8GB • 16GB DDR5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-14400F",
      "VGA": "MSI RTX 4060 Ventus White 8GB",
      "Mainboard": "B760M White Wifi",
      "RAM": "16GB DDR5 5600MHz RGB",
      "SSD": "512GB NVMe M.2 Gen4",
      "Tản nhiệt": "Tản nước AIO 240mm ARGB White",
      "Nguồn": "650W 80 Plus Bronze"
    }
  },
  {
    "id": "pc-game-006",
    "name": "PC Gaming Esport Pro (Intel Core i3-12100F • GTX 1650 4GB • 16GB RAM)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 8990000,
    "oldPrice": 10070000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Esport Pro (Intel Core i3-12100F • GTX 1650 4GB • 16GB RAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i3-12100F (4C/8T)",
      "VGA": "NVIDIA GTX 1650 4GB GDDR6",
      "Mainboard": "H610M LGA1700",
      "RAM": "16GB DDR4 3200MHz Dual Channel",
      "SSD": "256GB NVMe SSD",
      "Vỏ case": "Kèm 3 quạt LED RGB mặt lưới mát"
    }
  },
  {
    "id": "pc-game-007",
    "name": "PC Gaming Cyber Esport (Core i5-12400F • RTX 3060 12GB • 16GB RAM)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 14490000,
    "oldPrice": 15650000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Cyber Esport (Core i5-12400F • RTX 3060 12GB • 16GB RAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12400F",
      "VGA": "GeForce RTX 3060 12GB VRAM",
      "Mainboard": "B760M Gaming",
      "RAM": "16GB DDR4 3200MHz Kingston Fury",
      "SSD": "512GB PCIe 4.0 NVMe",
      "Nguồn": "600W 80 Plus"
    }
  },
  {
    "id": "pc-game-008",
    "name": "PC Gaming Master V1 (Core i7-14700K • RTX 4070Ti Super • 32GB DDR5)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 44990000,
    "oldPrice": 49490000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Master V1 (Core i7-14700K • RTX 4070Ti Super • 32GB DDR5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i7-14700K 20 nhân",
      "VGA": "Gigabyte RTX 4070Ti Super 16GB",
      "Mainboard": "Z790 Gaming Wifi",
      "RAM": "32GB DDR5 6000MHz Corsair Vengeance",
      "SSD": "1TB Samsung 980 Pro PCIe 4.0",
      "Tản nhiệt": "AIO 360mm LCD Liquid Cooler"
    }
  },
  {
    "id": "pc-game-009",
    "name": "PC Gaming GodLike ROG (Core i9-14900K • RTX 4090 24GB • 64GB DDR5)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 92990000,
    "oldPrice": 100430000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming GodLike ROG (Core i9-14900K • RTX 4090 24GB • 64GB DDR5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900K",
      "VGA": "ASUS ROG Strix RTX 4090 24GB",
      "Mainboard": "ROG MAXIMUS Z790 HERO",
      "RAM": "64GB (2x32GB) DDR5 6400MHz G.Skill",
      "SSD": "2TB Samsung 990 Pro Gen5",
      "Tản nhiệt": "ROG Ryujin III 360 ARGB"
    }
  },
  {
    "id": "pc-game-010",
    "name": "PC Gaming AMD Ryzen 7 7800X3D • RTX 4080 Super • 32GB DDR5",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 56990000,
    "oldPrice": 63830000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming AMD Ryzen 7 7800X3D • RTX 4080 Super • 32GB DDR5. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 7 7800X3D (Vua Gaming)",
      "VGA": "MSI RTX 4080 Super 16GB Gaming X",
      "Mainboard": "B650E AORUS ELITE AX",
      "RAM": "32GB DDR5 6000MHz CL30 EXPO",
      "SSD": "1TB WD Black SN850X",
      "Nguồn": "850W Gold PCIe 5.0"
    }
  },
  {
    "id": "pc-game-011",
    "name": "PC Gaming Venom (Ryzen 5 7600 • Radeon RX 7700 XT 12GB • 16GB DDR5)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 23990000,
    "oldPrice": 26390000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Venom (Ryzen 5 7600 • Radeon RX 7700 XT 12GB • 16GB DDR5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 5 7600 6C/12T",
      "VGA": "Sapphire PULSE RX 7700 XT 12GB",
      "Mainboard": "B650M Gaming Wifi",
      "RAM": "16GB DDR5 5600MHz Kingston Fury",
      "SSD": "512GB NVMe M.2",
      "Nguồn": "700W 80 Plus Bronze"
    }
  },
  {
    "id": "pc-game-012",
    "name": "PC Gaming Frost White (Core i5-13400F • RTX 4060 Ti 8GB • Tản Nước 240)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 22490000,
    "oldPrice": 25190000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Frost White (Core i5-13400F • RTX 4060 Ti 8GB • Tản Nước 240). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13400F 10 nhân",
      "VGA": "Colorful RTX 4060 Ti Ultra White 8GB",
      "RAM": "32GB (2x16GB) DDR4 3200 RGB White",
      "SSD": "1TB Kingston NV2 NVMe",
      "Vỏ case": "Bể cá 2 mặt kính cường lực trong suốt"
    }
  },
  {
    "id": "pc-game-013",
    "name": "PC Gaming Streamer Studio (Ryzen 9 7900X • RTX 4070 Super • 32GB RAM)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 37990000,
    "oldPrice": 41030000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Streamer Studio (Ryzen 9 7900X • RTX 4070 Super • 32GB RAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 9 7900X (12C/24T)",
      "VGA": "ASUS Dual RTX 4070 Super 12GB",
      "Mainboard": "X670 Gaming Wifi",
      "RAM": "32GB DDR5 6000MHz",
      "SSD": "1TB M.2 PCIe 4.0 5000MB/s",
      "Phù hợp": "Livestream song song 2 nền tảng mượt mà"
    }
  },
  {
    "id": "pc-game-014",
    "name": "PC Gaming Mini ITX Nhỏ Gọn (Core i5-14400 • RTX 4060 • 32GB RAM)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 24900000,
    "oldPrice": 27390000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Mini ITX Nhỏ Gọn (Core i5-14400 • RTX 4060 • 32GB RAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-14400 10 nhân",
      "VGA": "ZOTAC RTX 4060 Twin Edge",
      "Mainboard": "B760I ITX Có Wifi 6E",
      "RAM": "32GB DDR5 5600MHz",
      "Vỏ case": "Kích thước 11 Lít xách tay tiện lợi"
    }
  },
  {
    "id": "pc-game-015",
    "name": "PC Gaming HAF High Airflow (Core i7-13700F • RTX 4070 12GB • 32GB DDR5)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 33990000,
    "oldPrice": 36710000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming HAF High Airflow (Core i7-13700F • RTX 4070 12GB • 32GB DDR5). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i7-13700F 16 nhân",
      "VGA": "Gigabyte RTX 4070 Windforce 12GB",
      "Mainboard": "B760 AORUS PRO",
      "RAM": "32GB DDR5 5600MHz",
      "Vỏ case": "Kèm 4 fan tản nhiệt 140mm cực mát"
    }
  },
  {
    "id": "pc-game-016",
    "name": "PC Gaming Valkyrie RGB (Core i5-12600KF • RTX 4060 Ti 16GB VRAM)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 24500000,
    "oldPrice": 27440000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Valkyrie RGB (Core i5-12600KF • RTX 4060 Ti 16GB VRAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12600KF (10C/16T)",
      "VGA": "GeForce RTX 4060 Ti 16GB đồ họa",
      "Mainboard": "Z690 Steel Legend",
      "RAM": "32GB DDR4 3600MHz RGB",
      "SSD": "1TB PCIe 4.0 NVMe"
    }
  },
  {
    "id": "pc-game-017",
    "name": "PC Gaming budget AMD Ryzen 5 5600 • Radeon RX 6600 8GB",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 11990000,
    "oldPrice": 13190000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming budget AMD Ryzen 5 5600 • Radeon RX 6600 8GB. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 5 5600 (6C/12T)",
      "VGA": "AMD Radeon RX 6600 8GB GDDR6",
      "Mainboard": "B450M Pro Max",
      "RAM": "16GB DDR4 3200MHz",
      "SSD": "500GB NVMe M.2"
    }
  },
  {
    "id": "pc-game-018",
    "name": "PC Gaming Shadow Hunter (Core i5-13600K • RTX 4070 Super 12GB)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 31990000,
    "oldPrice": 35830000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Shadow Hunter (Core i5-13600K • RTX 4070 Super 12GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13600K 14 nhân",
      "VGA": "MSI RTX 4070 Super Ventus 2X",
      "Mainboard": "MSI MAG B760 TOMAHAWK WIFI",
      "RAM": "32GB DDR5 6000MHz RGB",
      "Tản nhiệt": "Thermalright Peerless Assassin 120 SE"
    }
  },
  {
    "id": "pc-game-019",
    "name": "PC Gaming Apex Predator (Ryzen 7 5700X3D • RTX 4070 12GB)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 27900000,
    "oldPrice": 30130000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Apex Predator (Ryzen 7 5700X3D • RTX 4070 12GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 7 5700X3D 3D V-Cache",
      "VGA": "Colorful RTX 4070 12GB GDDR6X",
      "Mainboard": "B550 Gaming Plus",
      "RAM": "32GB DDR4 3600MHz",
      "SSD": "1TB M.2 PCIe 4.0"
    }
  },
  {
    "id": "pc-game-020",
    "name": "PC Gaming Bể Cá Mini Vision (Core i5-12400F • RTX 4060 White)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 18490000,
    "oldPrice": 20340000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Bể Cá Mini Vision (Core i5-12400F • RTX 4060 White). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12400F",
      "VGA": "Galax RTX 4060 8GB EX White",
      "RAM": "16GB DDR4 3200MHz White",
      "Vỏ case": "Bể cá cong panorama không cột chống góc"
    }
  },
  {
    "id": "pc-game-021",
    "name": "PC Gaming Ultra Titan (Core i9-14900KS • RTX 4090 OC Custom Loop)",
    "category": "gaming-pc",
    "category_id": "gaming-pc",
    "price": 115000000,
    "oldPrice": 124200000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Dàn máy tính PC Gaming cấu hình mạnh mẽ, tối ưu hóa FPS - PC Gaming Ultra Titan (Core i9-14900KS • RTX 4090 OC Custom Loop). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900KS Tuyển Chọn",
      "VGA": "ASUS ROG Strix RTX 4090 OC",
      "RAM": "64GB DDR5 7200MHz G.Skill Trident Z5",
      "Tản nhiệt": "Tản nước Custom ống cứng EKWB toàn bộ"
    }
  },
  {
    "id": "pc-off-003",
    "name": "PC Văn Phòng Dell OptiPlex 7010 MT (Core i5-13500 • 16GB • SSD 512GB)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 12490000,
    "oldPrice": 13740000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Dell OptiPlex 7010 MT (Core i5-13500 • 16GB • SSD 512GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13500 (14 cores, 20 threads)",
      "RAM": "16GB DDR4 3200MHz",
      "Ổ cứng": "512GB PCIe NVMe SSD",
      "Kết nối": "Wifi 6E, Bluetooth 5.3, LAN Gigabit",
      "Độ bền": "Chuẩn doanh nghiệp hoạt động 24/7"
    }
  },
  {
    "id": "pc-off-004",
    "name": "PC Đồng Bộ HP ProDesk 400 G9 MT (Core i5-12500 • 8GB • 256GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 9990000,
    "oldPrice": 11190000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Đồng Bộ HP ProDesk 400 G9 MT (Core i5-12500 • 8GB • 256GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12500 (6C/12T up to 4.6GHz)",
      "RAM": "8GB DDR4 (Nâng cấp tối đa 64GB)",
      "Ổ cứng": "256GB SSD PCIe NVMe",
      "Hệ điều hành": "Windows 11 Home Bản quyền"
    }
  },
  {
    "id": "pc-off-005",
    "name": "PC Mini Lenovo ThinkCentre Neo 50q Gen 4 (Core i5-13420H • 16GB • 512GB)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 10990000,
    "oldPrice": 11870000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Mini Lenovo ThinkCentre Neo 50q Gen 4 (Core i5-13420H • 16GB • 512GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13420H 8 nhân 12 luồng",
      "RAM": "16GB DDR4 SO-DIMM",
      "Ổ cứng": "512GB SSD M.2 PCIe",
      "Kích thước": "Siêu nhỏ gọn 1 lít gắn sau màn hình"
    }
  },
  {
    "id": "pc-off-006",
    "name": "PC Văn Phòng Kế Toán Siêu Bền (Core i3-12100 • 8GB RAM • 256GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 5490000,
    "oldPrice": 6040000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Kế Toán Siêu Bền (Core i3-12100 • 8GB RAM • 256GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i3-12100 4 nhân 8 luồng",
      "RAM": "8GB DDR4 3200MHz",
      "Ổ cứng": "256GB SSD M.2 tốc độ cao",
      "Cổng xuất hình": "VGA + HDMI đa năng",
      "Nguồn": "Nguồn công suất thực 400W 80 Plus"
    }
  },
  {
    "id": "pc-off-007",
    "name": "PC Văn Phòng Đa Nhiệm Mượt (Core i5-12400 • 16GB RAM • 512GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 7490000,
    "oldPrice": 8090000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Đa Nhiệm Mượt (Core i5-12400 • 16GB RAM • 512GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12400 (6C/12T đồ họa UHD 730)",
      "RAM": "16GB DDR4 3200MHz Dual Channel",
      "Ổ cứng": "512GB M.2 NVMe SSD",
      "Bảo hành": "36 tháng chính hãng linh kiện mới 100%"
    }
  },
  {
    "id": "pc-off-008",
    "name": "PC Mini ASUS NUC 13 Pro Desk Edition (Core i7-1360P • 16GB • 512GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 15990000,
    "oldPrice": 17910000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Mini ASUS NUC 13 Pro Desk Edition (Core i7-1360P • 16GB • 512GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i7-1360P (12 cores, 16 threads)",
      "RAM": "16GB DDR4 3200MHz",
      "Ổ cứng": "512GB Gen4 NVMe SSD",
      "Cổng kết nối": "2x Thunderbolt 4, 2x HDMI 2.1, 2.5G LAN"
    }
  },
  {
    "id": "pc-off-009",
    "name": "Apple Mac mini M2 (8-core CPU, 10-core GPU, 8GB Unified, 256GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 13990000,
    "oldPrice": 15390000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - Apple Mac mini M2 (8-core CPU, 10-core GPU, 8GB Unified, 256GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chip": "Apple M2 8-core CPU / 10-core GPU",
      "RAM": "8GB Unified Memory siêu tốc",
      "Ổ cứng": "256GB SSD",
      "Hệ điều hành": "macOS Sequoia mượt mà, bảo mật"
    }
  },
  {
    "id": "pc-off-010",
    "name": "PC All-in-One HP 24-df (Core i5-1235U • 16GB • 512GB • 23.8 inch FHD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 14990000,
    "oldPrice": 16790000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC All-in-One HP 24-df (Core i5-1235U • 16GB • 512GB • 23.8 inch FHD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Tất cả trong một All-in-One màn 23.8\" FHD IPS",
      "CPU": "Intel Core i5-1235U 10 nhân",
      "RAM": "16GB DDR4",
      "Phụ kiện": "Kèm sẵn bàn phím + chuột không dây HP"
    }
  },
  {
    "id": "pc-off-011",
    "name": "PC All-in-One Dell Inspiron 5420 (Core i7-1355U • 16GB • 512GB • 23.8\" FHD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 21990000,
    "oldPrice": 23750000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC All-in-One Dell Inspiron 5420 (Core i7-1355U • 16GB • 512GB • 23.8\" FHD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Màn hình": "23.8 inch FHD IPS viền siêu mỏng cảm ứng",
      "CPU": "Intel Core i7-1355U (10 nhân 12 luồng)",
      "RAM": "16GB DDR4 3200MHz",
      "Camera": "Webcam FHD Pop-up ẩn hiện bảo mật"
    }
  },
  {
    "id": "pc-off-012",
    "name": "PC Văn Phòng ASUS ExpertCenter D500 (Core i3-13100 • 8GB • 256GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 7990000,
    "oldPrice": 8790000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng ASUS ExpertCenter D500 (Core i3-13100 • 8GB • 256GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i3-13100 Gen 13th",
      "RAM": "8GB DDR4",
      "Ổ cứng": "256GB SSD PCIe 4.0",
      "Bảo mật": "Chip TPM 2.0 chuẩn bảo mật quân sự"
    }
  },
  {
    "id": "pc-off-013",
    "name": "PC Văn Phòng Đồ Họa 2D Photoshop/AutoCAD (Core i5-13400 • 32GB • 512GB)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 9890000,
    "oldPrice": 10680000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Đồ Họa 2D Photoshop/AutoCAD (Core i5-13400 • 32GB • 512GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13400 10 nhân 16 luồng",
      "RAM": "32GB DDR4 3200MHz chạy mượt file thiết kế nặng",
      "Ổ cứng": "512GB NVMe tốc độ cao 3500MB/s"
    }
  },
  {
    "id": "pc-off-014",
    "name": "PC Mini HP EliteDesk 800 G9 Desktop Mini (Core i7-13700T • 16GB • 512GB)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 18900000,
    "oldPrice": 21170000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Mini HP EliteDesk 800 G9 Desktop Mini (Core i7-13700T • 16GB • 512GB). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i7-13700T vPro 16 nhân",
      "RAM": "16GB DDR5 4800MHz",
      "Kích thước": "Bỏ vừa túi xách mang đi làm hàng ngày"
    }
  },
  {
    "id": "pc-off-015",
    "name": "PC Đồng Bộ Lenovo V50t Gen 2 (Core i5-10400 • 8GB • 256GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 6890000,
    "oldPrice": 7580000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Đồng Bộ Lenovo V50t Gen 2 (Core i5-10400 • 8GB • 256GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i5-10400 6 nhân 12 luồng",
      "RAM": "8GB DDR4 2666MHz",
      "Ổ cứng": "256GB SSD M.2 NVMe",
      "Thương hiệu": "Lenovo chính hãng xuất xứ rõ ràng"
    }
  },
  {
    "id": "pc-off-016",
    "name": "PC Văn Phòng Giá Rẻ DPC Celeron G6900 • 8GB RAM • 128GB SSD",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 3690000,
    "oldPrice": 4130000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Giá Rẻ DPC Celeron G6900 • 8GB RAM • 128GB SSD. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Celeron G6900 Socket LGA1700",
      "RAM": "8GB DDR4",
      "Ổ cứng": "128GB SSD M.2",
      "Nhu cầu": "Lướt web, học online, bán hàng và in hóa đơn"
    }
  },
  {
    "id": "pc-off-017",
    "name": "PC Văn Phòng AMD Ryzen 5 4600G (6C/12T Vega 7 Graphics • 16GB RAM)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 5990000,
    "oldPrice": 6470000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng AMD Ryzen 5 4600G (6C/12T Vega 7 Graphics • 16GB RAM). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 5 4600G 6 nhân 12 luồng",
      "Đồ họa tích hợp": "AMD Radeon Vega 7 mạnh mẽ",
      "RAM": "16GB DDR4 3200MHz Dual Channel"
    }
  },
  {
    "id": "pc-off-018",
    "name": "PC Văn Phòng Cao Cấp Quiet Edition (Core i7-14700 • 32GB RAM • Vỏ Chống Ồn)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 16900000,
    "oldPrice": 18590000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Văn Phòng Cao Cấp Quiet Edition (Core i7-14700 • 32GB RAM • Vỏ Chống Ồn). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "Intel Core i7-14700 20 nhân",
      "RAM": "32GB DDR5 5600MHz",
      "Vỏ case": "Lót mút tiêu âm be quiet! tĩnh lặng tuyệt đối"
    }
  },
  {
    "id": "pc-off-019",
    "name": "PC All-in-One ASUS A3402 (Core i3-1215U • 8GB • 512GB • 23.8 inch IPS)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 11990000,
    "oldPrice": 12950000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC All-in-One ASUS A3402 (Core i3-1215U • 8GB • 512GB • 23.8 inch IPS). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Chân đế chữ V sang trọng tối giản bàn làm việc",
      "CPU": "Intel Core i3-1215U 6 nhân",
      "Loa": "Âm thanh SonicMaster to rõ"
    }
  },
  {
    "id": "pc-off-020",
    "name": "PC Mini Beelink SER5 Max (AMD Ryzen 7 5800H • 16GB • 512GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 8290000,
    "oldPrice": 9280000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Mini Beelink SER5 Max (AMD Ryzen 7 5800H • 16GB • 512GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 7 5800H (8 nhân 16 luồng)",
      "RAM": "16GB DDR4 (Hỗ trợ 64GB)",
      "Xuất hình": "Hỗ trợ đồng thời 3 màn hình 4K 60Hz"
    }
  },
  {
    "id": "pc-off-021",
    "name": "PC Mini Mac mini M2 Pro (10-core CPU, 16-core GPU, 16GB, 512GB SSD)",
    "category": "office-pc",
    "category_id": "office-pc",
    "price": 31990000,
    "oldPrice": 35190000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 52,
    "stock": 32,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ máy tính PC văn phòng đồng bộ, độ bền cao và tiết kiệm điện - PC Mini Mac mini M2 Pro (10-core CPU, 16-core GPU, 16GB, 512GB SSD). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chip": "Apple M2 Pro chuyên nghiệp",
      "RAM": "16GB Unified Memory",
      "Cổng kết nối": "4 cổng Thunderbolt 4, HDMI 8K"
    }
  },
  {
    "id": "ram-005",
    "name": "Kit RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz Black",
    "category": "ram",
    "category_id": "ram",
    "price": 3790000,
    "oldPrice": 4240000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz Black. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "32GB (2x16GB)",
      "Bus": "6400MHz CL32",
      "Tản nhiệt": "Nhôm phay xước cao cấp biểu tượng Trident"
    }
  },
  {
    "id": "ram-006",
    "name": "Kit RAM G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz AMD EXPO",
    "category": "ram",
    "category_id": "ram",
    "price": 3490000,
    "oldPrice": 3770000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz AMD EXPO. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5 Tối ưu hóa riêng cho AMD Ryzen 7000/8000/9000",
      "Timing": "CL30 cực thấp cho độ trễ tối thiểu"
    }
  },
  {
    "id": "ram-007",
    "name": "Kit RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz",
    "category": "ram",
    "category_id": "ram",
    "price": 2990000,
    "oldPrice": 3290000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "32GB (2x16GB)",
      "Bus": "5600MHz",
      "Tính năng": "Kingston FURY Infrared Sync Technology đồng bộ LED"
    }
  },
  {
    "id": "ram-008",
    "name": "Kit RAM TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz White",
    "category": "ram",
    "category_id": "ram",
    "price": 3190000,
    "oldPrice": 3450000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz White. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "32GB (2x16GB)",
      "Bus": "6000MHz",
      "Thiết kế": "Góc mở rộng 120 độ LED RGB toàn cảnh rực rỡ"
    }
  },
  {
    "id": "ram-009",
    "name": "Kit RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5200MHz Black",
    "category": "ram",
    "category_id": "ram",
    "price": 2790000,
    "oldPrice": 3120000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 5200MHz Black. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Bus": "5200MHz",
      "Phần mềm": "Tùy biến qua Corsair iCUE"
    }
  },
  {
    "id": "ram-010",
    "name": "Kit RAM Adata XPG Lancer Blade RGB 32GB (2x16GB) DDR5 6000MHz",
    "category": "ram",
    "category_id": "ram",
    "price": 2990000,
    "oldPrice": 3290000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Adata XPG Lancer Blade RGB 32GB (2x16GB) DDR5 6000MHz. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Chiều cao": "Low-profile tương thích mọi loại tản nhiệt khí lớn"
    }
  },
  {
    "id": "ram-011",
    "name": "Kit RAM G.Skill Ripjaws S5 32GB (2x16GB) DDR5 5600MHz Không LED",
    "category": "ram",
    "category_id": "ram",
    "price": 2490000,
    "oldPrice": 2790000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM G.Skill Ripjaws S5 32GB (2x16GB) DDR5 5600MHz Không LED. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Thiết kế": "Tối giản không đèn LED gọn gàng",
      "Chiều cao": "Chỉ 33mm"
    }
  },
  {
    "id": "ram-012",
    "name": "Kit RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz Black",
    "category": "ram",
    "category_id": "ram",
    "price": 990000,
    "oldPrice": 1070000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz Black. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4",
      "Dung lượng": "16GB (2x8GB)",
      "Bus": "3200MHz CL16",
      "Quốc dân": "Thanh RAM DDR4 bán chạy số 1 lịch sử"
    }
  },
  {
    "id": "ram-013",
    "name": "Kit RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz",
    "category": "ram",
    "category_id": "ram",
    "price": 950000,
    "oldPrice": 1050000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4",
      "Bus": "3200MHz",
      "Tản nhiệt": "Nhôm đen nguyên khối mỏng gọn"
    }
  },
  {
    "id": "ram-014",
    "name": "Kit RAM Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3200MHz",
    "category": "ram",
    "category_id": "ram",
    "price": 1390000,
    "oldPrice": 1500000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3200MHz. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4",
      "LED": "10 bóng LED RGB sống động từng module"
    }
  },
  {
    "id": "ram-015",
    "name": "Kit RAM G.Skill Trident Z Royal Gold 32GB (2x16GB) DDR4 3600MHz Cắt Pha Lê",
    "category": "ram",
    "category_id": "ram",
    "price": 3490000,
    "oldPrice": 3910000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM G.Skill Trident Z Royal Gold 32GB (2x16GB) DDR4 3600MHz Cắt Pha Lê. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4",
      "Vỏ ngoài": "Mạ vàng hoàng gia 24K kèm thanh tản sáng dạng vương miện pha lê"
    }
  },
  {
    "id": "ram-016",
    "name": "Kit RAM Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5 5600MHz",
    "category": "ram",
    "category_id": "ram",
    "price": 6890000,
    "oldPrice": 7580000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5 5600MHz. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "64GB (2 thanh 32GB)",
      "Bus": "5600MHz",
      "Chuyên dụng": "Dựng phim 4K, đồ họa 3D và máy ảo chuyên nghiệp"
    }
  },
  {
    "id": "ram-017",
    "name": "RAM Laptop Kingston 16GB DDR5 4800MHz SODIMM",
    "category": "ram",
    "category_id": "ram",
    "price": 1290000,
    "oldPrice": 1440000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - RAM Laptop Kingston 16GB DDR5 4800MHz SODIMM. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5 SODIMM cho Laptop",
      "Dung lượng": "16GB 1 thanh",
      "Bus": "4800MHz",
      "Điện áp": "1.1V tiết kiệm pin"
    }
  },
  {
    "id": "ram-018",
    "name": "RAM Laptop Crucial 16GB DDR4 3200MHz SODIMM",
    "category": "ram",
    "category_id": "ram",
    "price": 850000,
    "oldPrice": 920000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - RAM Laptop Crucial 16GB DDR4 3200MHz SODIMM. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4 SODIMM cho Laptop",
      "Dung lượng": "16GB",
      "Bus": "3200MHz",
      "Tương thích": "Dễ dàng nâng cấp cho mọi laptop Intel & AMD"
    }
  },
  {
    "id": "ram-019",
    "name": "RAM Laptop Samsung 8GB DDR4 3200MHz SODIMM",
    "category": "ram",
    "category_id": "ram",
    "price": 490000,
    "oldPrice": 540000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - RAM Laptop Samsung 8GB DDR4 3200MHz SODIMM. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4 SODIMM",
      "Dung lượng": "8GB",
      "Nhà sản xuất": "Samsung chính hãng độ bền số 1"
    }
  },
  {
    "id": "ram-020",
    "name": "Kit RAM TeamGroup T-Create Expert 64GB (2x32GB) DDR5 6000MHz Creator",
    "category": "ram",
    "category_id": "ram",
    "price": 5490000,
    "oldPrice": 5930000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM TeamGroup T-Create Expert 64GB (2x32GB) DDR5 6000MHz Creator. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "64GB cực lớn",
      "Định hướng": "Dành riêng cho nhà sáng tạo nội dung và studio đồ họa"
    }
  },
  {
    "id": "ram-021",
    "name": "RAM Desktop Lexar Thor 16GB (1x16GB) DDR4 3200MHz Tản Nhôm",
    "category": "ram",
    "category_id": "ram",
    "price": 790000,
    "oldPrice": 880000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - RAM Desktop Lexar Thor 16GB (1x16GB) DDR4 3200MHz Tản Nhôm. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR4",
      "Dung lượng": "16GB",
      "Bus": "3200MHz",
      "Giá tốt": "Giải pháp nâng cấp tiết kiệm hiệu quả cao"
    }
  },
  {
    "id": "ssd-006",
    "name": "SSD WD Black SN850X 1TB PCIe Gen4 NVMe (Đọc 7.300 MB/s Chuyên Game)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2790000,
    "oldPrice": 3010000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 38,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD WD Black SN850X 1TB PCIe Gen4 NVMe (Đọc 7.300 MB/s Chuyên Game). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn giao tiếp": "PCIe Gen 4.0 x4",
      "Tốc độ đọc": "7,300 MB/s",
      "Công nghệ": "Game Mode 2.0 tối ưu hóa tốc độ load cảnh game"
    }
  },
  {
    "id": "ssd-007",
    "name": "SSD WD Black SN850X 2TB PCIe Gen4 NVMe (Đọc 7.300 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 4490000,
    "oldPrice": 4940000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 47,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD WD Black SN850X 2TB PCIe Gen4 NVMe (Đọc 7.300 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Dung lượng": "2TB thả ga cài đặt hơn 30 game AAA",
      "Tốc độ đọc ghi": "7,300 / 6,600 MB/s"
    }
  },
  {
    "id": "ssd-008",
    "name": "SSD Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (Đọc 7.000 MB/s, Ghi 6.000 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2490000,
    "oldPrice": 2690000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 56,
    "stock": 26,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (Đọc 7.000 MB/s, Ghi 6.000 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Bộ điều khiển": "Phison E18 Controller cao cấp",
      "Tản nhiệt": "Miếng tản nhôm graphene siêu mỏng"
    }
  },
  {
    "id": "ssd-009",
    "name": "SSD Crucial T705 1TB PCIe Gen5 NVMe (Đọc Kỷ Lục 14.500 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 5490000,
    "oldPrice": 6150000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 65,
    "stock": 30,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Crucial T705 1TB PCIe Gen5 NVMe (Đọc Kỷ Lục 14.500 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn kết nối": "PCIe Gen 5.0 x4 thế hệ mới nhất",
      "Tốc độ đọc": "14,500 MB/s nhanh gấp đôi Gen 4",
      "Độ bền": "600 TBW"
    }
  },
  {
    "id": "ssd-010",
    "name": "SSD Crucial P3 Plus 1TB M.2 PCIe Gen4 NVMe (Đọc 5.000 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1790000,
    "oldPrice": 1970000,
    "discount": 10,
    "rating": 4.9,
    "reviewCount": 74,
    "stock": 34,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Crucial P3 Plus 1TB M.2 PCIe Gen4 NVMe (Đọc 5.000 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn giao tiếp": "PCIe Gen 4.0 NVMe",
      "Tốc độ đọc": "5,000 MB/s",
      "Giá trị": "SSD Gen4 1TB có p/p tốt nhất thị trường"
    }
  },
  {
    "id": "ssd-011",
    "name": "SSD Crucial P3 Plus 2TB M.2 PCIe Gen4 NVMe",
    "category": "ssd",
    "category_id": "ssd",
    "price": 3190000,
    "oldPrice": 3570000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 83,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Crucial P3 Plus 2TB M.2 PCIe Gen4 NVMe. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Dung lượng": "2TB lưu trữ dữ liệu khổng lồ",
      "Tốc độ đọc": "5,000 MB/s"
    }
  },
  {
    "id": "ssd-012",
    "name": "SSD Kioxia Exceria Pro 1TB PCIe Gen4 x4 NVMe (Made in Japan)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2190000,
    "oldPrice": 2370000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 92,
    "stock": 17,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Kioxia Exceria Pro 1TB PCIe Gen4 x4 NVMe (Made in Japan). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Xuất xứ": "Sản xuất tại Nhật Bản bởi tập đoàn Kioxia (Toshiba Memory)",
      "Tốc độ đọc": "7,300 MB/s"
    }
  },
  {
    "id": "ssd-013",
    "name": "SSD Lexar NM790 2TB M.2 2280 PCIe Gen 4x4 (Đọc 7.400 MB/s, Ghi 6.500 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 3890000,
    "oldPrice": 4280000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 101,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Lexar NM790 2TB M.2 2280 PCIe Gen 4x4 (Đọc 7.400 MB/s, Ghi 6.500 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn giao tiếp": "PCIe Gen 4x4 HMB",
      "Tốc độ đọc": "7,400 MB/s",
      "Tương thích": "Hoạt động cực mát trên PC và PS5"
    }
  },
  {
    "id": "ssd-014",
    "name": "SSD Kingston NV2 500GB PCIe 4.0 NVMe M.2 (Đọc 3.500 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1090000,
    "oldPrice": 1180000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 110,
    "stock": 25,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Kingston NV2 500GB PCIe 4.0 NVMe M.2 (Đọc 3.500 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Dung lượng": "500GB",
      "Chuẩn cắm": "M.2 2280 NVMe",
      "Phù hợp": "Cài Windows và phần mềm văn phòng, đồ họa cơ bản"
    }
  },
  {
    "id": "ssd-015",
    "name": "SSD Kingston NV2 1TB PCIe 4.0 NVMe M.2",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1690000,
    "oldPrice": 1890000,
    "discount": 12,
    "rating": 5,
    "reviewCount": 119,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Kingston NV2 1TB PCIe 4.0 NVMe M.2. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Dung lượng": "1TB",
      "Tốc độ đọc": "3,500 MB/s",
      "Bảo hành": "3 năm chính hãng"
    }
  },
  {
    "id": "ssd-016",
    "name": "SSD WD Blue SN580 1TB PCIe Gen4 NVMe (Đọc 4.150 MB/s nCache 4.0)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1890000,
    "oldPrice": 2080000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 128,
    "stock": 33,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD WD Blue SN580 1TB PCIe Gen4 NVMe (Đọc 4.150 MB/s nCache 4.0). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn": "PCIe Gen 4.0 x4",
      "Tốc độ": "4,150 MB/s",
      "Tính năng": "Công nghệ nCache 4.0 sao chép file lớn không bị tụt tốc"
    }
  },
  {
    "id": "ssd-017",
    "name": "SSD Samsung 870 EVO 1TB SATA III 2.5 inch (Đọc 560 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2290000,
    "oldPrice": 2560000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 137,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Samsung 870 EVO 1TB SATA III 2.5 inch (Đọc 560 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "2.5 inch chuẩn SATA 3",
      "Tương thích": "Nâng cấp máy tính bàn cũ và laptop đời cũ không có khe M.2"
    }
  },
  {
    "id": "ssd-018",
    "name": "SSD Samsung 870 EVO 500GB SATA III 2.5 inch",
    "category": "ssd",
    "category_id": "ssd",
    "price": 1450000,
    "oldPrice": 1570000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 146,
    "stock": 16,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Samsung 870 EVO 500GB SATA III 2.5 inch. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "2.5 inch",
      "Tốc độ đọc ghi": "560 MB/s / 530 MB/s"
    }
  },
  {
    "id": "ssd-019",
    "name": "SSD Di Động Samsung T7 Shield 1TB Chống Nước Chống Rơi Type-C (Đọc 1.050 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2790000,
    "oldPrice": 3070000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 25,
    "stock": 20,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Di Động Samsung T7 Shield 1TB Chống Nước Chống Rơi Type-C (Đọc 1.050 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Thiết kế": "Vỏ bọc cao su chống nước bụi chuẩn IP65, chịu va đập rơi từ 3m",
      "Tốc độ": "1,050 MB/s qua cổng USB 3.2 Gen 2"
    }
  },
  {
    "id": "ssd-020",
    "name": "SSD Di Động SanDisk Extreme Portable V2 1TB Type-C (Đọc 1.050 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2690000,
    "oldPrice": 2910000,
    "discount": 8,
    "rating": 4.7,
    "reviewCount": 34,
    "stock": 24,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Di Động SanDisk Extreme Portable V2 1TB Type-C (Đọc 1.050 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "Bỏ túi siêu gọn kèm móc khóa carabiner",
      "Bảo mật": "Mã hóa phần cứng AES 256-bit"
    }
  },
  {
    "id": "ssd-021",
    "name": "SSD Corsair MP600 PRO LPX 1TB PCIe Gen4 M.2 Tản Nhiệt Nhôm Đen",
    "category": "ssd",
    "category_id": "ssd",
    "price": 2690000,
    "oldPrice": 3010000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 43,
    "stock": 28,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Corsair MP600 PRO LPX 1TB PCIe Gen4 M.2 Tản Nhiệt Nhôm Đen. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Tốc độ đọc": "7,100 MB/s",
      "Tản nhiệt": "Khối nhôm tản nhiệt thấp tối ưu hóa cho PS5 và khe hẹp"
    }
  },
  {
    "id": "l360-001",
    "name": "[New 100%] Dell Inspiron 7440 Plus 2024 (Core i5-12450H, 16GB, 512GB, Intel Iris Xe Graphics, 14\" FHD+)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17000000,
    "oldPrice": 19040000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 15,
    "stock": 5,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2024/10/dell-inspiron-14-plus-7440-2024-2tmobile-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2024/10/dell-inspiron-14-plus-7440-2024-2tmobile-247x247.jpg"
    ],
    "description": "Sản phẩm [New 100%] Dell Inspiron 7440 Plus 2024 (Core i5-12450H, 16GB, 512GB, Intel Iris Xe Graphics, 14\" FHD+) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-12450H (8 nhân 12 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-002",
    "name": "[New 100%] Lenovo IdeaPad Slim 3 14SE (2025) (Ryzen 7 8745HS, AMD 780M, 16GB, 512GB, 14 FHD IPS) - (Xiaoxin 14c AHP10)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14500000,
    "oldPrice": 15950000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 22,
    "stock": 8,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/04/1-1-1-300x300-1-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/04/1-1-1-300x300-1-247x247.png"
    ],
    "description": "Sản phẩm [New 100%] Lenovo IdeaPad Slim 3 14SE (2025) (Ryzen 7 8745HS, AMD 780M, 16GB, 512GB, 14 FHD IPS) - (Xiaoxin 14c AHP10) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 7 8745HS (8C/16T)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-003",
    "name": "[New 100%] Lenovo Lecoo 14 2025 N155C (i5 13420H/ RAM 16GB /SSD 1TB /14\" 2.2K 60Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17990000,
    "oldPrice": 18890000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 29,
    "stock": 11,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/10/Lecoo-14-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/10/Lecoo-14-1-247x247.jpg"
    ],
    "description": "Sản phẩm [New 100%] Lenovo Lecoo 14 2025 N155C (i5 13420H/ RAM 16GB /SSD 1TB /14\" 2.2K 60Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-13420H (8 nhân, 12 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-004",
    "name": "Lenovo Legion R9000P 2023 (R7-7745HX / 16GB / 512GB / RTX 3050 / 16″ 2.5K 240 Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 23990000,
    "oldPrice": 25910000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 36,
    "stock": 14,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-6-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-6-247x247.png"
    ],
    "description": "Sản phẩm Lenovo Legion R9000P 2023 (R7-7745HX / 16GB / 512GB / RTX 3050 / 16″ 2.5K 240 Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 3050 4GB/6GB",
      "Màn hình": "16 inch 2.5K (2560x1600) 240Hz 100% sRGB",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-005",
    "name": "HP EliteBook 830 G8 (Core i5-1145G7 / Ram 8GB / SSD 256Gb / 13.3″ FHD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 8900000,
    "oldPrice": 9970000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 43,
    "stock": 17,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/07/6988-laptop-hp-elitebook-830-g8-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/07/6988-laptop-hp-elitebook-830-g8-1-247x247.jpg"
    ],
    "description": "Sản phẩm HP EliteBook 830 G8 (Core i5-1145G7 / Ram 8GB / SSD 256Gb / 13.3″ FHD) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-006",
    "name": "Laptop Dell Vostro 5502 (Core i5-1135G7 / 16GB / 512GB /15.6\" FHD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11200000,
    "oldPrice": 12320000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 50,
    "stock": 20,
    "isFeatured": true,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/07/Thiet-ke-chua-co-ten-2025-07-03T160731.835-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/07/Thiet-ke-chua-co-ten-2025-07-03T160731.835-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Vostro 5502 (Core i5-1135G7 / 16GB / 512GB /15.6\" FHD) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-1135G7 Iris Xe",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-007",
    "name": "Dell XPS 15 9550 ( I7 - 6700HQ / 8 GB / SSD 256 GB / GTX 960M / 15.6 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 9700000,
    "oldPrice": 10480000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 57,
    "stock": 23,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/06/Dell-XPS-15-9500_5-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/06/Dell-XPS-15-9500_5-247x247.jpg"
    ],
    "description": "Sản phẩm Dell XPS 15 9550 ( I7 - 6700HQ / 8 GB / SSD 256 GB / GTX 960M / 15.6 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "NVIDIA GeForce GTX 960M 2GB",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-008",
    "name": "[New 100%] Laptop HP 15-FD0133 (Intel Core™ i3-1315U | 8GB RAM | 256GB SSD | 15.6\" FHD | WIN11 Bản Quyền | Màu Bạc)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15000000,
    "oldPrice": 16500000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 64,
    "stock": 26,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2026/03/Thiet-ke-chua-co-ten-2026-03-18T174755.183-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2026/03/Thiet-ke-chua-co-ten-2026-03-18T174755.183-247x247.png"
    ],
    "description": "Sản phẩm [New 100%] Laptop HP 15-FD0133 (Intel Core™ i3-1315U | 8GB RAM | 256GB SSD | 15.6\" FHD | WIN11 Bản Quyền | Màu Bạc) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-009",
    "name": "Acer Nitro 5 AN515 57-536Q",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12990000,
    "oldPrice": 14550000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 71,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-32-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-32-247x247.jpg"
    ],
    "description": "Sản phẩm Acer Nitro 5 AN515 57-536Q được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-010",
    "name": "Asus TUF Gaming F15 FX506HF (i5 11400H/8GB/512GB/4GB RTX2050/144Hz/Win11)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13499000,
    "oldPrice": 14580000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 78,
    "stock": 7,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/10/Thiet-ke-chua-co-ten-11-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/10/Thiet-ke-chua-co-ten-11-247x247.png"
    ],
    "description": "Sản phẩm Asus TUF Gaming F15 FX506HF (i5 11400H/8GB/512GB/4GB RTX2050/144Hz/Win11) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 2050 4GB GDDR6",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-011",
    "name": "Laptop Asus Rog Strix G15 G513IE-HN246W",
    "category": "laptop",
    "category_id": "laptop",
    "price": 16490000,
    "oldPrice": 17310000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 85,
    "stock": 10,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-42-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-42-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Asus Rog Strix G15 G513IE-HN246W được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-012",
    "name": "Acer Nitro 5 Tiger AN515-58-5046 (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 16990000,
    "oldPrice": 18690000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 92,
    "stock": 13,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-17-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-17-247x247.jpg"
    ],
    "description": "Sản phẩm Acer Nitro 5 Tiger AN515-58-5046 (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-013",
    "name": "[New 100%] Lenovo Legion R9000P 2025 (Ryzen 9 8945HX, 32GB, 1TB, RTX 5060 8GB, 16\" 2K+ 240Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 35990000,
    "oldPrice": 40310000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 99,
    "stock": 16,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/05/Screenshot_243-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/05/Screenshot_243-247x247.png"
    ],
    "description": "Sản phẩm [New 100%] Lenovo Legion R9000P 2025 (Ryzen 9 8945HX, 32GB, 1TB, RTX 5060 8GB, 16\" 2K+ 240Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 9 8945HX AI High Performance",
      "RAM": "32GB DDR4/DDR5 Dual Channel",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 5060 8GB GDDR6",
      "Màn hình": "16 inch 2.5K (2560x1600) 240Hz 100% sRGB",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-014",
    "name": "Acer Predator Helios Neo 16 2024 (i9 14900HX / RAM 16GB /SSD 1TB / RTX 4060 /2.5K 240Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 33500000,
    "oldPrice": 36850000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 106,
    "stock": 19,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/06/acer-predator-helios-neo-16-phn16-72-91rf-undefined-Dpw-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/06/acer-predator-helios-neo-16-phn16-72-91rf-undefined-Dpw-247x247.jpg"
    ],
    "description": "Sản phẩm Acer Predator Helios Neo 16 2024 (i9 14900HX / RAM 16GB /SSD 1TB / RTX 4060 /2.5K 240Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i9-14900HX (24C/32T)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "Màn hình": "16 inch 2.5K (2560x1600) 240Hz 100% sRGB",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-015",
    "name": "ASUS ROG Zephyrus G14 2024 (R9 8945HS/ 16GB/ 1TB/ RTX 4050 6GB/ 14in 2.8K OLED 120Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 34990000,
    "oldPrice": 36740000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 113,
    "stock": 22,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/06/Thiet-ke-chua-co-ten-2025-06-07T153751.985-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/06/Thiet-ke-chua-co-ten-2025-06-07T153751.985-247x247.png"
    ],
    "description": "Sản phẩm ASUS ROG Zephyrus G14 2024 (R9 8945HS/ 16GB/ 1TB/ RTX 4050 6GB/ 14in 2.8K OLED 120Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 9 8945HS với AMD Ryzen AI",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "Màn hình": "14 inch 2.8K OLED 120Hz 100% DCI-P3",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-016",
    "name": "Acer Nitro V ANV15-51-57B2 (I5-13420H/16GB/512GB PCIE/VGA 6GB RTX4050)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 23000000,
    "oldPrice": 24840000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 120,
    "stock": 25,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/05/2958_acer_nitro_5_an515_01-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/05/2958_acer_nitro_5_an515_01-247x247.jpg"
    ],
    "description": "Sản phẩm Acer Nitro V ANV15-51-57B2 (I5-13420H/16GB/512GB PCIE/VGA 6GB RTX4050) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-017",
    "name": "ASUS ROG Strix G16 2025 (Ryzen 9-9955HX| 16GB RAM| 1TB SSD| RTX 5060)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 38990000,
    "oldPrice": 43670000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 17,
    "stock": 28,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/06/asus-rog-strix-g16-2025-undefined-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/06/asus-rog-strix-g16-2025-undefined-247x247.jpg"
    ],
    "description": "Sản phẩm ASUS ROG Strix G16 2025 (Ryzen 9-9955HX| 16GB RAM| 1TB SSD| RTX 5060) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 9-9955HX Thế hệ mới",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "NVIDIA GeForce RTX 5060 8GB GDDR6",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-018",
    "name": "Laptop Dell Latitude 7280 (I5 - 7300U/8 GB/SSD 256 GB/12.5 Inche HD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 4800000,
    "oldPrice": 5280000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 24,
    "stock": 6,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/01/laptop-hai-phong2-3-510x383-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/01/laptop-hai-phong2-3-510x383-1-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Latitude 7280 (I5 - 7300U/8 GB/SSD 256 GB/12.5 Inche HD) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-019",
    "name": "Laptop Dell Latitude 5490 ( I5 - 8350U / 8 GB / SSD 256 GB / R / 14.0 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 6499000,
    "oldPrice": 7020000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 31,
    "stock": 9,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/12/399951256_23968584606118526_5344358144767398099_n-510x383-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/12/399951256_23968584606118526_5344358144767398099_n-510x383-1-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Latitude 5490 ( I5 - 8350U / 8 GB / SSD 256 GB / R / 14.0 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-020",
    "name": "Dell Latitude E5480 ( I5 - 6300U / 8 GB / SSD 256 GB / ON / 14.0 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 5200000,
    "oldPrice": 5720000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 38,
    "stock": 12,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2021/08/images-6.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2021/08/images-6.jpg"
    ],
    "description": "Sản phẩm Dell Latitude E5480 ( I5 - 6300U / 8 GB / SSD 256 GB / ON / 14.0 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-021",
    "name": "Dell Latitude 7300 ( I5 - 8365U / 8 GB / SSD 256 GB / ON / 13.3 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 6800000,
    "oldPrice": 7620000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 45,
    "stock": 15,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/06/1-4-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/06/1-4-247x247.jpg"
    ],
    "description": "Sản phẩm Dell Latitude 7300 ( I5 - 8365U / 8 GB / SSD 256 GB / ON / 13.3 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-022",
    "name": "Dell Latitude E7410 (i5-10310U/ Ram 16GB/ SSD 256GB/ FHD + 60Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 8990000,
    "oldPrice": 9710000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 52,
    "stock": 18,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/05/z6922757488828_a0f9aae9de6ce411d823649a1276a871-510x383-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/05/z6922757488828_a0f9aae9de6ce411d823649a1276a871-510x383-1-247x247.jpg"
    ],
    "description": "Sản phẩm Dell Latitude E7410 (i5-10310U/ Ram 16GB/ SSD 256GB/ FHD + 60Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-10310U vPro",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-023",
    "name": "Dell E7270/ i5-6200U/ Ram 8GB/ SSD 256GB/ HD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 4500000,
    "oldPrice": 4730000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 59,
    "stock": 21,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/05/sua-chua-laptop-hai-phong-2-1-scaled-510x287-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/05/sua-chua-laptop-hai-phong-2-1-scaled-510x287-1-247x247.jpg"
    ],
    "description": "Sản phẩm Dell E7270/ i5-6200U/ Ram 8GB/ SSD 256GB/ HD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5 Gen 6th",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-024",
    "name": "Laptop Dell Precision 7510",
    "category": "laptop",
    "category_id": "laptop",
    "price": 7990000,
    "oldPrice": 8790000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 66,
    "stock": 24,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2021/07/Thiet-ke-chua-co-ten-14-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2021/07/Thiet-ke-chua-co-ten-14-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7510 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-025",
    "name": "Laptop Dell Precision 7520",
    "category": "laptop",
    "category_id": "laptop",
    "price": 6990000,
    "oldPrice": 7830000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 73,
    "stock": 27,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2021/07/Thiet-ke-chua-co-ten-14-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2021/07/Thiet-ke-chua-co-ten-14-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7520 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-026",
    "name": "Laptop Dell Precision 7530",
    "category": "laptop",
    "category_id": "laptop",
    "price": 9800000,
    "oldPrice": 10780000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 80,
    "stock": 5,
    "isFeatured": true,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/04/Thiet-ke-chua-co-ten-18-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/04/Thiet-ke-chua-co-ten-18-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7530 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-027",
    "name": "Laptop Dell Precision 7540",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13000000,
    "oldPrice": 13650000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 87,
    "stock": 8,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/01/5b84c5ab8d970-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/01/5b84c5ab8d970-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7540 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-028",
    "name": "Laptop Dell Precision 7550",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14990000,
    "oldPrice": 16190000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 94,
    "stock": 11,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-23-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-23-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7550 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-029",
    "name": "Laptop Dell Precision 7560",
    "category": "laptop",
    "category_id": "laptop",
    "price": 22500000,
    "oldPrice": 25200000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 101,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-85-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-85-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7560 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-030",
    "name": "Laptop Dell Precision 5510",
    "category": "laptop",
    "category_id": "laptop",
    "price": 9290000,
    "oldPrice": 10220000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 108,
    "stock": 17,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-15-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-15-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5510 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-031",
    "name": "Laptop Dell Precision 5520",
    "category": "laptop",
    "category_id": "laptop",
    "price": 9490000,
    "oldPrice": 10250000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 115,
    "stock": 20,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-15-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-15-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5520 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-032",
    "name": "Laptop Dell Precision 5530",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11490000,
    "oldPrice": 12640000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 122,
    "stock": 23,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/05/Thiet-ke-chua-co-ten-16-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/05/Thiet-ke-chua-co-ten-16-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5530 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-033",
    "name": "Laptop Dell Precision 5540",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14890000,
    "oldPrice": 16680000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 19,
    "stock": 26,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5540 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-034",
    "name": "Laptop Dell Precision 5550 (Core i7-10750H, 16GB, 512GB, Nvidia Quadro T1000, 15.6\" FHD+)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15990000,
    "oldPrice": 17270000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 26,
    "stock": 29,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-24-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-24-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5550 (Core i7-10750H, 16GB, 512GB, Nvidia Quadro T1000, 15.6\" FHD+) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "NVIDIA Quadro T1000 4GB GDDR5",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-035",
    "name": "Laptop Dell Precision 5560 (i7-11800H/ 16GB / 512GB / Quadro T1200 4G / 15.6” FHD+)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18490000,
    "oldPrice": 19410000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 33,
    "stock": 7,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-94-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-94-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 5560 (i7-11800H/ 16GB / 512GB / Quadro T1200 4G / 15.6” FHD+) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-11800H (8 nhân 16 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "NVIDIA Quadro T1200 4GB GDDR6 Chuyên Đồ Họa",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-036",
    "name": "Laptop Dell Precision 7670 2022",
    "category": "laptop",
    "category_id": "laptop",
    "price": 30590000,
    "oldPrice": 33650000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 40,
    "stock": 10,
    "isFeatured": true,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-86-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/02/Thiet-ke-chua-co-ten-86-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Precision 7670 2022 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "2.2kg - 2.5kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-037",
    "name": "Laptop Dell Inspiron 15 3511 ( I5 - 1135G7 / 8 GB / SSD 256 GB / 15.6 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 10500000,
    "oldPrice": 11760000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 47,
    "stock": 13,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/06/Thiet-ke-chua-co-ten-4-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/06/Thiet-ke-chua-co-ten-4-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Inspiron 15 3511 ( I5 - 1135G7 / 8 GB / SSD 256 GB / 15.6 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "15.6 inch Full HD (1920x1080) Anti-glare",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-038",
    "name": "[Mới 100%] - Asus Zenbook Q409ZA (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14190000,
    "oldPrice": 15610000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 54,
    "stock": 16,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-19-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/09/Thiet-ke-chua-co-ten-19-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Asus Zenbook Q409ZA (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-039",
    "name": "Dell Inspiron 14 5420 (Core i5-1240P, 16GB, 512GB, Iris Xe Graphics, Màn 14\" FHD IPS)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13000000,
    "oldPrice": 13650000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 61,
    "stock": 19,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-45-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-45-247x247.png"
    ],
    "description": "Sản phẩm Dell Inspiron 14 5420 (Core i5-1240P, 16GB, 512GB, Iris Xe Graphics, Màn 14\" FHD IPS) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-1240P (12 nhân 16 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-040",
    "name": "[New 100%] HP Envy x360 14-es0033dx ( i7 1355U/16GB 1TB SDD / 14in FHD Touch/ new seal USA)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18990000,
    "oldPrice": 20510000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 68,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/08/HP-ENVY-x360-14-es0033dx-Corei-7-13th-GEN-1355U-Intel®-Iris®-X-Integrated-Graphics-14″-FHD-Laptop-6910-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/08/HP-ENVY-x360-14-es0033dx-Corei-7-13th-GEN-1355U-Intel®-Iris®-X-Integrated-Graphics-14″-FHD-Laptop-6910-247x247.jpg"
    ],
    "description": "Sản phẩm [New 100%] HP Envy x360 14-es0033dx ( i7 1355U/16GB 1TB SDD / 14in FHD Touch/ new seal USA) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-1355U (10 nhân 12 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-041",
    "name": "Dell Inspiron 16 5620 (Core i5-1240P, 16GB, 512GB, Iris Xe Graphics, 16\" FHD+ WVA)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15500000,
    "oldPrice": 17360000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 75,
    "stock": 25,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-66-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-66-247x247.jpg"
    ],
    "description": "Sản phẩm Dell Inspiron 16 5620 (Core i5-1240P, 16GB, 512GB, Iris Xe Graphics, 16\" FHD+ WVA) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i5-1240P (12 nhân 16 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "16.0 inch FHD+/2K+ viền siêu mỏng tỉ lệ 16:10",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-042",
    "name": "[Mới 100%] Asus Zenbook 14X OLED Q410VA (Core i5-13500H, 8GB, 512GB, 14.5” 2K+ OLED Touch 120Hz)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17590000,
    "oldPrice": 19350000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 82,
    "stock": 28,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-4-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-4-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100%] Asus Zenbook 14X OLED Q410VA (Core i5-13500H, 8GB, 512GB, 14.5” 2K+ OLED Touch 120Hz) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14 inch 2.8K OLED 120Hz 100% DCI-P3",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-043",
    "name": "[New 100%] Dell Inspiron 16 5640 N6I7512W1 (Core 7 150U, 16GB, 1TB, MX570A 2GB, 16\" 2K+)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 29499000,
    "oldPrice": 31860000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 89,
    "stock": 6,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/03/laptop_dell_inspiron_16_5640_mac24h-247x247.jpeg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/03/laptop_dell_inspiron_16_5640_mac24h-247x247.jpeg"
    ],
    "description": "Sản phẩm [New 100%] Dell Inspiron 16 5640 N6I7512W1 (Core 7 150U, 16GB, 1TB, MX570A 2GB, 16\" 2K+) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "NVIDIA GeForce MX570A 2GB GDDR6",
      "Màn hình": "16 inch 2.5K (2560x1600) 240Hz 100% sRGB",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-044",
    "name": "Dell Inspiron 16 Plus 7610 Core i7-11800H RAM 16GB SSD 1TB 16 inch 3K",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17900000,
    "oldPrice": 19690000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 96,
    "stock": 9,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-41-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/08/Thiet-ke-chua-co-ten-41-247x247.png"
    ],
    "description": "Sản phẩm Dell Inspiron 16 Plus 7610 Core i7-11800H RAM 16GB SSD 1TB 16 inch 3K được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-11800H (8 nhân 16 luồng)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "16 inch 3K (3072x1920) IPS viền siêu mỏng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-045",
    "name": "[Mới 100%] - HP Pavilion x360 2-in-1 laptop 14-ek0033dx (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15890000,
    "oldPrice": 17800000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 103,
    "stock": 12,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-5-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-5-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - HP Pavilion x360 2-in-1 laptop 14-ek0033dx (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-046",
    "name": "[Mới 100%] - HP Pavilion x360 14-ek0013dx (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11690000,
    "oldPrice": 12630000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 110,
    "stock": 15,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-41-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-41-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - HP Pavilion x360 14-ek0013dx (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-047",
    "name": "[Mới 100% ] Laptop Dell Inspiron 14 Plus 7430 (Core i7-13620H, Ram 16GB, SSD 1TB, 14inch 2.5K, Win 11)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 20490000,
    "oldPrice": 21510000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 117,
    "stock": 18,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/rtuzw0me-1278-dell-inspiron-14-plus-7430-2023-core-i7-13620h-ram-16gb-ssd-1tb-14-2-5k-win-11-new-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100% ] Laptop Dell Inspiron 14 Plus 7430 (Core i7-13620H, Ram 16GB, SSD 1TB, 14inch 2.5K, Win 11) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-13620H (10 cores, up to 4.9GHz)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "1TB NVMe PCIe M.2 SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-048",
    "name": "Laptop Dell Inspiron 7435 (2-in-1) Ryzen 5 7530U RAM 8GB SSD 512GB 14 inch FHD+",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13590000,
    "oldPrice": 14950000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 124,
    "stock": 21,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-5-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-5-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell Inspiron 7435 (2-in-1) Ryzen 5 7530U RAM 8GB SSD 512GB 14 inch FHD+ được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "AMD Ryzen 5 7530U (6C/12T, up to 4.5GHz)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-049",
    "name": "[Mới 100%] Asus VivoBook A515EA",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13900000,
    "oldPrice": 15570000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 21,
    "stock": 24,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/08/0003_asus-vivobook-a515ea-l12033w_8a1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/08/0003_asus-vivobook-a515ea-l12033w_8a1-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] Asus VivoBook A515EA được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-050",
    "name": "Laptop Dell XPS 9360 ( I5 - 8250U / 8 GB / SSD 256 GB / ON / 13.3 Inche - FHD )",
    "category": "laptop",
    "category_id": "laptop",
    "price": 16500000,
    "oldPrice": 18150000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 28,
    "stock": 27,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2021/08/Dell-XPS-13-9360-a1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2021/08/Dell-XPS-13-9360-a1-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Dell XPS 9360 ( I5 - 8250U / 8 GB / SSD 256 GB / ON / 13.3 Inche - FHD ) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-051",
    "name": "Laptop Dell XPS 13 9370",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11390000,
    "oldPrice": 11960000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 35,
    "stock": 5,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-50-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-50-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell XPS 13 9370 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-052",
    "name": "Dell XPS 13 9380 (2019)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11990000,
    "oldPrice": 12950000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 42,
    "stock": 8,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/06/Thiet-ke-chua-co-ten-48-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/06/Thiet-ke-chua-co-ten-48-247x247.png"
    ],
    "description": "Sản phẩm Dell XPS 13 9380 (2019) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-053",
    "name": "Laptop Dell XPS 13 7390 - Intel Core i7",
    "category": "laptop",
    "category_id": "laptop",
    "price": 10500000,
    "oldPrice": 11760000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 49,
    "stock": 11,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-10-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/07/Thiet-ke-chua-co-ten-10-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell XPS 13 7390 - Intel Core i7 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-054",
    "name": "Laptop Dell XPS 13 9310",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15990000,
    "oldPrice": 17590000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 56,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-48-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-48-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell XPS 13 9310 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-055",
    "name": "Laptop Dell XPS 13 9305",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15990000,
    "oldPrice": 17270000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 63,
    "stock": 17,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-47-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/09/Thiet-ke-chua-co-ten-47-247x247.png"
    ],
    "description": "Sản phẩm Laptop Dell XPS 13 9305 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-056",
    "name": "Dell XPS 13 9315 (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 19590000,
    "oldPrice": 21550000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 70,
    "stock": 20,
    "isFeatured": true,
    "isNew": false,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-67-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-67-247x247.jpg"
    ],
    "description": "Sản phẩm Dell XPS 13 9315 (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-057",
    "name": "DELL XPS 13 Plus 9320 (2022)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 22990000,
    "oldPrice": 25750000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 77,
    "stock": 23,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/Thiet-ke-chua-co-ten-5-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/Thiet-ke-chua-co-ten-5-247x247.png"
    ],
    "description": "Sản phẩm DELL XPS 13 Plus 9320 (2022) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-058",
    "name": "Surface Laptop 3",
    "category": "laptop",
    "category_id": "laptop",
    "price": 13990000,
    "oldPrice": 15110000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 84,
    "stock": 26,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-24-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-24-247x247.jpg"
    ],
    "description": "Sản phẩm Surface Laptop 3 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-059",
    "name": "Surface Pro 7",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14490000,
    "oldPrice": 15210000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 91,
    "stock": 29,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-3-2-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/08/Thiet-ke-chua-co-ten-3-2-247x247.jpg"
    ],
    "description": "Sản phẩm Surface Pro 7 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-060",
    "name": "Laptop Surface pro 7, Surface Pro Core i7",
    "category": "laptop",
    "category_id": "laptop",
    "price": 22000000,
    "oldPrice": 24200000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 98,
    "stock": 7,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2021/09/pro-7-07-600x600-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2021/09/pro-7-07-600x600-1-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Surface pro 7, Surface Pro Core i7 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-061",
    "name": "[Mới 100%] - Surface Laptop 3 (15 inch)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14490000,
    "oldPrice": 16230000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 105,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/11/surface-laptop-3-15inch-platium-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/11/surface-laptop-3-15inch-platium-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Surface Laptop 3 (15 inch) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-062",
    "name": "[Mới 100%] - Surface Laptop 4",
    "category": "laptop",
    "category_id": "laptop",
    "price": 15990000,
    "oldPrice": 17590000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 112,
    "stock": 13,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-25-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/10/Thiet-ke-chua-co-ten-25-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Surface Laptop 4 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-063",
    "name": "[Mới 100%] - Surface Laptop 5",
    "category": "laptop",
    "category_id": "laptop",
    "price": 17990000,
    "oldPrice": 18890000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 119,
    "stock": 16,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-50-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/06/Thiet-ke-chua-co-ten-50-247x247.png"
    ],
    "description": "Sản phẩm [Mới 100%] - Surface Laptop 5 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-064",
    "name": "[Mới 100%] - Surface Laptop Go I5",
    "category": "laptop",
    "category_id": "laptop",
    "price": 11790000,
    "oldPrice": 12730000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 16,
    "stock": 19,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-44-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/12/Thiet-ke-chua-co-ten-44-247x247.jpg"
    ],
    "description": "Sản phẩm [Mới 100%] - Surface Laptop Go I5 được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Mới 100% Fullbox nguyên seal",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-065",
    "name": "(Like New) MacBook Air 2022 13 inch Apple M2 8GB RAM 256GB SSD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18490000,
    "oldPrice": 20710000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 23,
    "stock": 22,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-68-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-68-247x247.jpg"
    ],
    "description": "Sản phẩm (Like New) MacBook Air 2022 13 inch Apple M2 8GB RAM 256GB SSD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M2 chip (8-core)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-066",
    "name": "MacBook Air 2025 13 inch Apple M4 16GB RAM 256GB SSD – NEW",
    "category": "laptop",
    "category_id": "laptop",
    "price": 27990000,
    "oldPrice": 30790000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 30,
    "stock": 25,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/05/Thiet-ke-chua-co-ten-2025-05-22T180327.745-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/05/Thiet-ke-chua-co-ten-2025-05-22T180327.745-247x247.png"
    ],
    "description": "Sản phẩm MacBook Air 2025 13 inch Apple M4 16GB RAM 256GB SSD – NEW được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M4 chip (10-core)",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-067",
    "name": "[Like New] MacBook Air 2023 15 inch Apple M2 8GB RAM 256GB SSD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 20500000,
    "oldPrice": 22140000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 37,
    "stock": 28,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/04/images.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/04/images.png"
    ],
    "description": "Sản phẩm [Like New] MacBook Air 2023 15 inch Apple M2 8GB RAM 256GB SSD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M2 chip (8-core)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-068",
    "name": "MacBook Pro 2022 13 inch Apple M2 8GB RAM 256GB SSD - Like New",
    "category": "laptop",
    "category_id": "laptop",
    "price": 20900000,
    "oldPrice": 22990000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 44,
    "stock": 6,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-37-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2022/11/Thiet-ke-chua-co-ten-37-247x247.jpg"
    ],
    "description": "Sản phẩm MacBook Pro 2022 13 inch Apple M2 8GB RAM 256GB SSD - Like New được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M2 chip (8-core)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-069",
    "name": "[Like New] MacBook Air 2023 15 inch Apple M2 8GB RAM 512GB SSD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 21800000,
    "oldPrice": 24420000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 51,
    "stock": 9,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/04/images.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/04/images.png"
    ],
    "description": "Sản phẩm [Like New] MacBook Air 2023 15 inch Apple M2 8GB RAM 512GB SSD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M2 chip (8-core)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-070",
    "name": "[Like New] MacBook Air 2022 13 inch Apple M2 8GB RAM 256GB SSD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18490000,
    "oldPrice": 19970000,
    "discount": 8,
    "rating": 4.8,
    "reviewCount": 58,
    "stock": 12,
    "isFeatured": false,
    "isNew": true,
    "isSale": false,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2025/04/macbook-air-m2-bac_27fb644471d94f8eb774897a6ab437e8-247x247.webp",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/04/macbook-air-m2-bac_27fb644471d94f8eb774897a6ab437e8-247x247.webp"
    ],
    "description": "Sản phẩm [Like New] MacBook Air 2022 13 inch Apple M2 8GB RAM 256GB SSD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Apple M2 chip (8-core)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Apple Integrated GPU",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-071",
    "name": "Thinkpad X1 Nano Gen 1 (Core i7 1160G7, RAM 16GB, SSD 512GB, Intel Iris Xe Graphics, Màn 13\" 2K)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18490000,
    "oldPrice": 19410000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 65,
    "stock": 15,
    "isFeatured": true,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/07/Thiet-ke-chua-co-ten-37-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/07/Thiet-ke-chua-co-ten-37-247x247.png"
    ],
    "description": "Sản phẩm Thinkpad X1 Nano Gen 1 (Core i7 1160G7, RAM 16GB, SSD 512GB, Intel Iris Xe Graphics, Màn 13\" 2K) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "512GB NVMe PCIe SSD",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "0.9kg - 1.2kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-072",
    "name": "Laptop Lenovo ThinkBook 14 G4 IAP (21DH00B1VN) |i7 1255U |14 inch FHD",
    "category": "laptop",
    "category_id": "laptop",
    "price": 18990000,
    "oldPrice": 20890000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 72,
    "stock": 18,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-70-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-70-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Lenovo ThinkBook 14 G4 IAP (21DH00B1VN) |i7 1255U |14 inch FHD được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-1255U (10 cores, up to 4.7GHz)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-073",
    "name": "Laptop Lenovo ThinkBook 14 G4+ IAP (21CX001RVN) |i7 1260P |14 inch 2,8K IPS",
    "category": "laptop",
    "category_id": "laptop",
    "price": 26390000,
    "oldPrice": 29560000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 79,
    "stock": 21,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-70-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2023/01/Thiet-ke-chua-co-ten-70-247x247.jpg"
    ],
    "description": "Sản phẩm Laptop Lenovo ThinkBook 14 G4+ IAP (21CX001RVN) |i7 1260P |14 inch 2,8K IPS được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core i7-1260P (12 cores, 16 threads)",
      "RAM": "8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-074",
    "name": "ThinkPad X1 Carbon Gen 8 (Core i7-10610U | Ram 16Gb | SSD 256Gb | 14\" 2K WQHD)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 12999000,
    "oldPrice": 14300000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 86,
    "stock": 24,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/03/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/03/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99-247x247.jpg"
    ],
    "description": "Sản phẩm ThinkPad X1 Carbon Gen 8 (Core i7-10610U | Ram 16Gb | SSD 256Gb | 14\" 2K WQHD) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch Full HD IPS chống chói góc rộng",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-075",
    "name": "Lenovo Thinkpad X1 Carbon Gen 9 (i5-1145G7/ Ram 16GB /SSD 256GB /FHD+ Touch)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 14990000,
    "oldPrice": 15740000,
    "discount": 5,
    "rating": 4.9,
    "reviewCount": 93,
    "stock": 27,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/03/vf0snqom-1535-thinkpad-x1-carbon-gen-9-core-i5-1145g7-32gb-512gb-newseal-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/03/vf0snqom-1535-thinkpad-x1-carbon-gen-9-core-i5-1145g7-32gb-512gb-newseal-247x247.jpg"
    ],
    "description": "Sản phẩm Lenovo Thinkpad X1 Carbon Gen 9 (i5-1145G7/ Ram 16GB /SSD 256GB /FHD+ Touch) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-076",
    "name": "Thinkpad X1 Carbon Gen 7 (Core i7-10510U / RAM 16GB / SSD 256GB / Màn 14.0 inch 4K)",
    "category": "laptop",
    "category_id": "laptop",
    "price": 10990000,
    "oldPrice": 11870000,
    "discount": 8,
    "rating": 5,
    "reviewCount": 100,
    "stock": 5,
    "isFeatured": true,
    "isNew": true,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2025/03/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2025/03/a7gv07yw-935-thinkpad-x1-carbon-gen-8-i7-16gb-512gb-2k-99-247x247.jpg"
    ],
    "description": "Sản phẩm Thinkpad X1 Carbon Gen 7 (Core i7-10510U / RAM 16GB / SSD 256GB / Màn 14.0 inch 4K) được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.",
    "features": [
      "Cam kết 100% máy nguyên bản chưa qua sửa chữa",
      "Pin dung lượng cao, hoạt động ổn định và bền bỉ",
      "Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng",
      "Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột",
      "Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời"
    ],
    "specifications": {
      "CPU": "Intel Core / AMD Ryzen thế hệ tối ưu",
      "RAM": "16GB DDR4/DDR5 High Speed",
      "Ổ cứng": "256GB NVMe M.2 SSD tốc độ cao",
      "Card đồ họa": "Intel Iris Xe / AMD Radeon Graphics",
      "Màn hình": "14.0 inch 4K UHD (3840x2160) sắc nét",
      "Trọng lượng": "1.3kg - 1.7kg",
      "Tình trạng": "Lướt 99% Zin nguyên bản 100%",
      "Bảo hành": "12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày"
    }
  },
  {
    "id": "l360-077",
    "name": "Sạc Laptop Dell Type-C 65W Chính Hãng – Sạc Nhanh, An Toàn, Tương Thích Rộng",
    "category": "accessories",
    "category_id": "accessories",
    "price": 399000,
    "oldPrice": 450000,
    "discount": 12,
    "rating": 4.7,
    "reviewCount": 107,
    "stock": 8,
    "isFeatured": false,
    "isNew": false,
    "isSale": true,
    "isHot": true,
    "image": "https://laptop360.net/wp-content/uploads/2019/09/vn-11134207-7r98o-ln9u4p350j9647-247x247.webp",
    "images": [
      "https://laptop360.net/wp-content/uploads/2019/09/vn-11134207-7r98o-ln9u4p350j9647-247x247.webp"
    ],
    "description": "Sản phẩm phụ kiện chính hãng cung cấp bởi hệ thống Laptop360 Hải Phòng. Nguồn điện ổn định, sạc nhanh và an toàn tuyệt đối cho linh kiện máy tính.",
    "features": [
      "Chân cắm chắc chắn, an toàn chống cháy nổ và quá dòng",
      "Tương thích hoàn hảo với các dòng máy tính xách tay",
      "Bảo hành đổi mới 12 tháng tại Laptop360 Hải Phòng"
    ],
    "specifications": {
      "Loại phụ kiện": "Củ sạc laptop chính hãng",
      "Công suất": "65W",
      "Điện áp": "Tự điều chỉnh (PD)",
      "Chuẩn cắm": "USB Type-C Power Delivery",
      "Bảo hành": "12 tháng 1 đổi 1 tại Laptop360"
    }
  },
  {
    "id": "l360-078",
    "name": "Sạc Laptop Sony Vaio 19.5V 3.9A Chính Hãng",
    "category": "accessories",
    "category_id": "accessories",
    "price": 149000,
    "oldPrice": 160000,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 114,
    "stock": 11,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2019/06/a-1-247x247.jpg",
    "images": [
      "https://laptop360.net/wp-content/uploads/2019/06/a-1-247x247.jpg"
    ],
    "description": "Sản phẩm phụ kiện chính hãng cung cấp bởi hệ thống Laptop360 Hải Phòng. Nguồn điện ổn định, sạc nhanh và an toàn tuyệt đối cho linh kiện máy tính.",
    "features": [
      "Chân cắm chắc chắn, an toàn chống cháy nổ và quá dòng",
      "Tương thích hoàn hảo với các dòng máy tính xách tay",
      "Bảo hành đổi mới 12 tháng tại Laptop360 Hải Phòng"
    ],
    "specifications": {
      "Loại phụ kiện": "Củ sạc laptop chính hãng",
      "Công suất": "Chuẩn zin hãng",
      "Điện áp": "19.5V - 3.9A",
      "Chuẩn cắm": "Chân kim chuyên dụng",
      "Bảo hành": "12 tháng 1 đổi 1 tại Laptop360"
    }
  },
  {
    "id": "l360-079",
    "name": "Sạc Laptop Dell 65W Chân Tròn To 7.4x5.0mm Chính Hãng – Adapter Dell Củ Thường, An Toàn, Bền Bỉ",
    "category": "accessories",
    "category_id": "accessories",
    "price": 169000,
    "oldPrice": 180000,
    "discount": 8,
    "rating": 4.9,
    "reviewCount": 121,
    "stock": 14,
    "isFeatured": false,
    "isNew": true,
    "isSale": true,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2019/09/sac-dell-19v-334a-lap24h-247x247.webp",
    "images": [
      "https://laptop360.net/wp-content/uploads/2019/09/sac-dell-19v-334a-lap24h-247x247.webp"
    ],
    "description": "Sản phẩm phụ kiện chính hãng cung cấp bởi hệ thống Laptop360 Hải Phòng. Nguồn điện ổn định, sạc nhanh và an toàn tuyệt đối cho linh kiện máy tính.",
    "features": [
      "Chân cắm chắc chắn, an toàn chống cháy nổ và quá dòng",
      "Tương thích hoàn hảo với các dòng máy tính xách tay",
      "Bảo hành đổi mới 12 tháng tại Laptop360 Hải Phòng"
    ],
    "specifications": {
      "Loại phụ kiện": "Củ sạc laptop chính hãng",
      "Công suất": "65W",
      "Điện áp": "Tự điều chỉnh (PD)",
      "Chuẩn cắm": "Chân tròn 7.4x5.0mm",
      "Bảo hành": "12 tháng 1 đổi 1 tại Laptop360"
    }
  },
  {
    "id": "l360-080",
    "name": "Sạc Laptop HP 19V 3.33A Chân Kim To 7.4x5.0mm – Công Suất 65W",
    "category": "accessories",
    "category_id": "accessories",
    "price": 169000,
    "oldPrice": 190000,
    "discount": 10,
    "rating": 5,
    "reviewCount": 18,
    "stock": 17,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://laptop360.net/wp-content/uploads/2019/09/sac-laptop-hp-195v-65w-chan-kim-to-G10364-1698037892766-247x247.png",
    "images": [
      "https://laptop360.net/wp-content/uploads/2019/09/sac-laptop-hp-195v-65w-chan-kim-to-G10364-1698037892766-247x247.png"
    ],
    "description": "Sản phẩm phụ kiện chính hãng cung cấp bởi hệ thống Laptop360 Hải Phòng. Nguồn điện ổn định, sạc nhanh và an toàn tuyệt đối cho linh kiện máy tính.",
    "features": [
      "Chân cắm chắc chắn, an toàn chống cháy nổ và quá dòng",
      "Tương thích hoàn hảo với các dòng máy tính xách tay",
      "Bảo hành đổi mới 12 tháng tại Laptop360 Hải Phòng"
    ],
    "specifications": {
      "Loại phụ kiện": "Củ sạc laptop chính hãng",
      "Công suất": "65W",
      "Điện áp": "19V - 3.33A",
      "Chuẩn cắm": "Chân kim chuyên dụng",
      "Bảo hành": "12 tháng 1 đổi 1 tại Laptop360"
    }
  },
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
    "image": "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=1200&q=80"
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
    "name": "Màn hình ASUS ROG Swift OLED PG27AQDM (27\" 2K OLED 240Hz 0.03ms)",
    "category": "monitor",
    "category_id": "monitor",
    "price": 23990000,
    "oldPrice": 26390000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Màn hình máy tính hiển thị sắc nét, màu sắc chuẩn xác - Màn hình ASUS ROG Swift OLED PG27AQDM (27\" 2K OLED 240Hz 0.03ms). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Kích thước": "26.5 inch",
      "Tấm nền": "OLED tương phản vô cực",
      "Độ phân giải": "2K QHD (2560 x 1440)",
      "Tần số quét": "240Hz",
      "Thời gian phản hồi": "0.03ms"
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
    "name": "Chuột không dây Logitech G Pro X Superlight 2 Wireless 60g",
    "category": "mouse",
    "category_id": "mouse",
    "price": 3490000,
    "oldPrice": 3840000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Chuột máy tính độ chính xác cao, thao tác nhanh nhạy - Chuột không dây Logitech G Pro X Superlight 2 Wireless 60g. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Trọng lượng": "Chỉ 60g siêu nhẹ",
      "Mắt đọc": "Hero 2 độ phân giải 32.000 DPI",
      "Switch": "Lightforce Lai Cơ - Quang Học",
      "Tần số": "Polling rate 4000Hz mượt mà"
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
    "name": "Kit RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz White",
    "category": "ram",
    "category_id": "ram",
    "price": 4690000,
    "oldPrice": 5160000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Bộ nhớ trong RAM tốc độ cao, đa nhiệm mượt mà - Kit RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz White. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn RAM": "DDR5",
      "Dung lượng": "32GB (2x16GB)",
      "Bus": "6000MHz",
      "LED": "Capellix RGB 11 bóng siêu sáng",
      "Hỗ trợ": "Intel XMP 3.0 & AMD EXPO"
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
    "name": "SSD Samsung 990 Pro 2TB NVMe PCIe 4.0 (Đọc 7.450 MB/s, Ghi 6.900 MB/s)",
    "category": "ssd",
    "category_id": "ssd",
    "price": 4690000,
    "oldPrice": 5160000,
    "discount": 10,
    "rating": 4.7,
    "reviewCount": 20,
    "stock": 10,
    "isFeatured": true,
    "isNew": true,
    "isSale": true,
    "isHot": true,
    "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Samsung 990 Pro 2TB NVMe PCIe 4.0 (Đọc 7.450 MB/s, Ghi 6.900 MB/s). Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Chuẩn kết nối": "PCIe Gen 4.0 x4, NVMe 2.0",
      "Tốc độ đọc": "Lên tới 7,450 MB/s",
      "Tốc độ ghi": "Lên tới 6,900 MB/s",
      "Bảo hành": "5 năm chính hãng Samsung"
    }
  },
  {
    "id": "ssd-005",
    "name": "SSD Samsung 990 Pro with Heatsink 1TB PCIe 4.0 Tản Nhiệt Nhôm Chuyên PS5",
    "category": "ssd",
    "category_id": "ssd",
    "price": 3190000,
    "oldPrice": 3570000,
    "discount": 12,
    "rating": 4.8,
    "reviewCount": 29,
    "stock": 14,
    "isFeatured": false,
    "isNew": false,
    "isSale": false,
    "isHot": false,
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
    ],
    "description": "Ổ cứng SSD thể rắn tốc độ đọc ghi vượt trội, khởi động trong tích tắc - SSD Samsung 990 Pro with Heatsink 1TB PCIe 4.0 Tản Nhiệt Nhôm Chuyên PS5. Thiết kế hiện đại, độ bền vượt trội, đáp ứng tối đa hiệu năng cho công việc chuyên nghiệp và giải trí đỉnh cao. Đạt tiêu chuẩn kiểm định chất lượng nghiêm ngặt của DANGVINHPC.",
    "features": [
      "Sản phẩm chính hãng 100% nguyên seal mới xuất xưởng",
      "Chính sách bảo hành đổi mới uy tín từ nhà phân phối",
      "Được kiểm tra và chạy thử ổn định trước khi giao",
      "Hỗ trợ giao hàng hỏa tốc trong 2 giờ và ship COD toàn quốc"
    ],
    "specifications": {
      "Tích hợp tản nhiệt": "Heatsink mỏng gọn đạt chuẩn lắp trực tiếp vào PlayStation 5",
      "Tốc độ đọc": "7450 MB/s"
    }
  }
];

export const featuredProducts = products.filter((p) => p.isFeatured || p.isHot || p.isSale);
export const flashSaleProducts = products.filter((p) => p.isSale);
export const newArrivals = products.filter((p) => p.isNew);
