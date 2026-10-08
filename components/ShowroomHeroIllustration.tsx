import React from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

const SVG_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
  <defs>
    <!-- Sky Background Gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0f7ff" />
      <stop offset="50%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#bae6fd" />
    </linearGradient>

    <!-- DPC Brand Blue Gradients -->
    <linearGradient id="dpcBlueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="60%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <linearGradient id="dpcDarkBlueGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="60%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>

    <!-- Airplane Yellow Sport Gradient -->
    <linearGradient id="planeYellowGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>

    <!-- Propeller Spin Blur Gradient -->
    <radialGradient id="propellerDisc" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#93c5fd" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
    </radialGradient>

    <!-- Contrail Wind Gradient -->
    <linearGradient id="contrailGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#dbeafe" stop-opacity="0.95" />
    </linearGradient>

    <!-- CSS KEYFRAMES: MÁY BAY LƯỢN QUA BẦU TRỜI & CÁNH QUẠT QUAY LIÊN TỤC -->
    <style>
      @keyframes flyPlaneAcross {
        0% {
          transform: translate(-380px, 35px) rotate(-3deg);
        }
        25% {
          transform: translate(180px, 75px) rotate(4deg);
        }
        50% {
          transform: translate(720px, 20px) rotate(-3deg);
        }
        75% {
          transform: translate(1180px, 60px) rotate(3deg);
        }
        100% {
          transform: translate(1680px, 30px) rotate(-2deg);
        }
      }

      @keyframes planeFloatMotion {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-8px) rotate(-1.5deg);
        }
      }

      @keyframes propSpinRapid {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes smokePuffFly {
        0% {
          opacity: 0.9;
          transform: scale(0.6) translate(0, 0);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2) translate(-25px, -6px);
        }
        100% {
          opacity: 0;
          transform: scale(1.8) translate(-55px, -15px);
        }
      }

      @keyframes eyeBlink {
        0%, 90%, 100% {
          transform: scaleY(1);
        }
        95% {
          transform: scaleY(0.1);
        }
      }

      @keyframes cloudDriftSlow {
        0% {
          transform: translateX(0px);
        }
        50% {
          transform: translateX(50px);
        }
        100% {
          transform: translateX(0px);
        }
      }

      .animated-plane-flyer {
        animation: flyPlaneAcross 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        will-change: transform;
      }

      .plane-float-group {
        animation: planeFloatMotion 1.8s ease-in-out infinite;
      }

      .propeller-spinning {
        animation: propSpinRapid 0.12s linear infinite;
        transform-origin: 320px 145px;
      }

      .smoke-puff-trail-1 {
        animation: smokePuffFly 0.6s ease-out infinite;
        transform-origin: 100px 145px;
      }

      .smoke-puff-trail-2 {
        animation: smokePuffFly 0.6s ease-out infinite 0.2s;
        transform-origin: 100px 145px;
      }

      .smoke-puff-trail-3 {
        animation: smokePuffFly 0.6s ease-out infinite 0.4s;
        transform-origin: 100px 145px;
      }

      .mascot-eye-anim {
        animation: eyeBlink 4s ease-in-out infinite;
        transform-origin: 235px 95px;
      }

      .clouds-layer {
        animation: cloudDriftSlow 18s ease-in-out infinite;
      }
    </style>
  </defs>

  <!-- SKY BACKGROUND -->
  <rect width="1440" height="480" fill="url(#skyGrad)" />

  <!-- PUFFY CLOUDS (DRIFTING SLOWLY) -->
  <g class="clouds-layer" fill="#ffffff" opacity="0.9">
    <path d="M70 110 Q90 80 130 85 Q170 75 200 100 Q230 100 240 125 Q220 150 170 150 Q110 150 80 135 Z" />
    <path d="M470 70 Q500 40 540 45 Q580 35 610 60 Q640 60 650 85 Q620 110 560 110 Q490 110 470 90 Z" />
    <path d="M1250 80 Q1275 55 1315 60 Q1350 50 1380 75 Q1410 75 1420 100 Q1390 120 1340 120 Q1280 120 1260 100 Z" />
  </g>

  <!-- DISTANT CITY SKYLINE (LAYER 1 - LIGHT BLUE SILHOUETTES) -->
  <g fill="#bfdbfe" opacity="0.6">
    <rect x="20" y="220" width="45" height="210" />
    <rect x="75" y="180" width="60" height="250" />
    <rect x="145" y="240" width="50" height="190" />
    <polygon points="145,240 170,205 195,240" />
    <rect x="205" y="150" width="70" height="280" />
    <rect x="285" y="200" width="55" height="230" />
    <rect x="350" y="230" width="65" height="200" />
    <rect x="425" y="170" width="50" height="260" />
    <polygon points="425,170 450,130 475,170" />
    <rect x="485" y="210" width="75" height="220" />
    <rect x="570" y="180" width="45" height="250" />
    <rect x="850" y="240" width="40" height="190" />
    <rect x="1240" y="190" width="65" height="240" />
    <polygon points="1240,190 1272,155 1305,190" />
    <rect x="1315" y="160" width="55" height="270" />
    <rect x="1380" y="220" width="50" height="210" />
  </g>

  <!-- MID-GROUND CITY SKYLINE (LAYER 2) -->
  <g fill="#93c5fd" opacity="0.75">
    <rect x="40" y="250" width="50" height="180" />
    <rect x="100" y="210" width="40" height="220" />
    <rect x="150" y="270" width="45" height="160" />
    <rect x="220" y="190" width="50" height="240" />
    <rect x="300" y="240" width="60" height="190" />
    <rect x="390" y="200" width="45" height="230" />
    <polygon points="390,200 412,165 435,200" />
    <rect x="460" y="250" width="55" height="180" />
    <rect x="530" y="220" width="60" height="210" />
    <rect x="1270" y="220" width="50" height="210" />
    <rect x="1340" y="200" width="60" height="230" />
  </g>

  <!-- ==================== SHOWROOM 1 (TÒA NHÀ TRUNG - BÊN TRÁI) ==================== -->
  <g id="showroom1">
    <!-- Spotlight Trên Nóc Tòa Nhà -->
    <g stroke="#1e293b" stroke-width="3" fill="#3b82f6">
      <line x1="660" y1="185" x2="660" y2="155" />
      <polygon points="652,155 668,155 665,145 655,145" />
      <line x1="690" y1="185" x2="690" y2="155" />
      <polygon points="682,155 698,155 695,145 685,145" />
      <line x1="720" y1="185" x2="720" y2="155" />
      <polygon points="712,155 728,155 725,145 715,145" />
      <line x1="750" y1="185" x2="750" y2="155" />
      <polygon points="742,155 758,155 755,145 745,145" />
      <line x1="780" y1="185" x2="780" y2="155" />
      <polygon points="772,155 788,155 785,145 775,145" />
      <line x1="810" y1="185" x2="810" y2="155" />
      <polygon points="802,155 818,155 815,145 805,145" />
      <line x1="840" y1="185" x2="840" y2="155" />
      <polygon points="832,155 848,155 845,145 835,145" />
    </g>

    <!-- Thân Tòa Nhà Trắng Sứ Sang Trọng (Viền Xanh DPC) -->
    <rect x="645" y="185" width="210" height="245" fill="#ffffff" stroke="#2563eb" stroke-width="3" />

    <!-- LOGO DPC MÀU XANH DƯƠNG RÕ MỒN MỘT (STORE 1) -->
    <g id="logoStore1">
      <!-- Khiên lục giác ngoài màu Xanh DPC -->
      <polygon points="750,212 782,230 782,266 750,284 718,266 718,230" fill="#2563eb" stroke="#1d4ed8" stroke-width="3" />
      <!-- Viền trong phát sáng neon -->
      <polygon points="750,217 776,233 776,263 750,279 724,263 724,233" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1.5" />
      <!-- Chữ DPC Trắng Tinh To Nét Đậm -->
      <text x="750" y="255" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">DPC</text>
    </g>

    <!-- Biển Hiệu Đen Led "D A N G V I N H P C" -->
    <rect x="645" y="295" width="210" height="34" fill="#0f172a" />
    <text x="750" y="318" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">D A N G V I N H P C</text>

    <!-- Dải Đèn LED Xanh Dương Nhấn Mặt Tiền -->
    <g fill="#2563eb">
      <rect x="670" y="337" width="20" height="5" rx="1.5" />
      <rect x="702" y="337" width="20" height="5" rx="1.5" />
      <rect x="734" y="337" width="20" height="5" rx="1.5" />
      <rect x="766" y="337" width="20" height="5" rx="1.5" />
      <rect x="798" y="337" width="20" height="5" rx="1.5" />
      <rect x="830" y="337" width="20" height="5" rx="1.5" />
    </g>

    <!-- Cửa Kính Showroom & Phản Chiếu Ánh Sáng -->
    <rect x="655" y="348" width="190" height="82" fill="#1e293b" rx="2" />
    <line x1="750" y1="348" x2="750" y2="430" stroke="#0f172a" stroke-width="3" />
    <polygon points="670,430 735,355 745,355 680,430" fill="#ffffff" opacity="0.1" />
    <polygon points="770,430 830,360 840,360 780,430" fill="#ffffff" opacity="0.1" />
  </g>

  <!-- ==================== CỘT ĐÈN ĐƯỜNG PHỐ ==================== -->
  <g id="streetLamp">
    <rect x="888" y="295" width="4" height="135" fill="#334155" />
    <circle cx="890" cy="295" r="5" fill="#0f172a" />
    <polygon points="882,295 898,295 894,270 886,270" fill="#fef08a" stroke="#0f172a" stroke-width="2" />
    <polygon points="880,270 900,270 890,260" fill="#0f172a" />
    <circle cx="890" cy="285" r="14" fill="#fef08a" opacity="0.4" />
  </g>

  <!-- ==================== SHOWROOM 2 (ĐẠI BẢN DOANH FLAGSHIP - BÊN PHẢI) ==================== -->
  <g id="showroom2">
    <!-- Spotlight Nóc Tòa Nhà -->
    <g stroke="#1e293b" stroke-width="3.5" fill="#3b82f6">
      <line x1="935" y1="85" x2="935" y2="45" />
      <polygon points="925,45 945,45 941,32 929,32" />
      <line x1="985" y1="85" x2="985" y2="45" />
      <polygon points="975,45 995,45 991,32 979,32" />
      <line x1="1035" y1="85" x2="1035" y2="45" />
      <polygon points="1025,45 1045,45 1041,32 1029,32" />
      <line x1="1085" y1="85" x2="1085" y2="45" />
      <polygon points="1075,45 1095,45 1091,32 1079,32" />
      <line x1="1135" y1="85" x2="1135" y2="45" />
      <polygon points="1125,45 1145,45 1141,32 1129,32" />
      <line x1="1185" y1="85" x2="1185" y2="45" />
      <polygon points="1175,45 1195,45 1191,32 1179,32" />
      <line x1="1235" y1="85" x2="1235" y2="45" />
      <polygon points="1225,45 1245,45 1241,32 1229,32" />
    </g>

    <!-- Thân Tòa Nhà Lớn Màu Trắng (Viền Xanh DPC Chuẩn Thương Hiệu) -->
    <rect x="915" y="85" width="340" height="345" fill="#ffffff" stroke="#2563eb" stroke-width="3.5" />

    <!-- LOGO DPC KHỔNG LỒ MÀU XANH DƯƠNG RỰC RỠ TRÊN TÒA NHÀ FLAGSHIP -->
    <g id="logoStore2">
      <!-- Khiên Lục Giác Xanh DPC To Hoành Tráng -->
      <polygon points="1085,110 1135,138 1135,192 1085,220 1035,192 1035,138" fill="#2563eb" stroke="#1d4ed8" stroke-width="4" />
      <!-- Lớp Viền Trong Xanh Đậm Viền Sáng Neon -->
      <polygon points="1085,116 1127,141 1127,189 1085,214 1043,189 1043,141" fill="#1e40af" stroke="#93c5fd" stroke-width="2" />
      <!-- Chữ DPC Siêu To Trắng Tinh Cực Nét -->
      <text x="1085" y="174" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">DPC</text>
    </g>

    <!-- Biển Hiệu Lớn DANGVINHPC Nền Đen Đẳng Cấp -->
    <rect x="915" y="225" width="340" height="46" fill="#0f172a" />
    <text x="1085" y="256" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="5">D A N G V I N H P C</text>

    <!-- Dải Đèn LED Nhấn Xanh Dương DPC -->
    <g fill="#2563eb">
      <rect x="948" y="278" width="28" height="6.5" rx="2" />
      <rect x="990" y="278" width="28" height="6.5" rx="2" />
      <rect x="1032" y="278" width="28" height="6.5" rx="2" />
      <rect x="1074" y="278" width="28" height="6.5" rx="2" />
      <rect x="1116" y="278" width="28" height="6.5" rx="2" />
      <rect x="1158" y="278" width="28" height="6.5" rx="2" />
      <rect x="1200" y="278" width="28" height="6.5" rx="2" />
    </g>

    <!-- Mặt Kính Showroom Flagship & Showroom Window -->
    <rect x="930" y="293" width="310" height="137" fill="#0f172a" rx="4" />
    <rect x="935" y="298" width="145" height="132" fill="#1e293b" />
    <rect x="1090" y="298" width="145" height="132" fill="#1e293b" />
    <!-- Phản Chiếu Kính Chéo -->
    <polygon points="950,430 1025,315 1038,315 963,430" fill="#ffffff" opacity="0.12" />
    <polygon points="1095,430 1170,315 1183,315 1108,430" fill="#ffffff" opacity="0.12" />
  </g>

  <!-- ==================== MẶT ĐƯỜNG HIỆN ĐẠI ==================== -->
  <rect x="0" y="430" width="1440" height="50" fill="#090d16" />
  <!-- Dải LED Xanh Công Nghệ Dọc Đường -->
  <line x1="0" y1="430" x2="1440" y2="430" stroke="#2563eb" stroke-width="4" />
  <line x1="0" y1="436" x2="1440" y2="436" stroke="#38bdf8" stroke-width="1.5" opacity="0.6" />
  <!-- Vạch Kẻ Đường -->
  <line x1="0" y1="458" x2="1440" y2="458" stroke="#334155" stroke-width="3" stroke-dasharray="35 25" />

  <!-- ========================================================================= -->
  <!-- LINH VẬT ROBOT XANH DƯƠNG DPC LÁI MÁY BAY GIAO HÀNG (BAY LƯỢN VÔ TẬN)   -->
  <!-- ========================================================================= -->
  <g class="animated-plane-flyer">
    <g class="plane-float-group">
      <!-- 1. VỆT MÂY KHÓI ĐUÔI MÁY BAY -->
      <g fill="#ffffff">
        <circle class="smoke-puff-trail-1" cx="85" cy="142" r="10" />
        <circle class="smoke-puff-trail-2" cx="65" cy="144" r="14" />
        <circle class="smoke-puff-trail-3" cx="40" cy="146" r="18" />
        <path d="M-20 144 Q40 144 85 142" stroke="url(#contrailGrad)" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M0 135 Q50 138 95 138" stroke="url(#contrailGrad)" stroke-width="3.5" fill="none" stroke-linecap="round" />
        <path d="M-10 152 Q45 150 90 147" stroke="url(#contrailGrad)" stroke-width="3.5" fill="none" stroke-linecap="round" />
      </g>

      <!-- 2. THÂN MÁY BAY THỂ THAO (PHỐI MÀU XANH DƯƠNG DPC & VÀNG) -->
      <!-- Cánh Xa (Far Wing) -->
      <polygon points="190,125 240,75 270,75 225,125" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
      <polygon points="245,75 270,75 255,90 230,90" fill="#facc15" />

      <!-- Đuôi Máy Bay Xanh DPC -->
      <path d="M85 140 L105 82 L135 82 L120 140 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
      <polygon points="108,84 133,84 125,108 100,108" fill="#facc15" />
      <!-- Logo DPC trên đuôi máy bay -->
      <polygon points="116,92 124,96 124,103 116,107 108,103 108,96" fill="#ffffff" />
      <text x="116" y="102" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="5" font-weight="900" fill="#2563eb" text-anchor="middle">DPC</text>

      <!-- Cánh Đuôi Ngang -->
      <polygon points="75,145 115,142 125,148 78,150" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />

      <!-- Thân Máy Bay Chính Vàng Thể Thao -->
      <path d="M100 140 Q105 125 155 120 L275 120 Q315 120 325 145 Q315 170 275 170 L155 170 Q105 165 100 140 Z" fill="url(#planeYellowGrad)" stroke="#ca8a04" stroke-width="2.5" />

      <!-- Sọc Đua Xanh Dương DPC Dọc Thân -->
      <path d="M105 142 L320 142 Q316 158 285 160 L145 160 Q110 156 105 142 Z" fill="#2563eb" />

      <!-- Cửa Sổ Tròn Máy Bay -->
      <circle cx="165" cy="148" r="6" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
      <circle cx="165" cy="148" r="4" fill="#38bdf8" opacity="0.8" />

      <!-- 3. THÙNG GIAO HÀNG DPC CHỞ SAU KHOANG LÁI (MÀU XANH DƯƠNG DPC) -->
      <g id="airplaneCargoBox">
        <rect x="138" y="120" width="34" height="6" fill="#0f172a" rx="1.5" />
        <!-- Thùng Xanh DPC -->
        <rect x="132" y="85" width="45" height="38" rx="6" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
        <rect x="132" y="93" width="45" height="4" fill="#1e3a8a" />
        <!-- Logo DPC Trên Thùng -->
        <polygon points="154,98 163,103 163,113 154,118 145,113 145,103" fill="#ffffff" />
        <text x="154" y="111" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="7" font-weight="900" fill="#2563eb" text-anchor="middle">DPC</text>
      </g>

      <!-- 4. LINH VẬT ROBOT XANH DƯƠNG DPC CHUẨN MẪU GEARVN LÁI MÁY BAY -->
      <g id="mascotPilot">
        <!-- Thân Robot Xanh Dương Ngồi Trong Khoang -->
        <ellipse cx="215" cy="125" rx="24" ry="20" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
        <path d="M198 132 Q215 125 232 132" stroke="#1e3a8a" stroke-width="3" fill="none" stroke-linecap="round" />

        <!-- Cánh Tay Robot Cầm Cần Lái -->
        <path d="M220 120 Q240 120 252 130" stroke="#2563eb" stroke-width="11" fill="none" stroke-linecap="round" />
        <circle cx="254" cy="130" r="6.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
        <!-- Cần Điều Khiển (Flight Stick) -->
        <line x1="256" y1="130" x2="260" y2="142" stroke="#334155" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="256" cy="129" r="3" fill="#2563eb" />

        <!-- ĐẦU ROBOT DPC (MÀU XANH DƯƠNG THƯƠNG HIỆU) -->
        <circle cx="215" cy="88" r="34" fill="#2563eb" stroke="#1d4ed8" stroke-width="2.5" />

        <!-- Mào Nón / Lưỡi Trai Xanh Đậm Phía Trên -->
        <path d="M192 68 Q218 56 245 68 L240 76 Q218 64 196 76 Z" fill="#1e3a8a" stroke="#1d4ed8" stroke-width="1" />
        <!-- Logo Tam Giác Trắng Trên Mào Nón -->
        <polygon points="220,62 225,70 215,70" fill="#ffffff" />

        <!-- Tai Nghe Chụp Tai Đen Xám Có Ăng-Ten (Headphones) -->
        <circle cx="188" cy="88" r="14" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
        <circle cx="188" cy="88" r="8" fill="#334155" />
        <circle cx="188" cy="88" r="4" fill="#60a5fa" />
        <!-- Dây Ăng-Ten Tai Nghe -->
        <path d="M188 74 Q192 60 212 58" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />

        <!-- MẶT MÀN HÌNH ĐEN BÓNG (VISOR SCREEN) -->
        <path d="M210 70 Q245 70 245 95 Q245 110 212 110 Q205 95 210 70 Z" fill="#0f172a" />

        <!-- ĐÔI MẮT HÍP CƯỜI HẠNH PHÚC (HAPPY EYES ^ ^) -->
        <g class="mascot-eye-anim">
          <path d="M224 86 Q231 77 238 86" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
          <path d="M224 86 Q231 77 238 86" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />
        </g>

        <!-- KHẨU TRANG TRẮNG CHE CẰM KÈM DÂY QUAI RA SAU TAI -->
        <path d="M216 98 Q248 98 245 112 L212 112 Q210 105 216 98 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
        <path d="M216 102 Q198 100 190 94" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        <path d="M216 107 Q198 106 190 96" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
      </g>

      <!-- Kính Chắn Gió Khoang Lái -->
      <path d="M255 120 L275 95 L285 120 Z" fill="#bae6fd" opacity="0.65" stroke="#38bdf8" stroke-width="2" />
      <line x1="265" y1="112" x2="278" y2="102" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.9" />

      <!-- Cánh Gần (Near Wing) -->
      <polygon points="180,145 220,195 260,195 235,145" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
      <polygon points="230,195 260,195 250,180 220,180" fill="#facc15" />
      <circle cx="255" cy="190" r="2.5" fill="#22c55e" />

      <!-- 5. MŨI MÁY BAY & CÁNH QUẠT QUAY -->
      <path d="M320 130 Q335 145 320 160 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
      <ellipse cx="328" cy="145" rx="7" ry="46" fill="url(#propellerDisc)" />

      <!-- Cánh Quạt Cơ Học Quay Tít Mù -->
      <g class="propeller-spinning">
        <ellipse cx="328" cy="120" rx="3" ry="24" fill="#0f172a" stroke="#facc15" stroke-width="1.5" />
        <ellipse cx="328" cy="170" rx="3" ry="24" fill="#0f172a" stroke="#facc15" stroke-width="1.5" />
        <circle cx="328" cy="145" r="6" fill="#f8fafc" stroke="#475569" stroke-width="1.5" />
        <circle cx="328" cy="145" r="2.5" fill="#2563eb" />
      </g>
    </g>
  </g>

  <!-- ==================== KHỐI CHỮ BÊN TRÁI (CHỮ & NÚT XANH DPC) ==================== -->
  <g id="leftText">
    <text x="50" y="130" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="34" font-weight="900" fill="#0f172a" letter-spacing="-0.5">
      HỆ THỐNG SHOWROOM DANGVINHPC
    </text>
    <text x="50" y="170" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="16" font-weight="600" fill="#475569">
      Địa điểm trải nghiệm và mua sắm thiết bị công nghệ cao cấp
    </text>
    <text x="50" y="196" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2563eb">
      📍 191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương
    </text>

    <!-- Nút "XEM NGAY" Màu Xanh Dương Chuẩn DANGVINHPC -->
    <g transform="translate(50, 225)">
      <rect width="160" height="46" rx="8" fill="#2563eb" />
      <text x="80" y="29" font-family="'Be Vietnam Pro', -apple-system, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">
        XEM NGAY
      </text>
    </g>
  </g>
</svg>`;

const SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(SVG_XML)}`;

export function ShowroomHeroIllustration({ onActionClick }: { onActionClick?: () => void }) {
  const { width } = useWindowDimensions();

  // On Web: render native SVG element with interactive cursor and click
  if (Platform.OS === 'web') {
    return (
      <Pressable
        style={styles.containerWeb}
        onPress={onActionClick}
        accessibilityRole="button"
        accessibilityLabel="Xem hệ thống showroom DANGVINHPC Hải Dương"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: SVG_XML }}
        />
      </Pressable>
    );
  }

  // Fallback for native devices
  return (
    <Pressable style={styles.containerNative} onPress={onActionClick}>
      <img
        src={SVG_DATA_URI}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        alt="Hệ thống Showroom DANGVINHPC"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerWeb: {
    width: '100%',
    aspectRatio: 1440 / 480,
    minHeight: 220,
    maxHeight: 460,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f0f7ff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
    cursor: 'pointer',
  } as any,
  containerNative: {
    width: '100%',
    aspectRatio: 1440 / 480,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f0f7ff',
    marginBottom: 24,
  },
});
