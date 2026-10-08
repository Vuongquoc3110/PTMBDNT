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
  stock?: number;
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
    colors?: string[];
    ramDetails?: { label: string; priceDelta: number }[];
  };
};

const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
  // ===== CPU =====
  'cpu-001': 'https://product.hstatic.net/200000722513/product/13900k_tray_02e9fc5b99cc4b0ba925d8e3d1e90c75_grande.png',
  'cpu-006': 'https://product.hstatic.net/200000722513/product/i5-14400f_8a2e4a4e5b8c4f8e9b2c3d4e5f6a7b8c.jpg',
  'cpu-007': 'https://m.media-amazon.com/images/I/51-r3FqAPEL._AC_SL1500_.jpg',
  'cpu-008': 'https://m.media-amazon.com/images/I/51grM1zcXsL._AC_SL1500_.jpg',
  'cpu-009': 'https://m.media-amazon.com/images/I/51f2hNSr-YL._AC_SL1500_.jpg',
  'cpu-010': 'https://m.media-amazon.com/images/I/51D4kFBrl9L._AC_SL1200_.jpg',
  'cpu-011': 'https://m.media-amazon.com/images/I/51qnHiRUo4L._AC_SL1500_.jpg',
  'cpu-012': 'https://m.media-amazon.com/images/I/51pW75kQ8HL._AC_SL1500_.jpg',
  'cpu-013': 'https://m.media-amazon.com/images/I/51fsd8mMYmL._AC_SL1200_.jpg',
  'cpu-014': 'https://m.media-amazon.com/images/I/51wGOJDxR5L._AC_SL1200_.jpg',
  'cpu-015': 'https://m.media-amazon.com/images/I/51hLXBfnr4L._AC_SL1200_.jpg',
  'cpu-016': 'https://m.media-amazon.com/images/I/51cS8yO-JFL._AC_SL1200_.jpg',
  'cpu-017': 'https://m.media-amazon.com/images/I/51bvDsfeURL._AC_SL1200_.jpg',
  'cpu-018': 'https://m.media-amazon.com/images/I/51KhB1mRF5L._AC_SL1000_.jpg',
  'cpu-019': 'https://m.media-amazon.com/images/I/51IrOD9fLIL._AC_SL1200_.jpg',
  'cpu-020': 'https://m.media-amazon.com/images/I/51grM1zcXsL._AC_SL1500_.jpg',
  'cpu-021': 'https://m.media-amazon.com/images/I/41lgxJxqsqL._AC_SL1200_.jpg',

  // ===== GPU =====
  'gpu-001': 'https://m.media-amazon.com/images/I/81aUr0j4RkL._AC_SL1500_.jpg',
  'gpu-006': 'https://dlcdnwebimgs.asus.com/gain/BA019F2B-A30B-4489-B2F3-B0CE30E0516D/w1000/h732',
  'gpu-007': 'https://asset.msi.com/resize/image/global/product/product_173082523830ae56e27a91b3f8d81af0c36e0e7f2a_1024.png',
  'gpu-008': 'https://m.media-amazon.com/images/I/81VBIjazMYL._AC_SL1500_.jpg',
  'gpu-009': 'https://dlcdnwebimgs.asus.com/gain/3FAF2D64-3D9A-4A5F-9B7B-1E3DC25F31F2/w1000/h732',
  'gpu-010': 'https://asset.msi.com/resize/image/global/product/product_167879825556febc59f90b0c9dcf9e4f6d92f37e4a_1024.png',
  'gpu-011': 'https://m.media-amazon.com/images/I/81r3pNAyl2L._AC_SL1500_.jpg',
  'gpu-012': 'https://m.media-amazon.com/images/I/71BcumfWKDL._AC_SL1500_.jpg',
  'gpu-013': 'https://dlcdnwebimgs.asus.com/gain/C7B5DAA5-9A44-4BAA-9AA1-1E7896C59E8D/w1000/h732',
  'gpu-014': 'https://m.media-amazon.com/images/I/71Mk8BR8GPL._AC_SL1500_.jpg',
  'gpu-015': 'https://m.media-amazon.com/images/I/81SnZXjnURL._AC_SL1500_.jpg',
  'gpu-016': 'https://m.media-amazon.com/images/I/71b5OdTO7NL._AC_SL1500_.jpg',
  'gpu-017': 'https://m.media-amazon.com/images/I/71R-TDQ6AvL._AC_SL1500_.jpg',
  'gpu-018': 'https://m.media-amazon.com/images/I/71a0J1DPFNL._AC_SL1500_.jpg',
  'gpu-019': 'https://m.media-amazon.com/images/I/71sEuvJYf8L._AC_SL1500_.jpg',
  'gpu-020': 'https://m.media-amazon.com/images/I/71uQmQo2URL._AC_SL1500_.jpg',
  'gpu-021': 'https://asset.msi.com/resize/image/global/product/product_167879844860a5ed5e19b0d3f93d55ce01cc22ee3b_1024.png',

  // ===== PC Gaming =====
  'pc-game-005': 'https://media.karousell.com/media/photos/products/2024/2/16/intel_i5_14400f__rtx_4060_cust_1708075653_7e88426d_progressive.jpg',
  'pc-game-006': 'https://m.media-amazon.com/images/I/71EDXZ8qJ9L._AC_SL1500_.jpg',
  'pc-game-007': 'https://m.media-amazon.com/images/I/71fRGH36u1L._AC_SL1500_.jpg',
  'pc-game-008': 'https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg',
  'pc-game-009': 'https://media.karousell.com/media/photos/products/2023/4/14/rog_gaming_desktop_i913900_wit_1681461530_963df001_progressive.jpg',
  'pc-game-010': 'https://down-sg.img.susercontent.com/file/sg-11134207-7reqf-m26wgnqgf8sj06',
  'pc-game-011': 'https://m.media-amazon.com/images/I/71JLgo7cNwL._AC_SL1500_.jpg',
  'pc-game-012': 'https://m.media-amazon.com/images/I/71GnGMjfURL._AC_SL1500_.jpg',
  'pc-game-013': 'https://os-jo.com/image/cache/catalog/GAMING-PCS/2024/101-1200x630.jpg',
  'pc-game-014': 'https://m.media-amazon.com/images/I/61aFfHFiYSL._AC_SL1500_.jpg',
  'pc-game-015': 'https://m.media-amazon.com/images/I/81c56LXZFPL._AC_SL1500_.jpg',
  'pc-game-016': 'https://m.media-amazon.com/images/I/71pT1aoLWvL._AC_SL1500_.jpg',
  'pc-game-017': 'https://m.media-amazon.com/images/I/81Uq5wTC1qL._AC_SL1500_.jpg',
  'pc-game-018': 'https://m.media-amazon.com/images/I/71ySV0CMJJL._AC_SL1500_.jpg',
  'pc-game-019': 'https://m.media-amazon.com/images/I/81sESJbMVUL._AC_SL1500_.jpg',
  'pc-game-020': 'https://m.media-amazon.com/images/I/618KFfH4LnL._AC_SL1500_.jpg',
  'pc-game-021': 'https://m.media-amazon.com/images/I/81+J4t3CGGL._AC_SL1500_.jpg',

  // ===== PC Văn Phòng =====
  'pc-off-003': 'https://m.media-amazon.com/images/I/71CJZa0iMCL._AC_SL1500_.jpg',
  'pc-off-004': 'https://m.media-amazon.com/images/I/61YFO1F9Y9L._AC_SL1500_.jpg',
  'pc-off-005': 'https://m.media-amazon.com/images/I/61yq1BmN1HL._AC_SL1500_.jpg',
  'pc-off-006': 'https://m.media-amazon.com/images/I/61DP+VvVUCL._AC_SL1500_.jpg',
  'pc-off-007': 'https://m.media-amazon.com/images/I/71nEBRyGURL._AC_SL1500_.jpg',
  'pc-off-008': 'https://m.media-amazon.com/images/I/71XTKFOKdoL._AC_SL1500_.jpg',
  'pc-off-009': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=904&hei=840&fmt=jpeg&qlt=90',
  'pc-off-010': 'https://m.media-amazon.com/images/I/71Vf-AiNOwL._AC_SL1500_.jpg',
  'pc-off-011': 'https://m.media-amazon.com/images/I/71nqe7+nVKL._AC_SL1500_.jpg',
  'pc-off-012': 'https://m.media-amazon.com/images/I/71J+CvxPAdL._AC_SL1500_.jpg',
  'pc-off-013': 'https://m.media-amazon.com/images/I/71HB4fUTq3L._AC_SL1500_.jpg',
  'pc-off-014': 'https://m.media-amazon.com/images/I/71i3JCpDP5L._AC_SL1500_.jpg',
  'pc-off-015': 'https://m.media-amazon.com/images/I/61J7EyAhGWL._AC_SL1500_.jpg',
  'pc-off-016': 'https://m.media-amazon.com/images/I/51q1G4TuLyL._AC_SL1500_.jpg',
  'pc-off-017': 'https://m.media-amazon.com/images/I/51QR4bUwbeL._AC_SL1500_.jpg',
  'pc-off-018': 'https://m.media-amazon.com/images/I/71CJZa0iMCL._AC_SL1500_.jpg',
  'pc-off-019': 'https://m.media-amazon.com/images/I/61RLmo6t5kL._AC_SL1500_.jpg',
  'pc-off-020': 'https://m.media-amazon.com/images/I/51lNwffYt5L._AC_SL1500_.jpg',
  'pc-off-021': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=904&hei=840&fmt=jpeg&qlt=90',

  // ===== Màn Hình =====
  'mon-005': 'https://dlcdnwebimgs.asus.com/gain/EACF3E1E-1F0D-45AB-BEFE-E9C09E8E8D6A/w1000/h732',
  'mon-006': 'https://m.media-amazon.com/images/I/81jC0sQj5dL._AC_SL1500_.jpg',
  'mon-007': 'https://m.media-amazon.com/images/I/71JN0FYwUrl._AC_SL1500_.jpg',
  'mon-008': 'https://m.media-amazon.com/images/I/71c3MiE4SQL._AC_SL1500_.jpg',
  'mon-009': 'https://m.media-amazon.com/images/I/71Gfhk4ZUwL._AC_SL1500_.jpg',
  'mon-010': 'https://m.media-amazon.com/images/I/71Lv32cWh-L._AC_SL1500_.jpg',
  'mon-011': 'https://m.media-amazon.com/images/I/71CR+q2yYkL._AC_SL1500_.jpg',
  'mon-012': 'https://asset.msi.com/resize/image/global/product/product_1701251287b6f81fcc61e18f86ddaf0a1f64dbb70e_1024.png',
  'mon-013': 'https://m.media-amazon.com/images/I/81t2uhSt-RL._AC_SL1500_.jpg',
  'mon-014': 'https://dlcdnwebimgs.asus.com/gain/FFA4D3A5-C4A4-4BA5-94C6-B2D07B1DE7F2/w1000/h732',
  'mon-015': 'https://m.media-amazon.com/images/I/71T4SSTdVHL._AC_SL1500_.jpg',
  'mon-016': 'https://m.media-amazon.com/images/I/71xxQm2hFbL._AC_SL1500_.jpg',
  'mon-017': 'https://dlcdnwebimgs.asus.com/gain/08FE993B-0C4E-4B89-B3E2-B6E16B19E8CE/w1000/h732',
  'mon-018': 'https://dlcdnwebimgs.asus.com/gain/C01D0EC0-6EE3-4CCB-8C95-4D0F57B3D3E0/w1000/h732',
  'mon-019': 'https://m.media-amazon.com/images/I/71UVrBpHqKL._AC_SL1500_.jpg',
  'mon-020': 'https://m.media-amazon.com/images/I/71Uix7CdWXL._AC_SL1500_.jpg',
  'mon-021': 'https://m.media-amazon.com/images/I/71pMLkJHNQL._AC_SL1500_.jpg',

  // ===== Bàn Phím =====
  'kb-004': 'https://m.media-amazon.com/images/I/71RUm0i6ZjL._AC_SL1500_.jpg',
  'kb-005': 'https://m.media-amazon.com/images/I/71P5bGJDm1L._AC_SL1500_.jpg',
  'kb-006': 'https://m.media-amazon.com/images/I/71ZwVK6kSeL._AC_SL1500_.jpg',
  'kb-007': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Keyboards/CH-912A01A-NA/Gallery/K100_01.webp',
  'kb-008': 'https://m.media-amazon.com/images/I/71ysN9XjFOL._AC_SL1500_.jpg',
  'kb-009': 'https://m.media-amazon.com/images/I/71XAE3H-3OL._AC_SL1500_.jpg',
  'kb-010': 'https://m.media-amazon.com/images/I/71B0YJHBsKL._AC_SL1500_.jpg',
  'kb-011': 'https://m.media-amazon.com/images/I/61Zt4vF7JmL._AC_SL1500_.jpg',
  'kb-012': 'https://m.media-amazon.com/images/I/61j-0-BZOBL._AC_SL1500_.jpg',
  'kb-013': 'https://m.media-amazon.com/images/I/71xChy84HbL._AC_SL1500_.jpg',
  'kb-014': 'https://m.media-amazon.com/images/I/61GNLP1JDHL._AC_SL1500_.jpg',
  'kb-015': 'https://m.media-amazon.com/images/I/71kGy3TRm3L._AC_SL1500_.jpg',
  'kb-016': 'https://m.media-amazon.com/images/I/71oSn7S3SQL._AC_SL1500_.jpg',
  'kb-017': 'https://m.media-amazon.com/images/I/71rQ4HQSTRL._AC_SL1500_.jpg',
  'kb-018': 'https://m.media-amazon.com/images/I/61mRPWQzZ3L._AC_SL1500_.jpg',
  'kb-019': 'https://m.media-amazon.com/images/I/51u8dM+p0kL._AC_SL1500_.jpg',
  'kb-020': 'https://dlcdnwebimgs.asus.com/gain/0D95E0B3-2B6E-4C5A-96A6-6E5ECF26D5A0/w1000/h732',
  'kb-021': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2C3?wid=1144&hei=1144&fmt=jpeg&qlt=90',

  // ===== Chuột =====
  'mouse-004': 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
  'mouse-005': 'https://m.media-amazon.com/images/I/61BtCjJcHdL._AC_SL1500_.jpg',
  'mouse-006': 'https://m.media-amazon.com/images/I/61MR-aq0EUL._AC_SL1500_.jpg',
  'mouse-007': 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
  'mouse-008': 'https://m.media-amazon.com/images/I/51Bj8G7FQnL._AC_SL1500_.jpg',
  'mouse-009': 'https://m.media-amazon.com/images/I/61a0Lkx1pHL._AC_SL1500_.jpg',
  'mouse-010': 'https://m.media-amazon.com/images/I/61oqD-jLz4L._AC_SL1500_.jpg',
  'mouse-011': 'https://m.media-amazon.com/images/I/41k5IQfg3cL._AC_SL1500_.jpg',
  'mouse-012': 'https://dlcdnwebimgs.asus.com/gain/DF08A5E3-1E3A-46C0-B60D-D2F60A1A4C66/w1000/h732',
  'mouse-013': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=85',
  'mouse-014': 'https://m.media-amazon.com/images/I/61CqXHfN8YL._AC_SL1500_.jpg',
  'mouse-015': 'https://m.media-amazon.com/images/I/51ApmJXV6RL._AC_SL1500_.jpg',
  'mouse-016': 'https://m.media-amazon.com/images/I/51sJb7pq+oL._AC_SL1500_.jpg',
  'mouse-017': 'https://m.media-amazon.com/images/I/71pNCVXuIBL._AC_SL1500_.jpg',
  'mouse-018': 'https://m.media-amazon.com/images/I/61DACB-IVSL._AC_SL1500_.jpg',
  'mouse-019': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2E3?wid=1144&hei=1144&fmt=jpeg&qlt=90',
  'mouse-020': 'https://m.media-amazon.com/images/I/61lqVfDSr7L._AC_SL1500_.jpg',
  'mouse-021': 'https://m.media-amazon.com/images/I/61N1fOqdc7L._AC_SL1500_.jpg',

  // ===== Tai Nghe =====
  'hs-004': 'https://m.media-amazon.com/images/I/71bsoe+VLqL._AC_SL1500_.jpg',
  'hs-005': 'https://m.media-amazon.com/images/I/71NVKzLt5rL._AC_SL1500_.jpg',
  'hs-006': 'https://m.media-amazon.com/images/I/71-+rFBzP7L._AC_SL1500_.jpg',
  'hs-007': 'https://m.media-amazon.com/images/I/71Q3LRiGbNL._AC_SL1500_.jpg',
  'hs-008': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Headsets/CA-9011235-NA/Gallery/VIRTUOSO_RGB_XT_01.webp',
  'hs-009': 'https://m.media-amazon.com/images/I/71g7ZWUU+BL._AC_SL1500_.jpg',
  'hs-010': 'https://m.media-amazon.com/images/I/71B1xgZ53nL._AC_SL1500_.jpg',
  'hs-011': 'https://m.media-amazon.com/images/I/61HWfP1GstL._AC_SL1500_.jpg',
  'hs-012': 'https://dlcdnwebimgs.asus.com/gain/0D695C70-8C5A-4B91-A69B-7B03F4F56D8C/w1000/h732',
  'hs-013': 'https://m.media-amazon.com/images/I/71E1vd4bVQL._AC_SL1500_.jpg',
  'hs-014': 'https://m.media-amazon.com/images/I/71CMDaaJRWL._AC_SL1500_.jpg',
  'hs-015': 'https://m.media-amazon.com/images/I/61EhxQT18qL._AC_SL1500_.jpg',
  'hs-016': 'https://m.media-amazon.com/images/I/71uT6bJaYyL._AC_SL1500_.jpg',
  'hs-017': 'https://m.media-amazon.com/images/I/61CGLp6eDzL._AC_SL1500_.jpg',
  'hs-018': 'https://m.media-amazon.com/images/I/71TLpoYW3yL._AC_SL1500_.jpg',
  'hs-019': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-hero-select-202011?wid=940&hei=1112&fmt=jpeg&qlt=90',
  'hs-020': 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg',
  'hs-021': 'https://m.media-amazon.com/images/I/51vGnhajV0L._AC_SL1500_.jpg',

  // ===== RAM =====
  'ram-004': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMT32GX5M2X6000C30/Gallery/DOM_TITANIUM_WHITE_01.webp',
  'ram-005': 'https://m.media-amazon.com/images/I/71pTbVr0URL._AC_SL1500_.jpg',
  'ram-006': 'https://m.media-amazon.com/images/I/71xHdFuPFxL._AC_SL1500_.jpg',
  'ram-007': 'https://m.media-amazon.com/images/I/71LkPdIBMdL._AC_SL1500_.jpg',
  'ram-008': 'https://images.teamgroupinc.com/products/memory/u-dimm/ddr5/delta-rgb/white/05.jpg',
  'ram-009': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMH32GX5M2E5200C40/Gallery/VENGEANCE_RGB_DDR5_BLK_01.webp',
  'ram-010': 'https://m.media-amazon.com/images/I/71JpfbPpNuL._AC_SL1500_.jpg',
  'ram-011': 'https://m.media-amazon.com/images/I/71A6qPO0SIL._AC_SL1500_.jpg',
  'ram-012': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENGEANCE_LPX_BLK_01.webp',
  'ram-013': 'https://m.media-amazon.com/images/I/71LFxZXLJdL._AC_SL1500_.jpg',
  'ram-014': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMW16GX4M2C3200C16/Gallery/VENGEANCE_RGB_PRO_BLK_01.webp',
  'ram-015': 'https://m.media-amazon.com/images/I/81lhpYvhJ1L._AC_SL1500_.jpg',
  'ram-016': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMT64GX5M2B5600C36/Gallery/DOM_PLATINUM_RGB_DDR5_BLK_01.webp',
  'ram-017': 'https://m.media-amazon.com/images/I/61rGf2WKMDL._AC_SL1500_.jpg',
  'ram-018': 'https://m.media-amazon.com/images/I/71GiPD+LMxL._AC_SL1500_.jpg',
  'ram-019': 'https://m.media-amazon.com/images/I/71sOQf5BKZL._AC_SL1500_.jpg',
  'ram-020': 'https://m.media-amazon.com/images/I/71-+rFBzP7L._AC_SL1500_.jpg',
  'ram-021': 'https://m.media-amazon.com/images/I/71uy+X4YSEL._AC_SL1500_.jpg',

  // ===== SSD =====
  'ssd-004': 'https://m.media-amazon.com/images/I/71MbMLMnxBL._AC_SL1500_.jpg',
  'ssd-005': 'https://m.media-amazon.com/images/I/71qhSGGlLjL._AC_SL1500_.jpg',
  'ssd-006': 'https://m.media-amazon.com/images/I/71gt0PKnkvL._AC_SL1500_.jpg',
  'ssd-007': 'https://m.media-amazon.com/images/I/81I-uLd8fSL._AC_SL1500_.jpg',
  'ssd-008': 'https://m.media-amazon.com/images/I/71pOEJDul3L._AC_SL1500_.jpg',
  'ssd-009': 'https://m.media-amazon.com/images/I/71k8B7ZGrVL._AC_SL1500_.jpg',
  'ssd-010': 'https://m.media-amazon.com/images/I/71QLCBwWaHL._AC_SL1500_.jpg',
  'ssd-011': 'https://m.media-amazon.com/images/I/71i5aN3H9yL._AC_SL1500_.jpg',
  'ssd-012': 'https://m.media-amazon.com/images/I/71f6AWGBjGL._AC_SL1500_.jpg',
  'ssd-013': 'https://m.media-amazon.com/images/I/71v8m3OVRTL._AC_SL1500_.jpg',
  'ssd-014': 'https://m.media-amazon.com/images/I/71RnbSp5OzL._AC_SL1500_.jpg',
  'ssd-015': 'https://m.media-amazon.com/images/I/71Uo74WbLAL._AC_SL1500_.jpg',
  'ssd-016': 'https://m.media-amazon.com/images/I/71RJR50MBVL._AC_SL1500_.jpg',
  'ssd-017': 'https://m.media-amazon.com/images/I/71DGrr58SGL._AC_SL1500_.jpg',
  'ssd-018': 'https://m.media-amazon.com/images/I/71XmC0c4j3L._AC_SL1500_.jpg',
  'ssd-019': 'https://m.media-amazon.com/images/I/71CAS9Ce3bL._AC_SL1500_.jpg',
  'ssd-020': 'https://m.media-amazon.com/images/I/71e-gNjhJNL._AC_SL1500_.jpg',
  'ssd-021': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Storage/CSSD-F1000GBMP600PLP/Gallery/MP600PRO_LPX_01.webp',

  // ===== Phụ Kiện =====
  'acc-001': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Accessories-Parts/Gaming-Desk-Accessories/Gallery/Elgato_Wave_Mic_Arm_LP_01.webp',
  'acc-002': 'https://anphat.com.vn/media/product/45140_gi_________2_m__n_h__nh_human_motion_t9_pro_ii_dual__23___43inch__m__u_tr___ng__3_.jpg',
  'acc-003': 'https://www.sihoo.com/cdn/shop/files/C300-b.webp?crop=center&height=1200&v=1744277516&width=1200',
  'acc-004': 'https://product.hstatic.net/200000722513/product/ing-ghe-corsair-t3-rush-charcoal-6666_06d6e0d13f64400cbdca9939fafe1acd_df1e20ad6e3c45c18e2e2d8ff3ce2dc1.jpg',
  'acc-005': 'https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/v1679913984/Products/10MAB9901/above-the-fold/desktop/wave-3-black-01_zz5vyc.jpg',
  'acc-010': 'https://bizweb.dktcdn.net/100/329/122/products/gia-do-2-man-hinh-human-motion-monitor-arm-t9-pro-ii-dual-grey-23-43-inch-t9proii-dual-gry-3ba0bef5-074d-45db-877a-bcb540c0779b.jpg?v=1728375286553',
  'acc-011': 'https://m.media-amazon.com/images/I/61k-FNOGzFL._AC_SL1500_.jpg',
  'acc-012': 'https://product.hstatic.net/200000722513/product/_q100_crop-fit_optimize_subsampling-2_2ef1b8fbb6e74381b1329502470db19b_85d69bcef1664de3a6852008a87d5ef5.png',
  'acc-013': 'https://m.media-amazon.com/images/I/71Lq7x+N5cL._AC_SL1500_.jpg',
  'acc-014': 'https://image.benq.com/is/image/benqco/together-dark%20brown-1?$ResponsivePreset$',
  'acc-015': 'https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/v1679475550/Products/10GBA9901/above-the-fold/desktop/mk.2-black-01_seyirh.jpg',
  'acc-016': 'https://m.media-amazon.com/images/I/61UxqckXwAL._AC_SL1500_.jpg',
  'acc-017': 'https://edge.rode.com/images/page/77/modules/3685/RODE_NT-USB_Mini_FRONT_DEEP_ETCHED-2000x2000-ecf456c.png',
  'acc-018': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Headsets/CA-9011167-NA/Gallery/ST100RGB_01.webp',
  'acc-019': 'https://www.tomtoc.com/cdn/shop/products/A13_57ecf537-ca98-4649-81b3-792605211d87_750x.jpg?v=1772171619',
  'acc-020': 'https://m.media-amazon.com/images/I/616FCJCE4ZL._AC_SL1083_.jpg',
  'acc-021': 'https://nl.ugreen.com/cdn/shop/files/ugreen-revodok-pro-9-in-1-usb-c-hub-4k-hdmi-10gbps-pd-100w-4974881.png?v=1756398747&width=1024',
  'acc-022': 'https://awessories.com/wp-content/uploads/2023/02/36253-qgperb.jpg',

  // ===== Mainboard =====
  'mainboard-001': 'https://product.hstatic.net/200000722513/product/w800__1__285a1e0af5884ca2a8082411c34057f4.png',
  'mainboard-002': 'https://anphat.com.vn/media/lib/23-11-2023/46992_mainboard_msi_pro_b650m_a_wifi_ddr5__2_.jpg',
  'mainboard-003': 'https://static.gigabyte.com/StaticFile/Image/Global/2e0808b0ad314b6b2319ac3fc1858e8f/ProductRemoveBg/34198/webp/900',

  // ===== Nguồn (PSU) =====
  'psu-001': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/v1680126577/products/Power-Supply-Units/base-rme-series-2023-psu-config/Gallery/750W/RM750e_01.webp',
  'psu-002': 'https://hanoicomputercdn.com/media/product/55275_cooler_master_mwe_650_bronze_v2__1_.jpg',
  'psu-003': 'https://dlcdnwebimgs.asus.com/gain/469D42A6-4F0A-470F-BE7C-F5F68E3E7799',

  // ===== Vỏ Case =====
  'case-001': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/CC-9011200-WW/Gallery/4000D_AF_BLK_01.webp',
  'case-002': 'https://m.media-amazon.com/images/I/71jMUlT5SQL._AC_SL1500_.jpg',
  'case-003': 'https://m.media-amazon.com/images/I/71ydEf0CEML._AC_SL1500_.jpg',

  // ===== Tản Nhiệt =====
  'cooling-001': 'https://www.deepcool.com/public/ProductFile/DEEPCOOL/Cooling/CPUAirCoolers/AK620_DIGITAL/Gallery/4000X4000/03.png',
  'cooling-002': 'https://anphat.com.vn/media/product/40061_e.jpg',
  'cooling-003': 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Liquid-Cooling/icue-link-lcd-aio/CW-9061010/iCUE_LINK_H150i_LCD_WHT_01.webp',

  // ===== Apple =====
  'apple-001': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-midnight-select-202502?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-002': 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mac-mini-2024.png',
  'apple-003': 'https://www.apple.com/v/imac/w/images/overview/welcome/welcome_hero__f23bdvt2rzam_medium_2x.jpg',

  // ===== Laptop (Đúng mô tả sản phẩm máy tính, 100% Unique, Chuẩn GearVN / E-Commerce) =====
  'l360-dell-001': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
  'l360-dell-002': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
  'l360-dell-003': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
  'l360-dell-004': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=85',
  'l360-dell-005': 'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=85',
  'l360-dell-006': 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=85',
  'l360-dell-007': 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85',
  'l360-dell-008': 'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85',
  'l360-dell-009': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',
  'l360-dell-010': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85',
  'l360-dell-011': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
  'l360-dell-012': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85',
  'l360-001': 'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=85',
  'l360-002': 'https://cdn.tgdd.vn/Products/Images/44/313333/lenovo-ideapad-slim-3-14iah8-i5-83eq0005vn-glr-1.jpg',
  'l360-003': 'https://cdn.tgdd.vn/Products/Images/44/309836/lenovo-thinkbook-14-g6-irl-i5-21kg006gvn-glr-1.jpg',
  'l360-004': 'https://cdn.tgdd.vn/Products/Images/44/313330/lenovo-legion-pro-5-16irx9-i7-83df0046vn-glr-1.jpg',
  'l360-005': 'https://cdn.tgdd.vn/Products/Images/44/309831/hp-pavilion-x360-14-ek1049tu-i5-80r27pa-glr-1.jpg',
  'l360-006': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',
  'l360-007': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=85',
  'l360-008': 'https://cdn.tgdd.vn/Products/Images/44/313327/hp-15-fd0081tu-i5-812k5pa-glr-1.jpg',
  'l360-009': 'https://m.media-amazon.com/images/I/81Ivn5DIxhL._AC_SL1500_.jpg',
  'l360-010': 'https://cdn.tgdd.vn/Products/Images/44/309848/asus-tuf-gaming-f15-fx506hf-i5-hn014w-glr-1.jpg',
  'l360-011': 'https://cdn.tgdd.vn/Products/Images/44/309850/asus-rog-strix-g16-g614ju-i7-n4042w-glr-1.jpg',
  'l360-012': 'https://cdn.tgdd.vn/Products/Images/44/282828/acer-nitro-5-tiger-an515-58-52sp-i5-nhqfksv002-glr-1.jpg',
  'l360-013': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
  'l360-014': 'https://cdn.tgdd.vn/Products/Images/44/309844/acer-predator-helios-neo-16-phn16-71-7460-i7-nhqlusv002-glr-1.jpg',
  'l360-015': 'https://cdn.tgdd.vn/Products/Images/44/313342/asus-zenbook-14-oled-ux3405ma-ultra-5-pp151w-glr-1.jpg',
  'l360-016': 'https://cdn.tgdd.vn/Products/Images/44/313338/acer-nitro-v-15-anv15-51-57b2-i5-nhqn8sv001-glr-1.jpg',
  'l360-017': 'https://cdn.tgdd.vn/Products/Images/44/309852/msi-gaming-gf63-thin-12ve-i5-460vn-glr-1.jpg',
  'l360-018': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85',
  'l360-019': 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&w=800&q=85',
  'l360-020': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85',
  'l360-021': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85',
  'l360-022': 'https://images.unsplash.com/photo-1585004216568-7910f84e39e8?auto=format&fit=crop&w=800&q=85',
  'l360-023': 'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=85',
  'l360-024': 'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
  'l360-025': 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?auto=format&fit=crop&w=800&q=85',
  'l360-026': 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=85',
  'l360-027': 'https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?auto=format&fit=crop&w=800&q=85',
  'l360-028': 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?auto=format&fit=crop&w=800&q=85',
  'l360-029': 'https://images.unsplash.com/photo-1546302915-a2a86fb6f02c?auto=format&fit=crop&w=800&q=85',
  'l360-030': 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?auto=format&fit=crop&w=800&q=85',
  'l360-031': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=85',
  'l360-032': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
  'l360-033': 'https://images.unsplash.com/photo-1555617748-45abb7be4e2a?auto=format&fit=crop&w=800&q=85',
  'l360-034': 'https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=800&q=85',
  'l360-035': 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=85',
  'l360-036': 'https://asset.msi.com/resize/image/global/product/product_167878235287611ef4f7c13481e19488a0b06b9b32_1024.png',
  'l360-037': 'https://dlcdnwebimgs.asus.com/gain/452B2023-A0A3-4CE8-8547-B223BEBF9F18/w1000/h732',
  'l360-038': 'https://dlcdnwebimgs.asus.com/gain/3D215E9F-1A51-4FB9-B6C8-4DE0B5D98BE9/w1000/h732',
  'l360-039': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
  'l360-040': 'https://dlcdnwebimgs.asus.com/gain/4B5EF4B9-A454-4B2E-BE6F-44F4E40E3E8C/w1000/h732',
  'l360-041': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
  'l360-042': 'https://dlcdnwebimgs.asus.com/gain/97BA3C80-5BFA-404B-AE26-7ACCE5B34825/w1000/h732',
  'l360-043': 'https://dlcdnwebimgs.asus.com/gain/9BD697EC-8935-4A93-A33A-E6728EC5965A/w1000/h732',
  'l360-044': 'https://dlcdnwebimgs.asus.com/gain/49339233-C9A8-4F70-985B-3D7FFC46A085/w1000/h732',
  'l360-045': 'https://dlcdnwebimgs.asus.com/gain/3D215E9F-1A51-4FB9-B6C8-4DE0B5D98BE9/w1000/h732',
  'l360-046': 'https://dlcdnwebimgs.asus.com/gain/4B5EF4B9-A454-4B2E-BE6F-44F4E40E3E8C/w1000/h732',
  'l360-047': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
  'l360-048': 'https://dlcdnwebimgs.asus.com/gain/3D215E9F-1A51-4FB9-B6C8-4DE0B5D98BE9/w1000/h732',
  'l360-049': 'https://dlcdnwebimgs.asus.com/gain/452B2023-A0A3-4CE8-8547-B223BEBF9F18/w1000/h732',
  'l360-050': 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=85',
  'l360-051': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85',
  'l360-052': 'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=800&q=85',
  'l360-053': 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=800&q=85',
  'l360-054': 'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=800&q=85',
  'l360-055': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
  'l360-056': 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
  'l360-057': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
  'l360-058': 'https://images.unsplash.com/photo-1616711906333-870826ae33e5?auto=format&fit=crop&w=800&q=85',
  'l360-059': 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=85',
  'l360-060': 'https://images.unsplash.com/photo-1601314167099-232775b3d6fd?auto=format&fit=crop&w=800&q=85',
  'l360-061': 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=800&q=85',
  'l360-062': 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
  'l360-063': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
  'l360-064': 'https://images.unsplash.com/photo-1574197443271-df23cad2f21b?auto=format&fit=crop&w=800&q=85',
  'l360-065': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=85',
  'l360-066': 'https://images.unsplash.com/photo-1594842208736-f6b0edbbf0f3?auto=format&fit=crop&w=800&q=85',
  'l360-067': 'https://images.unsplash.com/photo-1619788429396-7b66e47c10c6?auto=format&fit=crop&w=800&q=85',
  'l360-068': 'https://images.unsplash.com/photo-1555618565-72523b773df2?auto=format&fit=crop&w=800&q=85',
  'l360-069': 'https://images.unsplash.com/photo-1606318313647-13e6c5bc8a5a?auto=format&fit=crop&w=800&q=85',
  'l360-070': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90',
  'l360-071': 'https://images.unsplash.com/photo-1548690596-f1722c190938?auto=format&fit=crop&w=800&q=85',
  'l360-072': 'https://images.unsplash.com/photo-1589803571775-dc375714c8d6?auto=format&fit=crop&w=800&q=85',
  'l360-073': 'https://images.unsplash.com/photo-1627386900767-37c0c90e5f6d?auto=format&fit=crop&w=800&q=85',
  'l360-074': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
  'l360-075': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
  'l360-076': 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=85',
  'l360-077': 'https://m.media-amazon.com/images/I/616FCJCE4ZL._AC_SL1083_.jpg',
  'l360-078': 'https://m.media-amazon.com/images/I/61k-FNOGzFL._AC_SL1500_.jpg',
  'l360-079': 'https://m.media-amazon.com/images/I/61UxqckXwAL._AC_SL1500_.jpg',
  'l360-080': 'https://m.media-amazon.com/images/I/61DACB-IVSL._AC_SL1500_.jpg',
  'lap-001': 'https://cdn.tgdd.vn/Products/Images/44/309854/msi-modern-14-c13m-i5-607vn-glr-1.jpg',
  'lap-002': 'https://cdn.tgdd.vn/Products/Images/44/313340/asus-vivobook-15-x1504za-i5-nj1463w-glr-1.jpg',
  'lap-003': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
  'lap-004': 'https://cdn.tgdd.vn/Products/Images/44/309834/hp-victus-15-fa1139tx-i5-8c5n3pa-glr-1.jpg',
  'lap-005': 'https://cdn.tgdd.vn/Products/Images/44/313328/hp-pavilion-15-eg3093tu-i5-8c5x4pa-glr-1.jpg',
  'lap-006': 'https://cdn.tgdd.vn/Products/Images/44/309837/lenovo-thinkpad-e14-gen-5-i5-21jk0069vn-glr-1.jpg',
  'lap-007': 'https://cdn.tgdd.vn/Products/Images/44/313335/acer-aspire-lite-15-51m-59au-i5-nxks5sv001-glr-1.jpg',
  'lap-008': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
  'lap-009': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-midnight-select-202502?wid=904&hei=840&fmt=jpeg&qlt=90',
};

const CATEGORY_PRODUCT_IMAGES: Record<string, string[]> = {
  laptop: [
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&w=800&q=85',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-midnight-select-202502?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-starlight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-silver-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://dlcdnwebimgs.asus.com/gain/97BA3C80-5BFA-404B-AE26-7ACCE5B34825/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/452B2023-A0A3-4CE8-8547-B223BEBF9F18/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/49339233-C9A8-4F70-985B-3D7FFC46A085/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/83FD3A6C-812C-400A-AEAA-555BE955C24E/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/4B5EF4B9-A454-4B2E-BE6F-44F4E40E3E8C/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/16281734-DC08-41C2-82EB-B0F9F3B66D42/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/3D215E9F-1A51-4FB9-B6C8-4DE0B5D98BE9/w1000/h732',
    'https://dlcdnwebimgs.asus.com/gain/9BD697EC-8935-4A93-A33A-E6728EC5965A/w1000/h732',
    'https://asset.msi.com/resize/image/global/product/product_167878235287611ef4f7c13481e19488a0b06b9b32_1024.png',
    'https://asset.msi.com/resize/image/global/product/product_167879825556febc59f90b0c9dcf9e4f6d92f37e4a_1024.png',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-spacegray-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp13-spacegray-select-202206?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=85',
  ],
  'gaming-pc': [
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1626508035297-5afabf3bbdf0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
  ],
  'office-pc': [
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585256469700-2d48e0b2cb40?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=85',
  ],
  cpu: [
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591290621835-1d04d7e66efc?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
  ],
  ram: [
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
  ],
  ssd: [
    'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1598550476439-6847785fdd52?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
  ],
  monitor: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
  ],
  keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=85',
  ],
  headset: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
  ],
  mainboard: [
    'https://product.hstatic.net/200000722513/product/w800__1__285a1e0af5884ca2a8082411c34057f4.png',
    'https://static.gigabyte.com/StaticFile/Image/Global/2e0808b0ad314b6b2319ac3fc1858e8f/ProductRemoveBg/34198/webp/900',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=85',
  ],
  psu: [
    'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/v1680126577/products/Power-Supply-Units/base-rme-series-2023-psu-config/Gallery/750W/RM750e_01.webp',
    'https://dlcdnwebimgs.asus.com/gain/469D42A6-4F0A-470F-BE7C-F5F68E3E7799',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
  ],
  case: [
    'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Cases/CC-9011200-WW/Gallery/4000D_AF_BLK_01.webp',
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
  ],
  cooling: [
    'https://www.deepcool.com/public/ProductFile/DEEPCOOL/Cooling/CPUAirCoolers/AK620_DIGITAL/Gallery/4000X4000/03.png',
    'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Liquid-Cooling/icue-link-lcd-aio/CW-9061010/iCUE_LINK_H150i_LCD_WHT_01.webp',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
  ],
  apple: [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-midnight-select-202502?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/mac-mini-2024.png',
    'https://www.apple.com/v/imac/w/images/overview/welcome/welcome_hero__f23bdvt2rzam_medium_2x.jpg',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-starlight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=904&hei=840&fmt=jpeg&qlt=90',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&w=800&q=85',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1609921205586-7e8a57516512?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=800&q=85',
  ],
  chair: [
    'https://www.sihoo.com/cdn/shop/files/C300-b.webp?crop=center&height=1200&v=1744277516&width=1200',
    'https://product.hstatic.net/200000722513/product/ing-ghe-corsair-t3-rush-charcoal-6666_06d6e0d13f64400cbdca9939fafe1acd_df1e20ad6e3c45c18e2e2d8ff3ce2dc1.jpg',
  ],
  mousepad: ['https://product.hstatic.net/200000722513/product/_q100_crop-fit_optimize_subsampling-2_2ef1b8fbb6e74381b1329502470db19b_85d69bcef1664de3a6852008a87d5ef5.png'],
  webcam: ['https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85'],
  microphone: ['https://edge.rode.com/images/page/77/modules/3685/RODE_NT-USB_Mini_FRONT_DEEP_ETCHED-2000x2000-ecf456c.png'],
  default: [
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=800&q=85',
  ],
};

function getProductImageCategory(product: { name?: string; category?: string; category_id?: string }) {
  const category = (product.category_id || product.category || '').toLowerCase().trim();
  if (category && category !== 'accessories') return category;

  const name = (product.name || '').toLowerCase();
  if (/ghế|chair/.test(name)) return 'chair';
  if (/lót chuột|bàn di chuột|mouse ?pad/.test(name)) return 'mousepad';
  if (/màn hình|monitor|screenbar|giá treo màn/.test(name)) return 'monitor';
  if (/bàn phím|keyboard|stream deck/.test(name)) return 'keyboard';
  if (/chuột|mouse/.test(name)) return 'mouse';
  if (/tai nghe|headset|headphone/.test(name)) return 'headset';
  if (/tản nhiệt|cooler|heatsink/.test(name)) return 'cooling';
  if (/webcam|camera/.test(name)) return 'webcam';
  if (/micro|microphone/.test(name)) return 'microphone';
  if (/laptop|sạc|adapter|balo|túi chống sốc/.test(name)) return 'laptop';
  return category || 'default';
}

export function isInvalidOrBlockedImageUrl(url?: string): boolean {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('cdn.tgdd.vn') ||
    lower.includes('laptop360.net') ||
    lower.includes('picsum.photos') ||
    lower.includes('photo-1563013544-824ae1b704d3') ||
    lower.includes('photo-1455945609732-5a6e62dbccc5') ||
    lower.includes('photo-1544099858-75a7b1b60ab2') ||
    lower.includes('photo-1555617981-dac3772ef3c2') ||
    lower.includes('photo-1574155376612-bfa4ed8aabfd') ||
    lower.includes('photo-1640161704729-cbe966a08476') ||
    lower.includes('photo-1566296440929-a5e0b8dc7b38') ||
    lower.includes('photo-1474631245212-32dc3c8310c6') ||
    lower.includes('photo-1610465299996-30f240ac2b1c')
  );
}

export function getProductFallbackImage(product: { id?: string; name?: string; category?: string; category_id?: string }) {
  const category = getProductImageCategory(product);
  const rawPool = CATEGORY_PRODUCT_IMAGES[category] ?? CATEGORY_PRODUCT_IMAGES.default;
  const imagePool = rawPool.filter((img) => !isInvalidOrBlockedImageUrl(img));
  const poolToUse = imagePool.length > 0 ? imagePool : CATEGORY_PRODUCT_IMAGES.default;
  const seed = `${product.id ?? ''}-${product.name ?? ''}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return poolToUse[hash % poolToUse.length];
}

export function getColorHex(colorName: string): string {
  const lower = (colorName || '').toLowerCase();
  if (lower.includes('trắng') || lower.includes('white') || lower.includes('frost') || lower.includes('băng giá')) return '#f8fafc';
  if (lower.includes('vàng') || lower.includes('gold') || lower.includes('starlight') || lower.includes('sa mộc') || lower.includes('sandstone') || lower.includes('nhiệt huyết')) return '#fef08a';
  if (lower.includes('bạc') || lower.includes('silver') || lower.includes('platinum') || lower.includes('bạch kim') || lower.includes('luna') || lower.includes('arctic')) return '#cbd5e1';
  if (lower.includes('xanh bóng đêm') || lower.includes('midnight') || lower.includes('biển sâu')) return '#0f172a';
  if (lower.includes('xanh băng') || lower.includes('ice blue') || lower.includes('sky blue')) return '#93c5fd';
  if (lower.includes('xanh trầm tĩnh') || lower.includes('ponder blue') || lower.includes('vực thẳm') || lower.includes('abyss') || lower.includes('ocean')) return '#1e40af';
  if (lower.includes('xanh rêu') || lower.includes('green') || lower.includes('xô thơm') || lower.includes('sage') || lower.includes('pebble') || lower.includes('vân sam')) return '#166534';
  if (lower.includes('xanh')) return '#2563eb';
  if (lower.includes('volt green')) return '#22c55e';
  if (lower.includes('đỏ') || lower.includes('red') || lower.includes('cam')) return '#dc2626';
  if (lower.includes('không gian') || lower.includes('space') || lower.includes('graphite') || lower.includes('than chì') || lower.includes('bão') || lower.includes('storm')) return '#475569';
  if (lower.includes('xám') || lower.includes('grey') || lower.includes('gray') || lower.includes('titan') || lower.includes('bảo thạch') || lower.includes('khoáng thạch') || lower.includes('tro')) return '#64748b';
  if (lower.includes('đen') || lower.includes('black') || lower.includes('obsidian') || lower.includes('onyx') || lower.includes('abyssal') || lower.includes('huyền bí') || lower.includes('carbon')) return '#18181b';
  return '#64748b';
}

export function getRamPriceDelta(product: Partial<Product>, ramLabel: string): number {
  if (!ramLabel) return 0;
  const configs = product?.configurations || (product ? getLaptopConfigurations(product) : undefined);
  if (configs?.ramDetails) {
    const found = configs.ramDetails.find((d) => d.label === ramLabel);
    if (found && typeof found.priceDelta === 'number') {
      return found.priceDelta;
    }
  }
  return 0;
}

export function getLaptopConfigurations(product: Partial<Product>): NonNullable<Product['configurations']> {
  const name = String(product?.name || '').toLowerCase();
  const id = String(product?.id || '').toLowerCase();
  const specs = product?.specifications || {};
  const specStr = typeof specs === 'object' && specs !== null
    ? Object.values(specs).map((v) => String(v ?? '')).join(' ').toLowerCase()
    : '';
  const text = `${id} ${name} ${specStr}`;

  // Kiểm tra nếu là phụ kiện sạc laptop
  if (/sạc|adapter|củ sạc/.test(name)) {
    return {
      colors: ['Đen Tiêu Chuẩn (Black)'],
      ram: [],
      ramDetails: [],
    };
  }

  // 1. Apple MacBook
  if (/macbook|apple m[1-4]|mba|mbp/.test(text)) {
    if (/pro 16|m3 max|mbp16/.test(text)) {
      return {
        colors: ['Đen Không Gian (Space Black)', 'Bạc (Silver)'],
        ram: ['36GB Unified Memory', '48GB Unified Memory', '96GB Unified Memory', '128GB Unified Memory'],
        ramDetails: [
          { label: '36GB Unified Memory', priceDelta: 0 },
          { label: '48GB Unified Memory', priceDelta: 5500000 },
          { label: '96GB Unified Memory', priceDelta: 18000000 },
          { label: '128GB Unified Memory', priceDelta: 26000000 },
        ],
      };
    }
    if (/m4|2025/.test(text)) {
      return {
        colors: ['Xanh Bóng Đêm (Midnight)', 'Vàng Ánh Kim (Starlight)', 'Xám Không Gian (Space Gray)', 'Bạc (Silver)'],
        ram: ['16GB Unified Memory (Chuẩn mới)', '24GB Unified Memory', '32GB Unified Memory'],
        ramDetails: [
          { label: '16GB Unified Memory (Chuẩn mới)', priceDelta: 0 },
          { label: '24GB Unified Memory', priceDelta: 4500000 },
          { label: '32GB Unified Memory', priceDelta: 9000000 },
        ],
      };
    }
    return {
      colors: ['Xanh Bóng Đêm (Midnight)', 'Vàng Ánh Kim (Starlight)', 'Xám Không Gian (Space Gray)', 'Bạc (Silver)'],
      ram: ['8GB Unified Memory', '16GB Unified Memory', '24GB Unified Memory'],
      ramDetails: [
        { label: '8GB Unified Memory', priceDelta: 0 },
        { label: '16GB Unified Memory', priceDelta: 4000000 },
        { label: '24GB Unified Memory', priceDelta: 8000000 },
      ],
    };
  }

  // 2. Acer Gaming & Predator
  if (/acer|nitro|helios|predator/.test(text)) {
    if (/helios|predator/.test(text)) {
      return {
        colors: ['Đen Abyssal Black (Khắc Laser Predator)', 'Đen Nhám Matte Black'],
        ram: ['16GB DDR5 5600MHz', '32GB DDR5 5600MHz (2x16GB)', '64GB DDR5 5600MHz Extreme'],
        ramDetails: [
          { label: '16GB DDR5 5600MHz', priceDelta: 0 },
          { label: '32GB DDR5 5600MHz (2x16GB)', priceDelta: 1600000 },
          { label: '64GB DDR5 5600MHz Extreme', priceDelta: 3800000 },
        ],
      };
    }
    if (/nitro v|anv15/.test(text)) {
      return {
        colors: ['Đen Xước Phay Obsidian', 'Xám Đậm Cyber Black'],
        ram: ['16GB DDR5 5200MHz', '32GB DDR5 5200MHz (2x16GB Dual)'],
        ramDetails: [
          { label: '16GB DDR5 5200MHz', priceDelta: 0 },
          { label: '32GB DDR5 5200MHz (2x16GB Dual)', priceDelta: 1500000 },
        ],
      };
    }
    if (/tiger|an515-58|5046/.test(text)) {
      return {
        colors: ['Đen Obsidian (Obsidian Black)', 'Đen viền đỏ Gaming (Shale Black)', 'Xám Than Chì (Charcoal Black)'],
        ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (2x8GB Dual-Channel)', '32GB DDR4 3200MHz (2x16GB High-Speed)'],
        ramDetails: [
          { label: '8GB DDR4 3200MHz', priceDelta: 0 },
          { label: '16GB DDR4 3200MHz (2x8GB Dual-Channel)', priceDelta: 800000 },
          { label: '32GB DDR4 3200MHz (2x16GB High-Speed)', priceDelta: 1800000 },
        ],
      };
    }
    return {
      colors: ['Đen Shale Black (LED đỏ Gaming)', 'Đen Obsidian Gaming'],
      ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (Dual-Channel)', '32GB DDR4 3200MHz (2x16GB)'],
      ramDetails: [
        { label: '8GB DDR4 3200MHz', priceDelta: 0 },
        { label: '16GB DDR4 3200MHz (Dual-Channel)', priceDelta: 800000 },
        { label: '32GB DDR4 3200MHz (2x16GB)', priceDelta: 1800000 },
      ],
    };
  }

  // 3. Lenovo (Legion, LOQ, ThinkPad, ThinkBook, IdeaPad, Xiaoxin, Lecoo)
  if (/lenovo|thinkpad|thinkbook|ideapad|legion|xiaoxin|lecoo/.test(text)) {
    if (/legion|r9000p/.test(text)) {
      const is32Base = /32gb|2025|pro 7i/.test(text);
      if (is32Base) {
        return {
          colors: ['Xám Bão (Storm Grey)', 'Đen Onyx Grey', 'Trắng Sông Băng (Glacier White)'],
          ram: ['32GB DDR5 5600MHz (Tiêu chuẩn)', '64GB DDR5 5600MHz High-Performance'],
          ramDetails: [
            { label: '32GB DDR5 5600MHz (Tiêu chuẩn)', priceDelta: 0 },
            { label: '64GB DDR5 5600MHz High-Performance', priceDelta: 2400000 },
          ],
        };
      }
      return {
        colors: ['Xám Bão (Storm Grey)', 'Đen Onyx Grey', 'Trắng Sông Băng (Glacier White)'],
        ram: ['16GB DDR5 5600MHz', '32GB DDR5 5600MHz (2x16GB Dual)', '64GB DDR5 5600MHz High-Performance'],
        ramDetails: [
          { label: '16GB DDR5 5600MHz', priceDelta: 0 },
          { label: '32GB DDR5 5600MHz (2x16GB Dual)', priceDelta: 1600000 },
          { label: '64GB DDR5 5600MHz High-Performance', priceDelta: 3800000 },
        ],
      };
    }
    if (/thinkpad|x1 carbon|x1 nano/.test(text)) {
      return {
        colors: ['Đen Mờ Sợi Carbon (Thunder Black Carbon Weave)', 'Đen Nhám Doanh Nhân (Deep Black Matte)'],
        ram: ['16GB LPDDR4x/LPDDR5 Quad-Channel', '32GB LPDDR5 5200MHz Onboard'],
        ramDetails: [
          { label: '16GB LPDDR4x/LPDDR5 Quad-Channel', priceDelta: 0 },
          { label: '32GB LPDDR5 5200MHz Onboard', priceDelta: 2000000 },
        ],
      };
    }
    if (/thinkbook/.test(text)) {
      return {
        colors: ['Xám Khoáng Thạch 2 Tông (Mineral Grey Dual-Tone)', 'Bạc Bắc Cực (Arctic Silver)'],
        ram: ['16GB LPDDR5/DDR4 (Dual-Channel)', '32GB LPDDR5/DDR4 (Nâng cấp tối đa)'],
        ramDetails: [
          { label: '16GB LPDDR5/DDR4 (Dual-Channel)', priceDelta: 0 },
          { label: '32GB LPDDR5/DDR4 (Nâng cấp tối đa)', priceDelta: 1600000 },
        ],
      };
    }
    return {
      colors: ['Xám Bắc Cực (Arctic Grey)', 'Xanh Vực Thẳm (Abyss Blue)', 'Bạc Ánh Trăng (Luna Grey)'],
      ram: ['16GB LPDDR5 6400MHz', '32GB LPDDR5 6400MHz'],
      ramDetails: [
        { label: '16GB LPDDR5 6400MHz', priceDelta: 0 },
        { label: '32GB LPDDR5 6400MHz', priceDelta: 1500000 },
      ],
    };
  }

  // 4. ASUS (ROG, TUF, Zephyrus, ZenBook, VivoBook)
  if (/asus|tuf|rog|zenbook|vivobook|zephyrus/.test(text)) {
    if (/tuf|fx506/.test(text)) {
      return {
        colors: ['Đen Graphit (Graphite Black)', 'Xám Cơ Giới (Mecha Gray)'],
        ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (2x8GB Dual)', '32GB DDR4 3200MHz (2x16GB)'],
        ramDetails: [
          { label: '8GB DDR4 3200MHz', priceDelta: 0 },
          { label: '16GB DDR4 3200MHz (2x8GB Dual)', priceDelta: 800000 },
          { label: '32GB DDR4 3200MHz (2x16GB)', priceDelta: 1800000 },
        ],
      };
    }
    if (/zephyrus|g14/.test(text)) {
      return {
        colors: ['Trắng Ánh Trăng (Platinum White)', 'Xám Nhật Thực (Eclipse Gray)'],
        ram: ['16GB LPDDR5X 6400MHz', '32GB LPDDR5X 6400MHz'],
        ramDetails: [
          { label: '16GB LPDDR5X 6400MHz', priceDelta: 0 },
          { label: '32GB LPDDR5X 6400MHz', priceDelta: 1800000 },
        ],
      };
    }
    if (/rog|strix|scar/.test(text)) {
      const isScar = /scar|32gb/.test(text);
      if (isScar) {
        return {
          colors: ['Xám Nhật Thực (Eclipse Gray)', 'Đen Volt Green Độc Quyền', 'Xám Kim Loại Cyber'],
          ram: ['32GB DDR5 5600MHz (2x16GB)', '64GB DDR5 5600MHz High-Speed'],
          ramDetails: [
            { label: '32GB DDR5 5600MHz (2x16GB)', priceDelta: 0 },
            { label: '64GB DDR5 5600MHz High-Speed', priceDelta: 2500000 },
          ],
        };
      }
      return {
        colors: ['Xám Nhật Thực (Eclipse Gray)', 'Đen Volt Green Độc Quyền', 'Xám Kim Loại Cyber'],
        ram: ['16GB DDR5 5600MHz', '32GB DDR5 5600MHz (2x16GB Dual)', '64GB DDR5 5600MHz Dual Channel'],
        ramDetails: [
          { label: '16GB DDR5 5600MHz', priceDelta: 0 },
          { label: '32GB DDR5 5600MHz (2x16GB Dual)', priceDelta: 1600000 },
          { label: '64GB DDR5 5600MHz Dual Channel', priceDelta: 3800000 },
        ],
      };
    }
    if (/zenbook|ux3405|q409|q410/.test(text)) {
      return {
        colors: ['Xanh Trầm Tĩnh (Ponder Blue)', 'Xám Đá Bazan (Basalt Gray)', 'Bạc Sương Mù (Foggy Silver)'],
        ram: ['16GB LPDDR5X 7467MHz', '32GB LPDDR5X 7467MHz'],
        ramDetails: [
          { label: '16GB LPDDR5X 7467MHz', priceDelta: 0 },
          { label: '32GB LPDDR5X 7467MHz', priceDelta: 1800000 },
        ],
      };
    }
    if (/vivobook|a515ea/.test(text)) {
      return {
        colors: ['Đen Indie Black', 'Bạc Trong Suốt (Transparent Silver)', 'Vàng Nhiệt Huyết (Hearty Gold)'],
        ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (Dual-Channel)', '24GB DDR4 (8GB Onboard + 16GB)'],
        ramDetails: [
          { label: '8GB DDR4 3200MHz', priceDelta: 0 },
          { label: '16GB DDR4 3200MHz (Dual-Channel)', priceDelta: 750000 },
          { label: '24GB DDR4 (8GB Onboard + 16GB)', priceDelta: 1450000 },
        ],
      };
    }
  }

  // 5. Dell (Alienware, Precision, XPS, Gaming G-Series, Latitude, Inspiron, Vostro)
  if (/dell|alienware|latitude|precision|xps|inspiron|vostro/.test(text)) {
    if (/alienware/.test(text)) {
      return {
        colors: ['Mặt Tối Mặt Trăng (Dark Side of the Moon)', 'Ánh Trăng (Lunar Light)'],
        ram: ['16GB DDR5 4800MHz (2x8GB)', '32GB DDR5 4800MHz (2x16GB)', '64GB DDR5 XMP Extreme'],
        ramDetails: [
          { label: '16GB DDR5 4800MHz (2x8GB)', priceDelta: 0 },
          { label: '32GB DDR5 4800MHz (2x16GB)', priceDelta: 1800000 },
          { label: '64GB DDR5 XMP Extreme', priceDelta: 4200000 },
        ],
      };
    }
    if (/g15|5530/.test(text) && /gaming/.test(text)) {
      return {
        colors: ['Xám Bóng Ma (Dark Shadow Gray)', 'Đen Lượng Tử (Quantum Black)', 'Xanh Pop Purple / Cam Coral'],
        ram: ['8GB DDR5 4800MHz', '16GB DDR5 4800MHz (2x8GB)', '32GB DDR5 5200MHz (2x16GB)'],
        ramDetails: [
          { label: '8GB DDR5 4800MHz', priceDelta: 0 },
          { label: '16GB DDR5 4800MHz (2x8GB)', priceDelta: 850000 },
          { label: '32GB DDR5 5200MHz (2x16GB)', priceDelta: 1950000 },
        ],
      };
    }
    if (/g3|g3 3500/.test(text)) {
      return {
        colors: ['Đen Eclipse Black (Viền xanh Glacial Blue)', 'Trắng Alpine White'],
        ram: ['8GB DDR4 2933MHz', '16GB DDR4 2933MHz (2x8GB Dual)', '32GB DDR4 2933MHz (2x16GB)'],
        ramDetails: [
          { label: '8GB DDR4 2933MHz', priceDelta: 0 },
          { label: '16GB DDR4 2933MHz (2x8GB Dual)', priceDelta: 750000 },
          { label: '32GB DDR4 2933MHz (2x16GB)', priceDelta: 1750000 },
        ],
      };
    }
    if (/precision/.test(text)) {
      const isHeavy = /7510|7520|7530|7540|7550|7560|7670/.test(text);
      if (isHeavy) {
        return {
          colors: ['Đen Nhám Titan (Aluminum Gray & Carbon)', 'Xám Đậm Chuyên Dụng (Matte Gray)'],
          ram: ['16GB DDR4/DDR5 ECC/Non-ECC', '32GB DDR4/DDR5 (2x16GB)', '64GB DDR4/DDR5 (4x16GB)', '128GB DDR4/CAMM DDR5 Super Workstation'],
          ramDetails: [
            { label: '16GB DDR4/DDR5 ECC/Non-ECC', priceDelta: 0 },
            { label: '32GB DDR4/DDR5 (2x16GB)', priceDelta: 1600000 },
            { label: '64GB DDR4/DDR5 (4x16GB)', priceDelta: 3800000 },
            { label: '128GB DDR4/CAMM DDR5 Super Workstation', priceDelta: 8500000 },
          ],
        };
      }
      return {
        colors: ['Xám Nhôm Titan (Titan Gray Carbon)', 'Bạc Bạch Kim (Platinum Silver)'],
        ram: ['16GB DDR4 Dual-Channel', '32GB DDR4 (2x16GB)', '64GB DDR4 (2x32GB Chuyên Đồ Họa)'],
        ramDetails: [
          { label: '16GB DDR4 Dual-Channel', priceDelta: 0 },
          { label: '32GB DDR4 (2x16GB)', priceDelta: 1600000 },
          { label: '64GB DDR4 (2x32GB Chuyên Đồ Họa)', priceDelta: 3800000 },
        ],
      };
    }
    if (/xps/.test(text)) {
      if (/9640|9320|plus/.test(text)) {
        return {
          colors: ['Bạc Bạch Kim (Platinum Silver)', 'Xám Than Chì (Graphite Gray)'],
          ram: ['16GB LPDDR5X 7467MHz', '32GB LPDDR5X 7467MHz', '64GB LPDDR5X High-Speed'],
          ramDetails: [
            { label: '16GB LPDDR5X 7467MHz', priceDelta: 0 },
            { label: '32GB LPDDR5X 7467MHz', priceDelta: 1800000 },
            { label: '64GB LPDDR5X High-Speed', priceDelta: 4200000 },
          ],
        };
      }
      return {
        colors: ['Bạc Bạch Kim (Platinum Silver - Chiếu nghỉ Carbon)', 'Trắng Băng Giá (Frost White - Sợi thủy tinh)'],
        ram: ['8GB LPDDR4x/LPDDR5 Dual-Channel', '16GB LPDDR4x/LPDDR5 Dual-Channel', '32GB LPDDR4x/LPDDR5 Dual-Channel'],
        ramDetails: [
          { label: '8GB LPDDR4x/LPDDR5 Dual-Channel', priceDelta: 0 },
          { label: '16GB LPDDR4x/LPDDR5 Dual-Channel', priceDelta: 1200000 },
          { label: '32GB LPDDR4x/LPDDR5 Dual-Channel', priceDelta: 2600000 },
        ],
      };
    }
    if (/latitude/.test(text)) {
      const is16Base = /16gb|5530|7410/.test(text);
      if (is16Base) {
        return {
          colors: ['Đen Carbon Doanh Nhân (Carbon Black)', 'Xám Titan (Titan Gray)'],
          ram: ['16GB DDR4 Dual-Channel (2x8GB)', '32GB DDR4 (2x16GB)'],
          ramDetails: [
            { label: '16GB DDR4 Dual-Channel (2x8GB)', priceDelta: 0 },
            { label: '32GB DDR4 (2x16GB)', priceDelta: 1200000 },
          ],
        };
      }
      return {
        colors: ['Đen Carbon Doanh Nhân (Carbon Black)', 'Xám Titan (Titan Gray)'],
        ram: ['8GB DDR4 2400/3200MHz', '16GB DDR4 Dual-Channel (2x8GB)', '32GB DDR4 (2x16GB)'],
        ramDetails: [
          { label: '8GB DDR4 2400/3200MHz', priceDelta: 0 },
          { label: '16GB DDR4 Dual-Channel (2x8GB)', priceDelta: 700000 },
          { label: '32GB DDR4 (2x16GB)', priceDelta: 1650000 },
        ],
      };
    }
    if (/7435/.test(text) && /2-in-1/.test(text)) {
      return {
        colors: ['Xanh Lam Tối (Midnight Blue)', 'Bạc Ánh Kim (Silver)'],
        ram: ['8GB LPDDR5 4800MHz', '16GB LPDDR5 4800MHz'],
        ramDetails: [
          { label: '8GB LPDDR5 4800MHz', priceDelta: 0 },
          { label: '16GB LPDDR5 4800MHz', priceDelta: 900000 },
        ],
      };
    }
    if (/plus|7430|7440|7610|5640/.test(text)) {
      return {
        colors: ['Bạc Bạch Kim (Platinum Silver)', 'Xanh Băng Tuyết (Ice Blue)', 'Xanh Rêu Đậm (Dark Green)'],
        ram: ['16GB LPDDR5 4800MHz', '32GB LPDDR5 5200MHz (2x16GB)'],
        ramDetails: [
          { label: '16GB LPDDR5 4800MHz', priceDelta: 0 },
          { label: '32GB LPDDR5 5200MHz (2x16GB)', priceDelta: 1600000 },
        ],
      };
    }
    const is16BaseInsp = /16gb|16g/.test(text);
    return {
      colors: ['Bạc Bạch Kim (Platinum Silver)', 'Xám Than Chì (Carbon Black)', 'Xanh Titan (Titan Gray)'],
      ram: is16BaseInsp
        ? ['16GB DDR4/DDR5 (Dual-Channel)', '32GB DDR4/DDR5 (2x16GB)']
        : ['8GB DDR4/DDR5 3200MHz', '16GB DDR4/DDR5 (Dual-Channel)', '32GB DDR4/DDR5 (2x16GB)'],
      ramDetails: is16BaseInsp
        ? [
            { label: '16GB DDR4/DDR5 (Dual-Channel)', priceDelta: 0 },
            { label: '32GB DDR4/DDR5 (2x16GB)', priceDelta: 1200000 },
          ]
        : [
            { label: '8GB DDR4/DDR5 3200MHz', priceDelta: 0 },
            { label: '16GB DDR4/DDR5 (Dual-Channel)', priceDelta: 750000 },
            { label: '32GB DDR4/DDR5 (2x16GB)', priceDelta: 1750000 },
          ],
    };
  }

  // 6. HP (EliteBook, Envy, Pavilion, HP 15)
  if (/hp|elitebook|envy|pavilion|15-fd/.test(text)) {
    if (/elitebook/.test(text)) {
      return {
        colors: ['Bạc Tự Nhiên (Natural Silver - Nhôm nguyên khối)', 'Xám Khói Doanh Nghiệp'],
        ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (2x8GB Dual)', '32GB DDR4 3200MHz (2x16GB)'],
        ramDetails: [
          { label: '8GB DDR4 3200MHz', priceDelta: 0 },
          { label: '16GB DDR4 3200MHz (2x8GB Dual)', priceDelta: 750000 },
          { label: '32GB DDR4 3200MHz (2x16GB)', priceDelta: 1750000 },
        ],
      };
    }
    if (/envy/.test(text)) {
      return {
        colors: ['Bạc Tự Nhiên (Natural Silver)', 'Đen Bóng Đêm (Nightfall Black)'],
        ram: ['16GB LPDDR5 5200MHz Onboard', '32GB LPDDR5 5200MHz Onboard'],
        ramDetails: [
          { label: '16GB LPDDR5 5200MHz Onboard', priceDelta: 0 },
          { label: '32GB LPDDR5 5200MHz Onboard', priceDelta: 1800000 },
        ],
      };
    }
    return {
      colors: ['Bạc Tự Nhiên (Natural Silver)', 'Vàng Ấm Áp (Warm Gold)', 'Xanh Vân Sam (Spruce Blue)'],
      ram: ['8GB DDR4 3200MHz', '16GB DDR4 3200MHz (2x8GB Dual)', '32GB DDR4 3200MHz (2x16GB)'],
      ramDetails: [
        { label: '8GB DDR4 3200MHz', priceDelta: 0 },
        { label: '16GB DDR4 3200MHz (2x8GB Dual)', priceDelta: 750000 },
        { label: '32GB DDR4 3200MHz (2x16GB)', priceDelta: 1750000 },
      ],
    };
  }

  // 7. Microsoft Surface
  if (/surface/.test(text)) {
    return {
      colors: ['Bạch Kim (Platinum)', 'Đen Mờ (Matte Black)', 'Xanh Băng Tuyết (Ice Blue)', 'Vàng Sa Mộc (Sandstone)', 'Xanh Xô Thơm (Sage Green)'],
      ram: ['8GB LPDDR4x/LPDDR5', '16GB LPDDR4x/LPDDR5 Dual-Channel', '32GB LPDDR5 (Đồ Họa Cao)'],
      ramDetails: [
        { label: '8GB LPDDR4x/LPDDR5', priceDelta: 0 },
        { label: '16GB LPDDR4x/LPDDR5 Dual-Channel', priceDelta: 1500000 },
        { label: '32GB LPDDR5 (Đồ Họa Cao)', priceDelta: 3500000 },
      ],
    };
  }

  // 8. lap-001 to lap-009 / Generic
  if (/pro gaming|lap-001|gaming/.test(text)) {
    return {
      colors: ['Đen Huyền Bí (Shadow Black)', 'Xám Titan (Gunmetal Gray)'],
      ram: ['16GB DDR5 5600MHz', '32GB DDR5 5600MHz', '64GB DDR5 5600MHz'],
      ramDetails: [
        { label: '16GB DDR5 5600MHz', priceDelta: 0 },
        { label: '32GB DDR5 5600MHz', priceDelta: 1600000 },
        { label: '64GB DDR5 5600MHz', priceDelta: 3800000 },
      ],
    };
  }

  return {
    colors: ['Bạc Ánh Trăng (Lunar Silver)', 'Xám Không Gian (Space Gray)', 'Xanh Biển Sâu (Deep Ocean)'],
    ram: ['16GB LPDDR5 6400MHz', '32GB LPDDR5 6400MHz'],
    ramDetails: [
      { label: '16GB LPDDR5 6400MHz', priceDelta: 0 },
      { label: '32GB LPDDR5 6400MHz', priceDelta: 1600000 },
    ],
  };
}

export function enrichProductConfigurations<T extends { id?: string; name?: string; category?: string; category_id?: string; configurations?: any }>(item: T): T {
  if (!item) return item;
  const id = String(item.id || '');
  const cat = String(item.category_id || item.category || '').toLowerCase();
  const name = String(item.name || '').toLowerCase();
  const isLaptop =
    cat.includes('laptop') ||
    name.includes('laptop') ||
    name.includes('macbook') ||
    id.startsWith('l360-') ||
    id.startsWith('lap-');

  if (isLaptop) {
    const laptopConfig = getLaptopConfigurations(item as any);
    return {
      ...item,
      configurations: {
        ...laptopConfig,
        ...(item.configurations || {}),
        colors:
          Array.isArray(item.configurations?.colors) && item.configurations.colors.length > 0
            ? item.configurations.colors
            : laptopConfig.colors,
        ram:
          Array.isArray(item.configurations?.ram) && item.configurations.ram.length > 0
            ? item.configurations.ram
            : laptopConfig.ram,
        ramDetails: laptopConfig.ramDetails,
      },
    };
  }
  return item;
}

export function assignUniqueProductImages<T extends { id: string; name: string; category?: string; category_id?: string; image?: string; images?: string[]; configurations?: any }>(items: T[]): T[] {
  // Track which image index has been assigned per category to guarantee uniqueness
  const categoryCounters: Record<string, number> = {};

  return items.map((rawItem) => {
    const item = enrichProductConfigurations(rawItem);
    // 1. Products with explicit overrides keep their own image IF NOT BLOCKED
    if (PRODUCT_IMAGE_OVERRIDES[item.id] && !isInvalidOrBlockedImageUrl(PRODUCT_IMAGE_OVERRIDES[item.id])) {
      const image = PRODUCT_IMAGE_OVERRIDES[item.id];
      return { ...item, image, images: [image] } as T;
    }

    // 2. Products that already have a unique non-unsplash image IF NOT BLOCKED
    if (
      item.image &&
      !isInvalidOrBlockedImageUrl(item.image) &&
      !item.image.includes('unsplash.com') &&
      item.image.startsWith('http')
    ) {
      return { ...item, image: item.image, images: [item.image] } as T;
    }

    // 3. Assign from the clean pool sequentially to guarantee unique images per category
    const category = getProductImageCategory(item);
    const rawPool = CATEGORY_PRODUCT_IMAGES[category] ?? CATEGORY_PRODUCT_IMAGES.default;
    const imagePool = rawPool.filter((img) => !isInvalidOrBlockedImageUrl(img));
    const poolToUse = imagePool.length > 0 ? imagePool : CATEGORY_PRODUCT_IMAGES.default;

    if (!categoryCounters[category]) {
      categoryCounters[category] = 0;
    }
    const idx = categoryCounters[category];
    categoryCounters[category] += 1;

    const image = poolToUse[idx % poolToUse.length];
    return { ...item, image, images: [image] } as T;
  });
}

export function normalizeProductImages<T extends { id: string; name: string; category?: string; category_id?: string; image?: string; images?: string[] }>(items: T[]): T[] {
  return assignUniqueProductImages(items);
}

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
  },
  {
    "id": "apple",
    "name": "Apple",
    "count": 7,
    "icon": "",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "audio-cam",
    "name": "Loa, Micro, Webcam",
    "count": 9,
    "icon": "🎙️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "desk-chair",
    "name": "Ghế - Bàn",
    "count": 7,
    "icon": "🪑",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "accessories-console",
    "name": "Phụ Kiện - Console",
    "count": 8,
    "icon": "🎮",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "case-psu-cooling",
    "name": "Case, Nguồn, Tản",
    "count": 14,
    "icon": "🧊",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "case",
    "name": "Vỏ Case",
    "count": 5,
    "icon": "🖥️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "cooling",
    "name": "Tản nhiệt",
    "count": 5,
    "icon": "❄️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "mainboard",
    "name": "Bo mạch chủ",
    "count": 3,
    "icon": "⚙️",
    "createdAt": "2026-09-22T14:02:40.000Z"
  },
  {
    "id": "psu",
    "name": "Nguồn (PSU)",
    "count": 4,
    "icon": "🔌",
    "createdAt": "2026-09-22T14:02:40.000Z"
  }
];

const additionalCategoryProducts: Product[] = [
  { id: 'mainboard-001', name: 'Mainboard ASUS TUF Gaming B760M-PLUS WIFI II DDR5', category_id: 'mainboard', price: 4490000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80', specifications: { 'Socket': 'Intel LGA1700', 'Bộ nhớ': 'DDR5, 4 khe DIMM', 'Kết nối': 'Wi-Fi 6, 2.5Gb LAN' } },
  { id: 'mainboard-002', name: 'Mainboard MSI PRO B650M-A WIFI DDR5', category_id: 'mainboard', price: 3690000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80', specifications: { 'Socket': 'AMD AM5', 'Bộ nhớ': 'DDR5, tối đa 192GB', 'Kết nối': 'Wi-Fi 6E, 2.5Gb LAN' } },
  { id: 'mainboard-003', name: 'Mainboard Gigabyte Z790 AORUS ELITE AX DDR5', category_id: 'mainboard', price: 7290000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80', specifications: { 'Socket': 'Intel LGA1700', 'Bộ nhớ': 'DDR5 7600MHz OC', 'Kết nối': 'Wi-Fi 6E, PCIe 5.0' } },
  { id: 'psu-001', name: 'Nguồn Corsair RM750e 750W 80 Plus Gold ATX 3.0', category_id: 'psu', price: 2590000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80', specifications: { 'Công suất': '750W', 'Chứng nhận': '80 Plus Gold', 'Tiêu chuẩn': 'ATX 3.0, PCIe 5.0' } },
  { id: 'psu-002', name: 'Nguồn Cooler Master MWE 650 Bronze V2 650W', category_id: 'psu', price: 1290000, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80', specifications: { 'Công suất': '650W', 'Chứng nhận': '80 Plus Bronze', 'Quạt': '120mm HDB yên tĩnh' } },
  { id: 'psu-003', name: 'Nguồn ASUS ROG STRIX 1000W Gold Aura Edition', category_id: 'psu', price: 6490000, image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80', specifications: { 'Công suất': '1000W', 'Chứng nhận': '80 Plus Gold', 'Tiêu chuẩn': 'ATX 3.0, cáp PCIe 5.0' } },
  { id: 'case-001', name: 'Vỏ Case Corsair 4000D Airflow Mid-Tower', category_id: 'case', price: 2390000, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80', specifications: { 'Kích thước': 'Mid-Tower', 'Mặt trước': 'Lưới Airflow', 'Hỗ trợ VGA': 'Tối đa 360mm' } },
  { id: 'case-002', name: 'Vỏ Case NZXT H6 Flow RGB White', category_id: 'case', price: 3690000, image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80', specifications: { 'Thiết kế': 'Panoramic hai mặt kính', 'Quạt': 'Tích hợp 3 quạt RGB', 'Hỗ trợ mainboard': 'ATX, Micro-ATX, Mini-ITX' } },
  { id: 'case-003', name: 'Vỏ Case Montech KING 95 PRO Panorama Black', category_id: 'case', price: 3290000, image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80', specifications: { 'Thiết kế': 'Kính cong panorama', 'Quạt': '6 quạt ARGB đi kèm', 'Hỗ trợ tản nhiệt': 'Radiator tối đa 360mm' } },
  { id: 'cooling-001', name: 'Tản nhiệt khí DeepCool AK620 Digital', category_id: 'cooling', price: 1890000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80', specifications: { 'Loại tản': 'Khí, hai tháp', 'Quạt': '2 x 120mm PWM', 'Socket': 'Intel LGA1700, AMD AM5' } },
  { id: 'cooling-002', name: 'Tản nhiệt khí Thermalright Peerless Assassin 120 SE', category_id: 'cooling', price: 990000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80', specifications: { 'Loại tản': 'Khí, dual tower', 'Quạt': '2 x 120mm PWM', 'Socket': 'Intel LGA1700, AMD AM5' } },
  { id: 'cooling-003', name: 'Tản nhiệt nước Corsair iCUE LINK H150i LCD 360mm', category_id: 'cooling', price: 6890000, image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80', specifications: { 'Kích thước radiator': '360mm', 'Màn hình': 'IPS LCD 2.1 inch', 'Socket': 'Intel LGA1700/1851, AMD AM5/AM4' } },
  { id: 'apple-001', name: 'Apple MacBook Air 13 inch M4 16GB 256GB Midnight', category_id: 'apple', price: 26990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80', specifications: { 'Chip': 'Apple M4', 'Bộ nhớ': '16GB unified memory', 'Lưu trữ': '256GB SSD' } },
  { id: 'apple-002', name: 'Apple Mac mini M4 16GB 256GB', category_id: 'apple', price: 14990000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80', specifications: { 'Chip': 'Apple M4', 'Bộ nhớ': '16GB unified memory', 'Lưu trữ': '256GB SSD' } },
  { id: 'apple-003', name: 'Apple iMac 24 inch M4 16GB 256GB', category_id: 'apple', price: 34990000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80', specifications: { 'Chip': 'Apple M4', 'Màn hình': '24 inch Retina 4.5K', 'Bộ nhớ': '16GB unified memory' } },

  // ===== LOA, MICRO, WEBCAM (audio-cam) =====
  {
    id: 'audio-001',
    name: 'Loa Gaming Razer Nommo V2 Chroma 2.1 THX Spatial Audio',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 5990000,
    oldPrice: 6890000,
    discount: 13,
    rating: 4.9,
    reviewCount: 42,
    stock: 18,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    description: 'Hệ thống loa gaming 2.1 đỉnh cao Razer Nommo V2 Chroma sở hữu hai củ loa toàn dải 3.2 inch cao cấp kèm Subwoofer đánh sàn không dây uy lực. Tích hợp chuẩn âm thanh vòm THX Spatial Audio định vị chuẩn xác và dải LED RGB Razer Chroma hắt tường cực chill.',
    specifications: { 'Hệ thống âm thanh': '2.1 Kèm Subwoofer Không Dây', 'Củ loa': 'Full-range 3.2 inch', 'Công nghệ': 'THX Spatial Audio 7.1', 'Kết nối': 'USB Type-C, Bluetooth 5.3' },
    features: ['Âm trầm uy lực với Subwoofer không dây hướng sàn', 'Đèn LED chiếu tường Razer Chroma RGB', 'Chứng nhận âm thanh vòm THX Spatial Audio']
  },
  {
    id: 'audio-002',
    name: 'Loa máy tính Bluetooth Edifier S880DB Hi-Res Audio Studio',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 4890000,
    oldPrice: 5500000,
    discount: 11,
    rating: 4.9,
    reviewCount: 38,
    stock: 22,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: false,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    description: 'Loa kiểm âm để bàn Edifier S880DB chuẩn Hi-Res Audio cao cấp với chip giải mã XMOS chuyên dụng. Thiết kế vỏ gỗ trắng tinh tế, củ loa màng Titan sắc sảo mang lại dải âm chi tiết cho người nghe nhạc khó tính và setup góc làm việc tối giản.',
    specifications: { 'Chứng nhận': 'Hi-Res Audio 24-bit/192kHz', 'Công suất': '88W RMS', 'Ngõ vào': 'USB, Optical, Coaxial, RCA, Bluetooth 5.0 aptX', 'Vỏ loa': 'Gỗ MDF tự nhiên cao cấp' },
    features: ['Chip DAC XMOS chuyên nghiệp', 'Treble màng Titanium độ méo tiếng siêu thấp', 'Đa dạng cổng kết nối cho PC và TV']
  },
  {
    id: 'audio-003',
    name: 'Loa Gaming Logitech G560 RGB LIGHTSYNC 240W Peak',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 4290000,
    oldPrice: 4990000,
    discount: 14,
    rating: 4.8,
    reviewCount: 51,
    stock: 15,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
    description: 'Loa vi tính chuyên game Logitech G560 trang bị công nghệ đồng bộ ánh sáng LIGHTSYNC RGB 4 vùng theo hình ảnh hiển thị trên màn hình. Âm thanh vòm DTS:X Ultra sống động giúp tái hiện tiếng bước chân và hiệu ứng cháy nổ chân thực.',
    specifications: { 'Công suất cực đại': '240W (120W RMS)', 'Âm thanh vòm': 'DTS:X Ultra Surround Sound', 'LED': 'LIGHTSYNC RGB 4 vùng', 'Kết nối': 'USB, 3.5mm, Bluetooth 4.1' },
    features: ['Đồng bộ LED theo tiết tấu game và âm nhạc', 'Subwoofer đánh sàn uy lực', 'Chuyển đổi âm thanh tức thì giữa 4 thiết bị']
  },
  {
    id: 'audio-004',
    name: 'Micro thu âm HyperX QuadCast S RGB Chuyên Streamer & Podcast',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 3490000,
    oldPrice: 3990000,
    discount: 12,
    rating: 5.0,
    reviewCount: 79,
    stock: 30,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    description: 'Microphone condenser USB HyperX QuadCast S là sự lựa chọn số 1 của các streamer hàng đầu thế giới. Sở hữu 4 định dạng thu âm linh hoạt, chân chống sốc đàn hồi giảm rung chấn, cảm biến chạm tắt mic tiện lợi với đèn LED hiển thị trạng thái bắt mắt.',
    specifications: { 'Kiểu micro': 'Condenser 3 màng thu 14mm', 'Định dạng cực': 'Stereo, Đa hướng, Định hướng (Cardioid), Hai hướng', 'Tần số đáp ứng': '20Hz – 20kHz', 'Kết nối': 'USB-C sang USB-A' },
    features: ['Cảm biến chạm ngắt tiếng Tap-to-Mute với đèn LED', 'Khung chống sốc giảm rung chấn tích hợp', 'Tích hợp bộ lọc âm Pop Filter trong thân micro']
  },
  {
    id: 'audio-005',
    name: 'Micro thu âm Elgato Wave:3 USB Condenser Chống Vỡ Tiếng Clipguard',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 3890000,
    oldPrice: 4490000,
    discount: 13,
    rating: 4.9,
    reviewCount: 46,
    stock: 24,
    isFeatured: true,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    description: 'Microphone chuyên nghiệp cho nhà sáng tạo nội dung Elgato Wave:3 sở hữu củ mic mạ vàng độ nhạy cao. Công nghệ Clipguard tự động chuyển hướng tín hiệu khi âm lượng vượt ngưỡng giúp giọng nói không bao giờ bị rè hay méo tiếng.',
    specifications: { 'Củ mic': 'Electret Condenser 17mm', 'Độ phân giải': '24-bit / 96kHz', 'Phần mềm': 'Wave Link Digital Mixer trộn 9 kênh', 'Cổng kết nối': 'USB-C, Jack 3.5mm kiểm âm zero-latency' },
    features: ['Công nghệ chống méo tiếng độc quyền Clipguard', 'Phần mềm Wave Link trộn âm thanh chuyên nghiệp', 'Nút vặn đa năng điều chỉnh Gain, Volume và Headphone']
  },
  {
    id: 'audio-006',
    name: 'Micro Dynamic Rode PodMic USB & XLR Broadcast Grade',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 4690000,
    oldPrice: 5190000,
    discount: 9,
    rating: 4.9,
    reviewCount: 32,
    stock: 16,
    isFeatured: false,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1520523839898-50712825e3e7?auto=format&fit=crop&w=800&q=80',
    description: 'Rode PodMic USB là micro dynamic phát thanh cao cấp hỗ trợ cả kết nối kỹ thuật số USB-C và analog XLR cổ điển. Tích hợp bộ xử lý DSP APHEX chuyên sâu mang lại chất giọng dày ấm, hạn chế tối đa tiếng ồn xung quanh phòng không tiêu âm.',
    specifications: { 'Nguyên lý': 'Dynamic', 'Định dạng': 'Cardioid định hướng cao', 'DSP tích hợp': 'APHEX Big Bottom, Aural Exciter, Noise Gate', 'Thân vỏ': 'Kim loại nguyên khối siêu bền' },
    features: ['Hỗ trợ kết hợp kép USB-C và XLR linh hoạt', 'Màng lọc gió và chống rung bên trong củ mic', 'Đầu ra tai nghe kiểm âm không độ trễ']
  },
  {
    id: 'cam-001',
    name: 'Webcam Elgato Facecam Pro 4K60 Ultra HD 60FPS Sony STARVIS',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 7990000,
    oldPrice: 8990000,
    discount: 11,
    rating: 5.0,
    reviewCount: 28,
    stock: 12,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80',
    description: 'Webcam đầu tiên trên thế giới có khả năng ghi hình 4K ở tốc độ khung hình 60fps mượt mà không nén. Trang bị ống kính Elgato Prime Lens khẩu độ f/2.0 cùng cảm biến Sony STARVIS kích thước lớn cho chất lượng hình ảnh sánh ngang máy ảnh cơ mirrorless.',
    specifications: { 'Độ phân giải': '4K 2160p 60fps, 1080p 60fps', 'Cảm biến': 'Sony STARVIS CMOS 1/1.8 inch', 'Ống kính': 'Elgato Prime Lens f/2.0 21mm', 'Góc nhìn': 'FOV 90 độ có lấy nét tự động' },
    features: ['Quay 4K60 không độ trễ với cổng USB 3.0', 'Tự động lấy nét và chỉnh tay chuyên sâu qua Camera Hub', 'Bộ nhớ Flash onboard lưu cài đặt trực tiếp']
  },
  {
    id: 'cam-002',
    name: 'Webcam Logitech Brio 4K Ultra HD RightLight 3 HDR Windows Hello',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 3790000,
    oldPrice: 4490000,
    discount: 15,
    rating: 4.8,
    reviewCount: 65,
    stock: 25,
    isFeatured: true,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: 'Webcam Logitech Brio 4K cao cấp mang lại hình ảnh sắc nét trong mọi điều kiện ánh sáng nhờ công nghệ RightLight 3 và HDR. Tích hợp cảm biến hồng ngoại bảo mật hỗ trợ đăng nhập khuôn mặt Windows Hello nhanh chóng và an toàn.',
    specifications: { 'Độ phân giải': '4K/30fps, 1080p/60fps, 720p/90fps', 'Góc nhìn tùy chỉnh': '65°, 78° và 90°', 'Microphone': 'Mic kép tích hợp khử tiếng ồn', 'Bảo mật': 'Cảm biến hồng ngoại Windows Hello' },
    features: ['Công nghệ RightLight 3 cân bằng sáng tự động', 'Zoom kỹ thuật số 5x sắc nét', 'Hỗ trợ nắp che bảo vệ quyền riêng tư']
  },
  {
    id: 'cam-003',
    name: 'Webcam Razer Kiyo Pro Full HD 60FPS Cảm Biến Ánh Sáng Thích Ứng STARVIS',
    category_id: 'audio-cam',
    category: 'audio-cam',
    price: 2890000,
    oldPrice: 3690000,
    discount: 21,
    rating: 4.8,
    reviewCount: 39,
    stock: 20,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: false,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    description: 'Webcam livestream Razer Kiyo Pro trang bị cảm biến ánh sáng thích ứng siêu nhạy Type 1/2.8 STARVIS. Dù trong điều kiện ánh sáng yếu hoặc ngược sáng, khung hình vẫn luôn giữ được độ sáng rõ, màu sắc chân thực và độ mượt mà 60fps.',
    specifications: { 'Độ phân giải': '1080p 60fps (Hỗ trợ HDR ở 30fps)', 'Kính bảo vệ': 'Corning Gorilla Glass 3', 'Góc nhìn': 'Tùy chỉnh 103°, 90°, 80°', 'Kết nối': 'USB 3.0' },
    features: ['Cảm biến ánh sáng thích ứng thông minh', 'Hỗ trợ HDR rực rỡ màu sắc', 'Kính cường lực Gorilla Glass chống trầy']
  },

  // ===== GHẾ - BÀN (desk-chair) =====
  {
    id: 'chair-001',
    name: 'Ghế công thái học Sihoo Doro C300 Ergonomic Chair Lưới Vân Mây',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 6890000,
    oldPrice: 7990000,
    discount: 13,
    rating: 4.9,
    reviewCount: 54,
    stock: 16,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1580481077195-c328ad4f3918?auto=format&fit=crop&w=800&q=80',
    description: 'Ghế công thái học Sihoo Doro C300 sở hữu thiết kế tựa lưng khí động học tự điều chỉnh ôm khít đốt sống lưng theo mọi tư thế ngồi. Chất liệu lưới vân mây Cloud Mesh đàn hồi êm ái, bệ đỡ tay 6D gập mở linh hoạt giải tỏa áp lực vai gáy khi ngồi làm việc lâu.',
    specifications: { 'Chất liệu': 'Lưới Cloud Mesh thoáng khí cao cấp', 'Kê tay': '6D điều chỉnh đa hướng', 'Tựa đầu': '3D linh hoạt ôm sát cổ', 'Piston nâng hạ': 'Class 4 chứng nhận an toàn TUV' },
    features: ['Hệ thống đệm lưng tự động theo dõi chuyển động eo', 'Góc ngả lưng thư giãn tới 135 độ', 'Khung chân hợp kim nhôm chịu tải 150kg']
  },
  {
    id: 'chair-002',
    name: 'Ghế công thái học Herman Miller Aeron Chair Remastered Mineral Size B',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 36900000,
    oldPrice: 39500000,
    discount: 6,
    rating: 5.0,
    reviewCount: 19,
    stock: 8,
    isFeatured: true,
    isNew: false,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    description: 'Biểu tượng ghế công thái học số một toàn cầu Herman Miller Aeron Remastered màu Mineral thanh lịch. Lưới Pellicle 8Z phân tán trọng lực hoàn hảo trên 8 vùng cơ thể, kết hợp đệm hỗ trợ xương cùng PostureFit SL giúp cột sống luôn ở tư thế chuẩn nhất.',
    specifications: { 'Xuất xứ': 'Hoa Kỳ (USA)', 'Lưới đệm': 'Pellicle 8Z độc quyền', 'Hỗ trợ cột sống': 'Dual PostureFit SL', 'Bảo hành': '12 năm tiêu chuẩn chính hãng' },
    features: ['Chuẩn mực bảo vệ cột sống và đĩa đệm', 'Cơ chế ngả ghế Harmonic 2 Tilt mượt mà tự nhiên', 'Vật liệu tái chế thân thiện môi trường']
  },
  {
    id: 'chair-003',
    name: 'Ghế Gaming Corsair TC100 Relaxed Fabric Vải Nỉ Thoáng Khí',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 4890000,
    oldPrice: 5490000,
    discount: 10,
    rating: 4.8,
    reviewCount: 37,
    stock: 19,
    isFeatured: false,
    isNew: true,
    isSale: true,
    isHot: false,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    description: 'Ghế chơi game Corsair TC100 Relaxed bọc vải nỉ mềm mại mang lại cảm giác thoáng mát tối đa trong mùa hè oi bức. Thiết kế lòng ghế rộng rãi, đệm mút đúc dày dặn kèm gối tựa đầu và đệm lưng nhớ hình memory foam êm ái.',
    specifications: { 'Chất liệu bọc': 'Vải nỉ cao cấp dệt sợi thoáng khí', 'Góc ngả lưng': '90° đến 160°', 'Khung sườn': 'Thép nguyên khối gia cường', 'Piston': 'Class 4 chịu tải 120kg' },
    features: ['Bề mặt vải nỉ êm dịu không hầm bí', 'Lòng ghế mở rộng thoải mái cho mọi vóc dáng', 'Kèm đệm đầu và đệm lưng êm ái']
  },
  {
    id: 'chair-004',
    name: 'Ghế Gaming E-Dra Hercules EGC203 Pro Chân Thép Đúc Da PU Cao Cấp',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 3290000,
    oldPrice: 3890000,
    discount: 15,
    rating: 4.8,
    reviewCount: 58,
    stock: 24,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    description: 'Ghế gaming quốc dân E-Dra Hercules EGC203 Pro trang bị khung thép hộp siêu cứng cáp, chân hợp kim nhôm đúc sáng bóng và da PU vân Carbon chống trầy. Tay vịn 4D nâng hạ xoay linh hoạt cho tư thế kê tay thoải mái nhất khi chiến game.',
    specifications: { 'Chất liệu': 'Da PU cao cấp dễ vệ sinh', 'Khung ghế': 'Khung kim loại hộp 100%', 'Kê tay': '4D điều chỉnh 4 hướng', 'Trọng tải tối đa': '150kg' },
    features: ['Khung thép hộp chịu lực bền bỉ nhiều năm', 'Bánh xe PU giảm ồn chống xước sàn gỗ', 'Góc ngả 180 độ nằm nghỉ ngơi thoải mái']
  },
  {
    id: 'desk-001',
    name: 'Bàn nâng hạ thông minh Ergonomic SmartDesk Pro HyperWork Atlas 140x70cm',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 7990000,
    oldPrice: 9200000,
    discount: 13,
    rating: 4.9,
    reviewCount: 45,
    stock: 14,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    description: 'Bàn làm việc đứng ngồi thông minh HyperWork Atlas trang bị hệ thống động cơ kép Dual-Motor mạnh mẽ, vận hành êm ái dưới 45dB. Mặt bàn gỗ cao su tự nhiên nguyên tấm 140x70cm được bo cong vát mép công thái học, bàn phím điều khiển cảm ứng nhớ 4 vị trí.',
    specifications: { 'Kích thước': '140 x 70 x 2.5 cm', 'Động cơ': 'Dual Motor (2 động cơ độc lập)', 'Phạm vi nâng hạ': '60cm – 125cm', 'Tải trọng nâng': '100kg tĩnh / 80kg động' },
    features: ['Động cơ đôi vận hành siêu êm và đầm chắc', 'Bảng điều khiển cảm ứng nhớ 4 vị trí kèm cổng sạc USB', 'Cảm biến tự dừng khi gặp vật cản an toàn cho trẻ nhỏ']
  },
  {
    id: 'desk-002',
    name: 'Bàn Gaming Chữ Z E-Dra EGT1460 Vân Carbon LED RGB Viền Cạnh',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 1890000,
    oldPrice: 2390000,
    discount: 20,
    rating: 4.8,
    reviewCount: 62,
    stock: 28,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    description: 'Bàn chơi game chữ Z chuyên nghiệp E-Dra EGT1460 kích thước 140x60cm thoải mái đặt 2 màn hình lớn. Mặt bàn phủ film Carbon chống trầy chống nước, khung chân thép hộp chữ Z sơn tĩnh điện chịu lực cao kèm dải đèn LED RGB hông bàn đậm chất gaming.',
    specifications: { 'Kích thước': '140 x 60 x 75 cm', 'Chân bàn': 'Khung thép hộp chữ Z chịu tải 100kg', 'Mặt bàn': 'Gỗ MDF phủ Carbon P2', 'Tiện ích': 'Khay đi dây, giá để cốc, móc tai nghe' },
    features: ['Khung chân chữ Z thể thao vững chãi không rung lắc', 'Đèn LED RGB hai bên hông tạo điểm nhấn góc máy', 'Phụ kiện đi kèm tiện lợi giải phóng mặt bàn']
  },
  {
    id: 'desk-003',
    name: 'Bàn làm việc nâng hạ tự động FlexiSpot Premium E7 Khung 3 Khớp Nâng 125kg',
    category_id: 'desk-chair',
    category: 'desk-chair',
    price: 9890000,
    oldPrice: 11500000,
    discount: 14,
    rating: 5.0,
    reviewCount: 31,
    stock: 10,
    isFeatured: true,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    description: 'Bàn công thái học cao cấp FlexiSpot E7 là dòng flagship với cấu trúc khung chân 3 giai đoạn (3-Stage) làm từ thép carbon siêu dày. Tải trọng nâng hạ khủng lên tới 125kg, hỗ trợ đặt dàn PC nặng và setup 3 màn hình đồ họa chuyên nghiệp.',
    specifications: { 'Tải trọng tối đa': '125kg', 'Khung chân': '3-stage nâng hạ từ 58cm – 123cm', 'Tốc độ nâng': '38mm/s siêu êm', 'Mặt bàn': 'Gỗ sồi tự nhiên chống cong vênh' },
    features: ['Khung chân 3 khớp nâng hạ siêu đầm chắc ở độ cao cực đại', 'Cảm biến chống va chạm thế hệ mới Gyroscope', 'Bảo hành khung và động cơ 5 năm chính hãng']
  },

  // ===== PHỤ KIỆN & CONSOLE (accessories-console) =====
  {
    id: 'console-001',
    name: 'Máy chơi game Sony PlayStation 5 Slim 1TB Standard D-Chassis',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 13490000,
    oldPrice: 14990000,
    discount: 10,
    rating: 5.0,
    reviewCount: 88,
    stock: 20,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    description: 'Máy chơi game thế hệ mới Sony PlayStation 5 Slim có thiết kế thanh thoát nhỏ gọn hơn 30% so với bản tiền nhiệm. Ổ cứng SSD siêu tốc 1TB tải game trong nháy mắt, hỗ trợ đồ họa 4K 120Hz mượt mà cùng công nghệ âm thanh vòm 3D Tempest Audio đỉnh cao.',
    specifications: { 'CPU': 'AMD Zen 2 8 nhân 16 luồng 3.5GHz', 'GPU': 'AMD RDNA 2 10.3 TFLOPS', 'Lưu trữ': 'SSD NVMe 1TB tốc độ 5.5GB/s', 'Ổ đĩa': 'Ultra HD Blu-ray tích hợp' },
    features: ['Hỗ trợ chơi game độ phân giải 4K 120fps sống động', 'Tương thích ngược hơn 4000 tựa game PlayStation 4', 'Kèm tay cầm DualSense với Haptic Feedback chân thực']
  },
  {
    id: 'console-002',
    name: 'Máy chơi game Nintendo Switch OLED Model White 64GB',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 7690000,
    oldPrice: 8490000,
    discount: 9,
    rating: 4.9,
    reviewCount: 71,
    stock: 25,
    isFeatured: true,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    description: 'Nintendo Switch phiên bản OLED nâng tầm trải nghiệm chơi game di động với màn hình 7 inch OLED rực rỡ sắc màu và độ tương phản sâu thẳm. Chân chống phía sau bản rộng dễ dàng điều chỉnh góc nhìn khi chơi bàn, dock sạc có sẵn cổng mạng LAN có dây.',
    specifications: { 'Màn hình': '7.0 inch OLED cảm ứng đa điểm', 'Bộ nhớ trong': '64GB (hỗ trợ thẻ MicroSD tới 2TB)', 'Pin': '4.5 – 9 giờ chơi liên tục', 'Chế độ chơi': 'TV Mode, Tabletop Mode, Handheld Mode' },
    features: ['Màn hình OLED 7 inch màu sắc rực rỡ', 'Hệ thống loa cải tiến âm thanh trong trẻo', 'Dock sạc có cổng LAN có dây ổn định khi chơi online']
  },
  {
    id: 'console-003',
    name: 'Máy chơi game Microsoft Xbox Series X 1TB Đen Nhám 12 TFLOPS',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 14290000,
    oldPrice: 15500000,
    discount: 7,
    rating: 4.9,
    reviewCount: 42,
    stock: 15,
    isFeatured: true,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
    description: 'Cỗ máy console mạnh mẽ nhất từ trước đến nay của Microsoft với sức mạnh tính toán 12 Teraflops. Chơi game 4K sắc nét ở tốc độ 120 khung hình/giây thực sự, tính năng Quick Resume cho phép chuyển đổi qua lại giữa nhiều tựa game ngay tức thì.',
    specifications: { 'Sức mạnh đồ họa': '12 TFLOPS, 52 CUs @ 1.825 GHz RDNA 2', 'Bộ nhớ': '16GB GDDR6', 'Ổ cứng': '1TB Custom NVMe SSD', 'Độ phân giải': 'True 4K Gaming, hỗ trợ 8K HDR' },
    features: ['Tính năng Quick Resume chuyển game không cần tải lại', 'Công nghệ âm thanh không gian 3D Spatial Sound', 'Hỗ trợ dịch vụ Xbox Game Pass kho game khổng lồ']
  },
  {
    id: 'console-004',
    name: 'Tay cầm không dây Sony PlayStation 5 DualSense Edge Wireless Controller',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 4890000,
    oldPrice: 5490000,
    discount: 10,
    rating: 5.0,
    reviewCount: 36,
    stock: 22,
    isFeatured: false,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80',
    description: 'Tay cầm chơi game cao cấp DualSense Edge dành riêng cho game thủ chuyên nghiệp. Cho phép thay thế toàn bộ mô-đun cần analog gạt, tùy chỉnh độ nhạy cò bấm Trigger Stops cơ học, nút gán mặt lưng tiện lợi và lưu hồ sơ cấu hình riêng cho từng tựa game.',
    specifications: { 'Khả năng tùy biến': 'Cần analog tháo rời, cò bấm khóa hành trình', 'Cụm phím lưng': '2 nút kim loại gán lệnh mặt sau', 'Kết nối': 'Bluetooth, Cáp USB-C bện dù có khóa chốt' },
    features: ['Mô-đun cần analog có thể mua thay thế dễ dàng', 'Khóa hành trình cò bấm ngắn hơn cho game bắn súng FPS', 'Hộp đựng cao cấp cho phép cắm sạc trực tiếp bên trong']
  },
  {
    id: 'console-005',
    name: 'Tay cầm không dây Microsoft Xbox Wireless Controller Carbon Black',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 1490000,
    oldPrice: 1790000,
    discount: 16,
    rating: 4.8,
    reviewCount: 94,
    stock: 40,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    description: 'Tay cầm Xbox Wireless Controller phiên bản Carbon Black với thiết kế công thái học hoàn hảo ôm trọn lòng bàn tay. Phím điều hướng D-pad dạng lai thế hệ mới, bề mặt báng cầm vân nhám chống trơn trượt, tương thích tuyệt vời với Windows PC, Xbox, iOS và Android.',
    specifications: { 'Kết nối': 'Xbox Wireless, Bluetooth, USB-C', 'Thời lượng pin': 'Lên đến 40 giờ với pin AA', 'Jack tai nghe': '3.5mm stereo headset jack' },
    features: ['Tương thích cắm là nhận 100% mọi tựa game trên PC Windows', 'Báng cầm và cò bấm có vân nhám bám tay', 'Nút Share chia sẻ nhanh ảnh chụp màn hình clip game']
  },
  {
    id: 'console-006',
    name: 'Tay cầm chơi game Gamesir G7 SE Hall Effect Anti-Drift Chống Trôi',
    category_id: 'accessories-console',
    category: 'accessories-console',
    price: 1150000,
    oldPrice: 1390000,
    discount: 17,
    rating: 4.9,
    reviewCount: 48,
    stock: 35,
    isFeatured: false,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Tay cầm Gamesir G7 SE chứng nhận chính thức từ Xbox sở hữu công nghệ cần gạt Analog và cò bấm Hall Effect từ tính chống trôi vĩnh viễn. Kết nối có dây tần số quét 1000Hz mang lại độ trễ gần như bằng 0, mặt nạ từ tính tháo lắp dễ dàng để custom sơn trang trí.',
    specifications: { 'Công nghệ cảm biến': 'Hall Effect Sticks & Triggers chống trôi', 'Tần số Polling Rate': 'Lên đến 1000Hz (trên PC)', 'Nút lưng': '2 phím macro có lẫy khóa cơ học an toàn' },
    features: ['Cần analog từ tính Hall Effect không bao giờ bị trôi', 'Độ trễ siêu thấp 1000Hz chuẩn thi đấu eSports', 'Lẫy khóa nút phụ mặt sau chống bấm nhầm']
  },
  {
    id: 'pad-001',
    name: 'Bàn di chuột eSports Artisan Hayate Otsu FX Soft XL Nhật Bản',
    category_id: 'mouse',
    category: 'mouse',
    price: 1490000,
    oldPrice: 1690000,
    discount: 11,
    rating: 5.0,
    reviewCount: 63,
    stock: 25,
    isFeatured: true,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    description: 'Bàn di chuột huyền thoại Artisan Hayate Otsu FX sản xuất thủ công 100% tại Nhật Bản. Bề mặt vải dệt đặc biệt cân bằng hoàn hảo giữa tốc độ lướt (Speed) và khả năng dừng chuột chuẩn xác (Control), phần đế xốp tự nhiên bám dính như giác hút trên mặt bàn.',
    specifications: { 'Kích thước': 'XL (490 x 420 x 4 mm)', 'Độ cứng đế': 'Soft (đệm xốp mềm đàn hồi)', 'Xuất xứ': 'Made in Japan' },
    features: ['Bề mặt vải dệt công nghệ cao không bị ảnh hưởng bởi độ ẩm', 'Đường may bo viền thấp hơn bề mặt di chuột', 'Chuẩn mực cao nhất của game thủ FPS chuyên nghiệp']
  },
  {
    id: 'pad-002',
    name: 'Lót chuột Gaming SteelSeries QcK Prism Cloth 3XL LED RGB',
    category_id: 'mouse',
    category: 'mouse',
    price: 1690000,
    oldPrice: 1990000,
    discount: 15,
    rating: 4.8,
    reviewCount: 44,
    stock: 20,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    description: 'Lót chuột siêu to khổng lồ SteelSeries QcK Prism Cloth 3XL với kích thước 122 x 59 cm phủ trọn bàn làm việc của bạn. Viền LED RGB 2 vùng chiếu sáng rực rỡ đồng bộ theo game qua SteelSeries Engine, bề mặt vải vi mô mịn màng tối ưu cho cảm biến chuột quang học.',
    specifications: { 'Kích thước': '3XL (1220 x 590 x 4 mm)', 'Hệ thống LED': 'RGB 2 vùng tùy biến 16.8 triệu màu', 'Bề mặt': 'Vải dệt vi mô độc quyền QcK' },
    features: ['Kích thước 3XL phủ kín bàn đặt vừa phím chuột và gear', 'Đèn LED RGB rực rỡ thông báo Discord và game', 'Đế cao su silicon chống trượt tuyệt đối']
  },

  // ===== APPLE BỔ SUNG (apple) =====
  {
    id: 'apple-004',
    name: 'Apple MacBook Pro 14 inch M4 Pro 24GB RAM 512GB SSD Space Black',
    category_id: 'apple',
    category: 'apple',
    price: 49990000,
    oldPrice: 52990000,
    discount: 5,
    rating: 5.0,
    reviewCount: 38,
    stock: 12,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: 'Đỉnh cao máy tính xách tay chuyên nghiệp với chip Apple M4 Pro đột phá. Màn hình Liquid Retina XDR độ sáng HDR lên đến 1600 nits, chuẩn kết nối Thunderbolt 5 tốc độ truyền dữ liệu 120Gb/s và thời lượng pin không tưởng lên tới 24 giờ liên tục.',
    specifications: { 'Chip xử lý': 'Apple M4 Pro (12-core CPU, 16-core GPU, 16-core Neural Engine)', 'RAM': '24GB Unified Memory', 'Ổ cứng': '512GB SSD siêu tốc', 'Màn hình': '14.2 inch Liquid Retina XDR 120Hz ProMotion' },
    features: ['Sức mạnh xử lý render video 8K và code AI thần tốc', 'Màu Đen Không Gian Space Black sang trọng chống bám vân tay', 'Cổng kết nối Thunderbolt 5 mới nhất']
  },
  {
    id: 'apple-005',
    name: 'Apple iPad Pro 11 inch M4 Ultra-Thin Tandem OLED 256GB Space Black',
    category_id: 'apple',
    category: 'apple',
    price: 27990000,
    oldPrice: 29990000,
    discount: 6,
    rating: 4.9,
    reviewCount: 45,
    stock: 18,
    isFeatured: true,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    description: 'Thiết bị mỏng nhất trong lịch sử Apple chỉ 5.3mm nhưng mang sức mạnh quái vật từ chip Apple M4. Màn hình Ultra Retina XDR sử dụng công nghệ hai lớp tấm nền Tandem OLED mang lại độ sáng và độ tương phản kinh ngạc.',
    specifications: { 'Màn hình': '11 inch Ultra Retina XDR Tandem OLED', 'Chip': 'Apple M4 hiệu năng AI 38 nghìn tỷ phép tính/giây', 'Độ mỏng': '5.3 mm siêu nhẹ', 'Camera': '12MP Wide kèm cảm biến LiDAR Scanner' },
    features: ['Công nghệ màn hình Tandem OLED đột phá', 'Thiết kế siêu mỏng nhẹ dễ dàng mang theo mọi nơi', 'Hỗ trợ Apple Pencil Pro với tính năng bóp cảm ứng haptic']
  },
  {
    id: 'apple-006',
    name: 'Tai nghe không dây Apple AirPods Pro 2 MagSafe USB-C Chip H2',
    category_id: 'apple',
    category: 'apple',
    price: 5690000,
    oldPrice: 6290000,
    discount: 9,
    rating: 5.0,
    reviewCount: 92,
    stock: 35,
    isFeatured: false,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    description: 'Tai nghe chống ồn chủ động đỉnh cao AirPods Pro 2 nâng cấp cổng sạc USB-C và chuẩn kháng bụi IP54. Chip âm thanh Apple H2 khử tiếng ồn môi trường hiệu quả gấp 2 lần, âm thanh không gian Spatial Audio theo dõi chuyển động đầu sống động như rạp hát.',
    specifications: { 'Chip': 'Apple H2 trong tai nghe, U1 trong hộp sạc', 'Khử tiếng ồn': 'Active Noise Cancellation (ANC) thế hệ 2', 'Kháng nước bụi': 'Chuẩn IP54 cho cả tai nghe và hộp sạc', 'Thời lượng pin': '6 giờ nghe (30 giờ kèm hộp sạc)' },
    features: ['Chống ồn chủ động gấp đôi thế hệ trước', 'Âm thanh thích ứng Adaptive Audio thông minh', 'Hộp sạc có loa phát âm thanh tìm kiếm qua Find My']
  },
  {
    id: 'apple-007',
    name: 'Đồng hồ Apple Watch Ultra 2 GPS + Cellular 49mm Vỏ Titan Dây Ocean',
    category_id: 'apple',
    category: 'apple',
    price: 20490000,
    oldPrice: 21990000,
    discount: 6,
    rating: 4.9,
    reviewCount: 29,
    stock: 14,
    isFeatured: false,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1510519138161-5844a7893d56?auto=format&fit=crop&w=800&q=80',
    description: 'Chiếc đồng hồ thể thao chuyên nghiệp đỉnh cao với vỏ Titanium 49mm chống va đập tiêu chuẩn quân đội MIL-STD 810H. Màn hình Always-On Retina độ sáng kỷ lục 3000 nits thách thức ánh nắng gay gắt, GPS băng tần kép độ chính xác định vị tới từng mét.',
    specifications: { 'Chất liệu vỏ': 'Titanium hàng không vũ trụ', 'Độ sáng màn hình': '3000 nits đỉnh sáng', 'Độ sâu lặn': 'Chống nước 100m, chứng nhận lặn EN13319 tới 40m', 'Thời lượng pin': 'Lên đến 72 giờ ở chế độ tiết kiệm' },
    features: ['Cảm biến cử chỉ chạm hai lần Double Tap tiện lợi', 'Còi báo động âm lượng 86dB có thể nghe xa tới 180m', 'Định vị GPS tần số kép L1 và L5 siêu chuẩn xác']
  },

  // ===== CASE, NGUỒN, TẢN BỔ SUNG (case-psu-cooling) =====
  {
    id: 'case-004',
    name: 'Vỏ Case Lian Li O11 Vision Chrome 3 Mặt Kính Cường Lực Không Trụ Cột',
    category_id: 'case',
    category: 'case',
    price: 3890000,
    oldPrice: 4390000,
    discount: 11,
    rating: 5.0,
    reviewCount: 41,
    stock: 15,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Tuyệt tác case máy tính kết hợp giữa Lian Li và PC Master Race. Thiết kế 3 mặt kính cường lực nguyên khối không hề có thanh trụ góc chắn tầm nhìn, khoe trọn vẹn toàn bộ linh kiện đắt giá bên trong. Khoang giấu dây 2 buồng rộng rãi thông thoáng tối đa.',
    specifications: { 'Kích thước': 'Mid-Tower (480 x 304 x 464 mm)', 'Mặt kính': '3 mặt kính cường lực tráng gương Chrome', 'Hỗ trợ Mainboard': 'E-ATX, ATX, Micro-ATX, Mini-ITX', 'Hỗ trợ tản nhiệt': 'Tối đa 2 Radiator 360mm' },
    features: ['Tầm nhìn 3 mặt kính panorama không góc chết', 'Hỗ trợ gắn bo mạch chủ cổng cắm sau (BTF / Project Stealth)', 'Khung nhôm cao cấp gia công CNC sắc nét']
  },
  {
    id: 'case-005',
    name: 'Vỏ Case Fractal Design North Charcoal Black Gỗ Óc Chó Tự Nhiên Bắc Âu',
    category_id: 'case',
    category: 'case',
    price: 4290000,
    oldPrice: 4890000,
    discount: 12,
    rating: 4.9,
    reviewCount: 35,
    stock: 12,
    isFeatured: false,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
    description: 'Định nghĩa lại vẻ đẹp thẩm mỹ của case máy tính hiện đại với mặt trước ốp các nan gỗ óc chó tự nhiên đạt chứng nhận FSC. Phong cách nội thất Scandinavian Bắc Âu trang nhã, kết hợp luồng gió thông khí tối ưu với 2 quạt Aspect 14 PWM đi kèm.',
    specifications: { 'Mặt trước': 'Gỗ óc chó (Walnut) tự nhiên thật 100%', 'Hỗ trợ VGA': 'Chiều dài tối đa 355mm', 'Quạt đi kèm': '2 quạt 140mm Aspect 14 PWM', 'Cổng trước': 'USB 3.1 Gen 2 Type-C 10Gbps' },
    features: ['Mặt trước ốp gỗ tự nhiên sang trọng cho góc làm việc', 'Luồng gió thẳng Airflow tối ưu nhiệt độ linh kiện', 'Nắp hông kính cường lực tối màu tinh tế']
  },
  {
    id: 'psu-004',
    name: 'Nguồn máy tính Seasonic Focus GX-850 850W 80 Plus Gold Full Modular',
    category_id: 'psu',
    category: 'psu',
    price: 3490000,
    oldPrice: 3990000,
    discount: 12,
    rating: 5.0,
    reviewCount: 49,
    stock: 25,
    isFeatured: false,
    isNew: false,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    description: 'Trái tim cấp nguồn bền bỉ hàng đầu thế giới Seasonic Focus GX-850 đạt chứng nhận hiệu suất 80 Plus Gold. Toàn bộ tụ điện 100% xuất xứ Nhật Bản chịu nhiệt 105°C, quạt FDB 120mm với chế độ Hybrid Silent Fan Control không quay khi tải nhẹ.',
    specifications: { 'Công suất danh định': '850W', 'Chứng nhận': '80 Plus Gold (Hiệu suất trên 90%)', 'Hệ thống cáp': 'Full Modular 100% cáp rời dẹt đen', 'Bảo hành': '10 năm chính hãng đổi mới' },
    features: ['100% tụ điện thể rắn cao cấp Nhật Bản', 'Chế độ quạt bán thụ động 0 RPM khi tải dưới 30%', 'Đầy đủ các cơ chế bảo vệ điện áp cao cấp OPP, OVP, UVP, OCP, OTP, SCP']
  },
  {
    id: 'cooling-004',
    name: 'Tản nhiệt nước AIO NZXT Kraken Elite 360 RGB White LCD Màn Hình Tròn 60Hz',
    category_id: 'cooling',
    category: 'cooling',
    price: 7490000,
    oldPrice: 8290000,
    discount: 9,
    rating: 5.0,
    reviewCount: 52,
    stock: 14,
    isFeatured: true,
    isNew: true,
    isSale: false,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80',
    description: 'Tản nhiệt nước AIO đỉnh cao NZXT Kraken Elite 360 RGB White sở hữu màn hình TFT LCD 2.36 inch độ phân giải 640x640 tốc độ làm tươi 60Hz siêu mượt. Bơm Asetek thế hệ thứ 7 vận hành tĩnh âm, kiểm soát nhiệt độ mát mẻ cho cả Core i9 và Ryzen 9.',
    specifications: { 'Kích thước Radiator': '360mm (394 x 120 x 27 mm)', 'Màn hình bơm': '2.36 inch TFT-LCD 640x640 60Hz 690 nits', 'Quạt tản nhiệt': '3 x F120 RGB Core Fans', 'Tương thích': 'Intel LGA1700/1851, AMD AM5/AM4' },
    features: ['Màn hình tròn 60Hz hiển thị ảnh GIF và thông số hệ thống sắc nét', 'Bơm Asetek Gen 7 làm mát cực nhanh và yên tĩnh', 'Ống dẫn nước bện dù nylon bền bỉ chống bay hơi']
  },
  {
    id: 'cooling-005',
    name: 'Tản nhiệt nước AIO ASUS ROG Ryujin III 360 ARGB Extreme Màn Hình 3.5 inch',
    category_id: 'cooling',
    category: 'cooling',
    price: 9890000,
    oldPrice: 10990000,
    discount: 10,
    rating: 5.0,
    reviewCount: 27,
    stock: 10,
    isFeatured: true,
    isNew: true,
    isSale: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80',
    description: 'Quái vật làm mát tối thượng dòng Republic of Gamers ASUS ROG Ryujin III 360 ARGB. Màn hình màu LCD 3.5 inch khổng lồ, cụm bơm Asetek thế hệ 8 lưu lượng giải nhiệt tăng 14%, quạt làm mát VRM tích hợp sẵn trong block bơm làm mát dàn Phase nguồn bo mạch chủ.',
    specifications: { 'Kích thước Radiator': '360mm nhôm dày dặn', 'Màn hình LCD': '3.5 inch Full Color 60Hz', 'Bơm làm mát': 'Asetek thế hệ thứ 8 (8th Gen)', 'Quạt đi kèm': '3 quạt từ tính nối tiếp ROG MF-12S ARGB' },
    features: ['Màn hình LCD 3.5 inch lớn nhất thế giới tản nhiệt AIO', 'Quạt phụ tích hợp làm mát khu vực dàn nguồn VRM và SSD M.2', 'Quạt nối tiếp từ tính Daisy-chain không cần dây nối rườm rà']
  },
].map((product: any): Product => ({
  rating: product.rating ?? 4.9,
  reviewCount: product.reviewCount ?? 36,
  stock: product.stock ?? 20,
  isFeatured: product.isFeatured ?? true,
  isNew: product.isNew ?? true,
  isSale: product.isSale ?? Boolean(product.discount && product.discount > 0),
  isHot: product.isHot ?? true,
  description: product.description || `Sản phẩm ${product.name} chính hãng phân phối tại DANGVINHPC với đầy đủ chứng nhận chất lượng, bảo hành uy tín.`,
  features: product.features && product.features.length > 0 ? product.features : [
    'Sản phẩm mới chính hãng 100% nguyên seal',
    'Chính sách bảo hành đổi mới uy tín tại DANGVINHPC',
    'Kiểm tra và chạy thử ổn định trước khi giao hàng',
    'Hỗ trợ giao hàng hỏa tốc trong 2 giờ'
  ],
  ...product,
  category: product.category || product.category_id || '',
  images: product.images && product.images.length > 0 ? product.images : [product.image],
  specifications: Object.fromEntries(
    Object.entries(product.specifications ?? {}).map(([key, value]) => [key, String(value ?? '')])
  ) as Record<string, string>,
}));

export const products: Product[] = assignUniqueProductImages([
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
    "image": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Laptop Gaming Dell G3 3500 sở hữu thiết kế thể thao hầm hố với khe hút gió tản nhiệt kép khí động học. Cỗ máy trang bị vi xử lý Intel Core i5-10300H xung nhịp lên đến 4.5GHz, kết hợp cùng card đồ họa rời NVIDIA GeForce GTX 1650 4GB GDDR6 mang lại trải nghiệm gaming mượt mà trên các tựa game Esport thịnh hành (Liên Minh Huyền Thoại, FIFA Online 4, CS2, Valorant). Màn hình 15.6 inch Full HD viền mỏng tần số quét 120Hz mượt mà, bàn phím LED xanh cá tính và hệ thống âm thanh vòm Nahimic 3D sống động.",
    "features": [
      "Card đồ họa rời NVIDIA GeForce GTX 1650 4GB GDDR6 chiến game mượt mà",
      "Màn hình 15.6 inch FHD viền mỏng chống chói, tần số quét 120Hz mượt mà",
      "Hệ thống tản nhiệt 2 quạt làm mát hiệu suất cao với công nghệ Game Shift",
      "Bảo hành 12 tháng chính hãng tại DANGVINHPC, hỗ trợ vệ sinh tra keo tản nhiệt trọn đời"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Like New 99% Zin nguyên bản",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD (1920x1080) 120Hz WVA",
      "Tặng kèm": "Balo gaming chống sốc + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Gaming Series",
      "Card đồ họa": "NVIDIA GeForce GTX 1650 4GB GDDR6"
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
    "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 14 Plus 7430 là dòng ultrabook văn phòng cao cấp chuẩn doanh nhân với khung vỏ hợp kim nhôm Platinum Silver mỏng nhẹ chỉ 1.6kg. Sức mạnh đột phá từ vi xử lý Intel Core i5-13420H dòng H hiệu năng cao (8 nhân 12 luồng), dung lượng RAM 16GB đa nhiệm mượt mà và ổ cứng lưu trữ cực lớn 1TB PCIe NVMe SSD. Điểm sáng nổi trội là màn hình 14.0 inch độ phân giải 2.5K (2560x1600) tỷ lệ vàng 16:10, tần số quét 90Hz và độ phủ màu 100% sRGB cho hình ảnh rực rỡ, chuẩn màu cho đồ họa.",
    "features": [
      "Vi xử lý Intel Core i5-13420H hiệu năng cao xử lý tốt lập trình và đồ họa",
      "Màn hình 14 inch độ phân giải 2.5K 90Hz chuẩn màu 100% sRGB",
      "Ổ cứng siêu khủng 1TB PCIe NVMe SSD tốc độ đọc ghi cực nhanh",
      "Khung vỏ nhôm nguyên khối cao cấp, bàn phím có đèn nền và cảm biến vân tay"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz 100% sRGB",
      "Tặng kèm": "Balo cao cấp DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 14 Plus Cao Cấp",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 14 Plus 7430 phiên bản chip Intel Core i5-13500H mạnh mẽ với 12 nhân 16 luồng, xung nhịp Turbo tối đa 4.7GHz đáp ứng trơn tru các tác vụ tính toán nặng, dựng video 4K và chạy máy ảo. Bộ nhớ RAM 16GB chuẩn LPDDR5 tốc độ cao cùng 512GB SSD NVMe cho tốc độ phản hồi tức thì. Thiết kế tinh xảo, tản nhiệt kép ống đồng thông minh giúp thân máy luôn mát mẻ và vận hành êm ái.",
    "features": [
      "Chip Intel Core i5-13500H 12 nhân 16 luồng xung nhịp tối đa 4.7GHz",
      "Màn hình 14.0 inch 2.5K (2560x1600) công nghệ chống chói ComfortView Plus",
      "Loa kép Waves MaxxAudio Pro kết hợp Dolby Atmos âm thanh sống động",
      "Bảo hành toàn diện 12 tháng tại DANGVINHPC, hỗ trợ kỹ thuật trọn đời"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz Anti-Glare",
      "Tặng kèm": "Balo cao cấp DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 14 Plus",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 7430 N7430I58W1 là mẫu laptop văn phòng thanh lịch, siêu di động dành cho học sinh, sinh viên và nhân viên công sở. Máy được trang bị chip Intel Core i5-1335U thế hệ 13 tối ưu năng lượng tuyệt vời, cho thời lượng pin sử dụng bền bỉ cả ngày. Màn hình 14.0 inch FHD+ viền siêu mỏng tỷ lệ 16:10 hiển thị nhiều thông tin hơn khi lướt web và đọc tài liệu. Cổng kết nối đầy đủ Thunderbolt 4, HDMI và đầu đọc thẻ SD.",
    "features": [
      "Vi xử lý Intel Core i5-1335U thế hệ 13 tiết kiệm điện năng vượt trội",
      "Màn hình 14.0 inch FHD+ (1920x1200) tỷ lệ 16:10 viền mỏng 4 cạnh",
      "Thời lượng pin ấn tượng lên đến 8-10 tiếng làm việc văn phòng",
      "Tích hợp cảm biến vân tay trên nút nguồn và đèn nền bàn phím tiện lợi"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ (1920x1200) IPS",
      "Tặng kèm": "Balo chống sốc DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 7430",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 14 Plus 7430 cấu hình cao cấp trang bị chip Intel Core i7-13620H (10 nhân 16 luồng, Turbo Boost 4.9GHz) đem lại tốc độ xử lý đỉnh cao cho mọi tác vụ lập trình, dựng video 4K và đồ họa chuyên sâu. Dung lượng RAM 16GB đa nhiệm mượt mà cùng ổ cứng 1TB PCIe NVMe SSD thỏa sức lưu trữ dữ liệu dung lượng lớn. Màn hình 14.0 inch 2.5K (2560x1600) 90Hz tỷ lệ 16:10 hiển thị sắc nét, sống động, chống mỏi mắt hiệu quả.",
    "features": [
      "Vi xử lý Intel Core i7-13620H thế hệ 13 cực mạnh cân mọi tác vụ nặng",
      "Màn hình 14.0 inch 2.5K 90Hz hiển thị siêu nét, chuẩn màu đồ họa",
      "Ổ cứng siêu khủng 1TB PCIe NVMe SSD truy xuất dữ liệu cực nhanh",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ cài đặt và vệ sinh trọn đời"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch 2.5K (2560x1600) 90Hz",
      "Tặng kèm": "Balo chống sốc DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 14 Plus i7",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Laptop doanh nghiệp Dell Latitude 5530 đạt tiêu chuẩn độ bền quân đội Mỹ MIL-STD 810H, khung máy gia cố sợi carbon chắc chắn và chịu va đập cực tốt. Màn hình lớn 15.6 inch Full HD chống chói WVA kèm bàn phím số Numpad tiện lợi cho kế toán, nhập liệu và xử lý văn bản. Tích hợp chip bảo mật TPM 2.0, cảm biến vân tay 1 chạm và camera có thanh trượt che riêng tư an toàn tuyệt đối.",
    "features": [
      "Độ bền đạt chuẩn quân sự Mỹ MIL-STD 810H chống va đập, rung lắc",
      "Màn hình 15.6 inch FHD chống chói làm việc tốt ngoài trời",
      "RAM 16GB đa nhiệm mượt mà, dễ dàng nâng cấp mở rộng",
      "Chính sách bảo hành 12 tháng uy tín tại DANGVINHPC"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch FHD (1920x1080) Anti-glare",
      "Tặng kèm": "Balo chống sốc DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Latitude Doanh Nghiệp",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 5415 sở hữu thiết kế mỏng nhẹ hiện đại với màu bạc thanh lịch, trọng lượng chỉ khoảng 1.4kg tiện lợi bỏ balo đi học và đi làm. Máy sử dụng chip AMD Ryzen 5000 Series tiến trình 7nm tiết kiệm pin tối ưu và nhiệt độ luôn mát mẻ. Màn hình 14.0 inch Full HD viền mỏng góc rộng IPS cho góc nhìn sống động, màu sắc trung thực khi giải trí xem phim và làm việc văn phòng.",
    "features": [
      "Thiết kế nhỏ gọn 14 inch siêu mỏng nhẹ chỉ 1.4kg",
      "Bản lề thông minh nâng bàn phím hỗ trợ tản nhiệt và gõ êm tay",
      "Pin dung lượng cao cho thời gian sử dụng 7-9 tiếng liên tục",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ đổi mới trong 30 ngày"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch Full HD (1920x1080) IPS",
      "Tặng kèm": "Balo thời trang DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron Siêu Di Động",
      "Card đồ họa": "AMD Radeon Graphics"
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
    "image": "https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 5425 đời 2022 được nâng cấp mạnh mẽ với màn hình tỷ lệ 16:10 Full HD+ viền siêu mỏng, mở rộng không gian hiển thị thêm 11% so với màn hình 16:9 truyền thống. Máy trang bị vi xử lý AMD Ryzen 5 5625U (6 nhân 12 luồng) vận hành mượt mà các tác vụ văn phòng, học trực tuyến và chỉnh sửa đồ họa nhẹ. Hệ thống micro kép lọc ồn thông minh AI giúp hội thoại trực tuyến trong trẻo, rõ nét.",
    "features": [
      "Màn hình tỷ lệ vàng 16:10 FHD+ (1920x1200) chống chói Anti-Glare",
      "Chip AMD Ryzen 5 5625U 6 nhân 12 luồng chạy cực mát và tiết kiệm điện",
      "Micro kép khử tiếng ồn bằng AI nâng cao chất lượng cuộc gọi",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ kỹ thuật tận tâm 24/7"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ (1920x1200) WVA",
      "Tặng kèm": "Balo chống sốc DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 16:10",
      "Card đồ họa": "AMD Radeon Graphics"
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
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 15 5515 sở hữu kích thước màn hình lớn 15.6 inch Full HD viền mỏng, bàn phím full-size có đèn nền. Hiệu năng mạnh mẽ với 8 nhân 16 luồng của AMD Ryzen 7 5700U, xử lý trơn tru mọi bảng tính Excel hàng triệu dòng, đồ họa ảnh và chơi game mượt mà.",
    "features": [
      "Chip AMD Ryzen 7 5700U 8 nhân 16 luồng xử lý đa nhiệm cực đỉnh",
      "Màn hình 15.6 inch FHD viền mỏng chống chói cho trải nghiệm góc nhìn rộng",
      "Bàn phím Full-size có cụm phím số Numpad tiện lợi cho công việc kế toán",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ đổi mới trong 30 ngày"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo chống sốc DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 15",
      "Card đồ họa": "AMD Radeon Graphics"
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
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Chiến hạm Alienware M15 R7 đỉnh cao gaming với thiết kế Legend 2.0 độc quyền, vòng LED tròn Stadium lighting phía sau và logo đầu người ngoài hành tinh phát sáng. Card đồ họa khủng NVIDIA GeForce RTX 3070Ti 8GB GDDR6 (150W TGP) cùng tản nhiệt buồng hơi Cryo-tech làm mát bằng quạt gallium-silicone.",
    "features": [
      "Card đồ họa NVIDIA GeForce RTX 3070Ti 8GB chạy công suất tối đa 150W",
      "Màn hình 15.6 inch 240Hz tốc độ phản hồi 2ms hỗ trợ NVIDIA G-Sync",
      "Hệ thống tản nhiệt Cryo-tech độc quyền của Dell Alienware giữ máy luôn mát",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ kỹ thuật chuyên sâu trọn đời"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch QHD 240Hz G-Sync",
      "Tặng kèm": "Balo Alienware cao cấp + Chuột gaming + Lót chuột",
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
    "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Gaming G15 5530 phong cách thiết kế lấy cảm hứng từ Alienware với các góc cạnh đậm chất mecha. Sử dụng chip Intel Core i5-13450HX dòng HX ép xung mạnh mẽ và card đồ họa NVIDIA RTX 3050 6GB GDDR6 mới nhất, tối ưu chơi game mượt mà với tính năng Game Shift tăng tốc tức thì qua phím G.",
    "features": [
      "Chip Intel Core i5-13450HX dòng HX tối ưu xung nhịp cao chiến game",
      "Card đồ họa rời RTX 3050 6GB VRAM GDDR6 thế hệ mới",
      "Bàn phím LED RGB 4 vùng tùy chỉnh theo phong cách cá nhân",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ vệ sinh tra keo tản nhiệt miễn phí"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "15.6 inch Full HD 120Hz",
      "Tặng kèm": "Balo gaming DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Gaming G15 Series",
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
    "image": "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85",
    "images": [
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=800&q=85"
    ],
    "description": "Dell Inspiron 14 5430 phiên bản thế hệ mới nhất với thiết kế nhôm sang trọng, chuẩn nhẹ nhàng dễ dàng mang theo di chuyển. Màn hình 14.0 inch FHD+ chống chói sắc nét, bàn phím gõ êm với hành trình sâu và touchpad phủ kính mượt mà, hỗ trợ chuẩn âm thanh vòm Dolby Atmos sống động.",
    "features": [
      "Vi xử lý Intel Core i5-1340P 12 nhân 16 luồng xử lý mượt mà",
      "Màn hình 14.0 inch FHD+ IPS viền siêu mỏng chống chói",
      "Khung nhôm cao cấp màu bạc Platinum chống bám vân tay",
      "Bảo hành 12 tháng tại DANGVINHPC, hỗ trợ kỹ thuật tận tâm 24/7"
    ],
    "specifications": {
      "Thương hiệu": "Dell Chính Hãng",
      "Tình trạng": "Mới 100% Fullbox",
      "Bảo hành": "12 tháng tại DANGVINHPC - 1 đổi 1 trong 30 ngày",
      "Màn hình": "14.0 inch FHD+ IPS chống chói",
      "Tặng kèm": "Balo thời trang DANGVINHPC + Chuột không dây + Lót chuột",
      "Dòng máy": "Dell Inspiron 14",
      "Card đồ họa": "Intel Iris Xe Graphics"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80"
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
  },
  ...additionalCategoryProducts
]);

export const featuredProducts = products.filter((p) => p.isFeatured || p.isHot || p.isSale);
export const flashSaleProducts = products.filter((p) => p.isSale);
export const newArrivals = products.filter((p) => p.isNew);
