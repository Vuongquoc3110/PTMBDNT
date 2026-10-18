import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { formatPrice } from '@/data/products';
import { type Order } from '@/services/api';
import { formatUnitCodes } from '@/utils/deviceUnits';

// Hàm đọc số tiền thành chữ Tiếng Việt chuẩn ngân hàng
function numberToVietnameseWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'Không đồng';
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

  function readGroup(n: number, isFirst: boolean): string {
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;
    let res = '';

    if (h > 0 || !isFirst) {
      res += `${digits[h]} trăm `;
    }

    if (t > 1) {
      res += `${digits[t]} mươi `;
      if (u === 1) res += 'mốt ';
      else if (u === 5) res += 'lăm ';
      else if (u > 0) res += `${digits[u]} `;
    } else if (t === 1) {
      res += 'mười ';
      if (u === 5) res += 'lăm ';
      else if (u > 0) res += `${digits[u]} `;
    } else if (t === 0) {
      if (h > 0 && u > 0) res += `lẻ ${digits[u]} `;
      else if (isFirst && u > 0) res += `${digits[u]} `;
    }

    return res.trim();
  }

  const groups: number[] = [];
  let temp = Math.floor(num);
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let words = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g > 0) {
      const read = readGroup(g, i === groups.length - 1);
      words += `${read} ${units[i]} `;
    }
  }

  words = words.trim() + ' đồng chẵn';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | any;
  customerName?: string;
  customerPhone?: string;
}

export function InvoiceModal({
  visible,
  onClose,
  order,
  customerName,
  customerPhone,
}: InvoiceModalProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const invoiceData = useMemo(() => {
    if (!order) return null;
    const orderNum = order.orderNumber || String(order.id || 'DPC-ORDER');
    const invoiceCode = `HD-${orderNum.replace(/^ORD-?/i, '')}`;
    const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

    const pad = (n: number) => String(n).padStart(2, '0');
    const dateFormatted = `${pad(orderDate.getDate())}/${pad(orderDate.getMonth() + 1)}/${orderDate.getFullYear()}`;
    const timeFormatted = `${pad(orderDate.getHours())}:${pad(orderDate.getMinutes())}:${pad(orderDate.getSeconds())}`;

    // Tách thông tin khách hàng từ shippingAddress nếu có
    const addr = String(order.shippingAddress || '');
    const phoneMatch = addr.match(/0[0-9]{8,10}/)?.[0] || customerPhone || '';
    const phoneIdx = addr.indexOf(phoneMatch);
    let name = customerName || '';
    let addressOnly = addr;

    if (phoneMatch && phoneIdx > 0 && !customerName) {
      name = addr.slice(0, phoneIdx).replace(/[-–,:]/g, '').trim();
      addressOnly = addr.slice(phoneIdx + phoneMatch.length).replace(/^[-–,:\s]+/, '').trim();
    }

    const items = (order.items || []).map((it: any, idx: number) => {
      const serial = formatUnitCodes(it);
      const qty = Number(it.quantity) || 1;
      const price = Number(it.price) || 0;
      return {
        ...it,
        stt: idx + 1,
        serial,
        quantity: qty,
        price,
        total: price * qty,
      };
    });

    const subtotal = items.reduce((sum: number, it: any) => sum + it.total, 0);
    const totalAmount = Number(order.totalAmount) || subtotal;
    let tax = order.invoiceTotals;
    if (typeof tax === 'string') {
      try { tax = JSON.parse(tax); } catch { tax = null; }
    }
    if (!tax || typeof tax.netAmount !== 'number') {
      const shippingAmount = totalAmount >= 5000000 ? 0 : 30000;
      const goodsTotal = Math.max(0, totalAmount - shippingAmount);
      // Quy chuẩn thuế suất VAT 8% theo Nghị định 44/2023/NĐ-CP & 72/2024/NĐ-CP
      const netAmount = Math.round(goodsTotal / 1.08);
      const vatAmount = goodsTotal - netAmount;
      const discountAmount = Math.max(0, subtotal - goodsTotal);
      tax = {
        vatRate: 8,
        netAmount,
        vatAmount,
        shippingAmount,
        discountAmount,
      };
    }
    const discount = tax ? Number(tax.discountAmount) : Math.max(0, subtotal - totalAmount);
    const amountInWords = numberToVietnameseWords(totalAmount);

    return {
      orderNum,
      invoiceCode,
      dateFormatted,
      timeFormatted,
      name: name || 'Khách hàng',
      phone: phoneMatch || '0865 752 150',
      address: addressOnly || 'Tại hệ thống showroom DANGVINHPC',
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      amountInWords,
      paymentMethod:
        order.paymentMethod === 'vnpay'
          ? 'VNPAY-QR (Chuyển khoản trực tuyến)'
          : order.paymentMethod === 'momo'
          ? 'Ví điện tử MoMo'
          : order.paymentMethod === 'cod'
          ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
          : 'Chuyển khoản ngân hàng',
      isPaid: order.status === 'completed' || order.paymentMethod === 'vnpay' || order.paymentMethod === 'momo',
    };
  }, [order, customerName, customerPhone]);

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const itemsRowsHtml = invoiceData.items.map((it: any) => {
            const imeiList = it.deviceUnits && it.deviceUnits.length > 0
              ? it.deviceUnits.map((u: any) => u.manufacturerSerial
                  ? `<div><strong>IMEI:</strong> <span style="color:#059669; font-weight:700;">${u.manufacturerSerial}</span> <span style="font-size:10px; color:#64748b;">(Mã BH: ${u.code})</span></div>`
                  : `<div>Mã BH: ${u.code}</div>`).join('')
              : `<div>${it.serial || ''}</div>`;

            return `
              <tr>
                <td style="text-align: center;">${it.stt}</td>
                <td>
                  <strong>${it.name}</strong>
                  ${it.selectedConfig ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">Cấu hình: ${it.selectedConfig}</div>` : ''}
                </td>
                <td style="font-size: 11px; font-family: monospace;">
                  ${imeiList}
                </td>
                <td style="text-align: center; font-weight: 700;">${it.quantity}</td>
                <td style="text-align: right;">${formatPrice(it.price)}</td>
                <td style="text-align: right; font-weight: 700;">${formatPrice(it.total)}</td>
              </tr>
            `;
          }).join('');

          const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Hóa Đơn Điện Tử #${invoiceData.invoiceCode} - DANGVINHPC</title>
              <style>
                @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
                * { box-sizing: border-box; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                  color: #0f172a;
                  line-height: 1.45;
                  font-size: 12px;
                  margin: 0;
                  padding: 20px;
                  background: #fff;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  border-bottom: 2px solid #2563eb;
                  padding-bottom: 12px;
                  margin-bottom: 16px;
                }
                .brand-title { font-size: 20px; font-weight: 900; color: #2563eb; letter-spacing: 0.5px; }
                .sub-info { font-size: 11px; color: #475569; line-height: 1.4; }
                .invoice-meta { text-align: right; font-size: 11px; color: #475569; }
                .doc-title {
                  text-align: center;
                  font-size: 18px;
                  font-weight: 900;
                  text-transform: uppercase;
                  color: #1e293b;
                  margin: 14px 0 4px;
                  letter-spacing: 0.5px;
                }
                .doc-subtitle { text-align: center; font-size: 11.5px; color: #64748b; margin-bottom: 16px; }
                .customer-box {
                  background: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 12px 14px;
                  margin-bottom: 16px;
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 6px 16px;
                  font-size: 12px;
                }
                .table-items {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 14px;
                }
                .table-items th {
                  background: #f1f5f9;
                  border: 1px solid #cbd5e1;
                  padding: 8px 6px;
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  color: #334155;
                }
                .table-items td {
                  border: 1px solid #cbd5e1;
                  padding: 7px 8px;
                  vertical-align: middle;
                }
                .table-items tr:nth-child(even) { background: #fafafa; }
                .summary-grid {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  gap: 20px;
                  margin-top: 10px;
                  padding-top: 10px;
                  border-top: 1px dashed #cbd5e1;
                }
                .words-wrap {
                  flex: 1;
                  font-size: 12px;
                  color: #334155;
                }
                .totals-wrap {
                  width: 340px;
                  font-size: 12px;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 3px 0;
                  color: #475569;
                }
                .total-row.highlight {
                  font-weight: 700;
                  color: #0f172a;
                }
                .total-row.vat-row {
                  color: #2563eb;
                  font-weight: 800;
                }
                .divider { border-bottom: 1.5px solid #0f172a; margin: 6px 0; }
                .final-row {
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                  font-weight: 900;
                  color: #dc2626;
                }
                .signatures {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 28px;
                  text-align: center;
                }
                .sig-col { width: 45%; }
                .sig-title { font-weight: 700; font-size: 12px; text-transform: uppercase; }
                .sig-hint { font-size: 11px; color: #64748b; font-style: italic; }
                .stamp-box {
                  margin: 12px auto 0;
                  width: 170px;
                  height: 65px;
                  border: 2px dashed #16a34a;
                  border-radius: 8px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  color: #16a34a;
                  font-weight: 800;
                  font-size: 11px;
                }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="brand-title">DANGVINHPC STORE</div>
                  <div class="sub-info"><strong>CÔNG TY TNHH CÔNG NGHỆ & MÁY TÍNH DANGVINHPC</strong></div>
                  <div class="sub-info">Địa chỉ: 191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương</div>
                  <div class="sub-info">Mã số thuế: <strong>0109876543</strong> • Hotline: 1800 6868 • cskh@dangvinhpc.vn</div>
                </div>
                <div class="invoice-meta">
                  <div><strong>Mẫu số - Ký hiệu:</strong> 1/001 - DPC24E</div>
                  <div><strong>Số hóa đơn:</strong> <span style="color:#2563eb; font-weight:800;">${invoiceData.invoiceCode}</span></div>
                  <div><strong>Mã đơn hàng:</strong> #${invoiceData.orderNum}</div>
                  <div><strong>Ngày lập:</strong> ${invoiceData.dateFormatted} ${invoiceData.timeFormatted}</div>
                </div>
              </div>

              <div class="doc-title">HÓA ĐƠN ĐIỆN TỬ GIÁ TRỊ GIA TĂNG (VAT INVOICE)</div>
              <div class="doc-subtitle">Bản thể hiện của hóa đơn điện tử khởi tạo từ hệ thống bán lẻ chính hãng DANGVINHPC</div>

              <div class="customer-box">
                <div><strong>Người mua hàng:</strong> ${invoiceData.name}</div>
                <div><strong>Số điện thoại:</strong> ${invoiceData.phone}</div>
                <div style="grid-column: span 2;"><strong>Địa chỉ giao hàng:</strong> ${invoiceData.address}</div>
                <div><strong>Hình thức thanh toán:</strong> ${invoiceData.paymentMethod}</div>
                <div><strong>Trạng thái:</strong> <span style="font-weight:800; color:${invoiceData.isPaid ? '#16a34a' : '#b45309'};">${invoiceData.isPaid ? '✔ Đã thanh toán' : '⏳ Thu tiền khi giao (COD)'}</span></div>
              </div>

              <table class="table-items">
                <thead>
                  <tr>
                    <th style="width: 35px; text-align: center;">STT</th>
                    <th>Tên sản phẩm, hàng hóa dịch vụ</th>
                    <th style="width: 220px;">Mã bảo hành / IMEI máy</th>
                    <th style="width: 45px; text-align: center;">SL</th>
                    <th style="width: 100px; text-align: right;">Đơn giá</th>
                    <th style="width: 110px; text-align: right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRowsHtml}
                </tbody>
              </table>

              <div class="summary-grid">
                <div class="words-wrap">
                  <div><strong>Số tiền viết bằng chữ:</strong> <em>${invoiceData.amountInWords}.</em></div>
                  <div style="margin-top: 8px; font-size: 11px; color: #64748b; line-height: 1.4;">
                    * Hóa đơn điện tử có giá trị pháp lý theo quy định hiện hành của Bộ Tài chính.<br>
                    * Toàn bộ sản phẩm được bảo hành chính hãng theo đúng số IMEI và mã bảo hành đã cấp trên hóa đơn.
                  </div>
                </div>

                <div class="totals-wrap">
                  <div class="total-row">
                    <span>Tổng tiền hàng:</span>
                    <span>${formatPrice(invoiceData.subtotal)}</span>
                  </div>
                  ${invoiceData.discount > 0 ? `
                    <div class="total-row" style="color:#16a34a;">
                      <span>Chiết khấu / Voucher:</span>
                      <span>-${formatPrice(invoiceData.discount)}</span>
                    </div>
                  ` : ''}
                  <div class="total-row">
                    <span>Phí vận chuyển:</span>
                    <span>${invoiceData.tax.shippingAmount === 0 ? 'Miễn phí (0₫)' : formatPrice(invoiceData.tax.shippingAmount)}</span>
                  </div>
                  <div class="total-row highlight">
                    <span>Tiền hàng trước thuế:</span>
                    <span>${formatPrice(invoiceData.tax.netAmount)}</span>
                  </div>
                  <div class="total-row vat-row">
                    <span>Thuế GTGT (VAT ${invoiceData.tax.vatRate}% đã gồm):</span>
                    <span>${formatPrice(invoiceData.tax.vatAmount)}</span>
                  </div>
                  <div class="divider"></div>
                  <div class="final-row">
                    <span>TỔNG THANH TOÁN:</span>
                    <span>${formatPrice(invoiceData.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div class="signatures">
                <div class="sig-col">
                  <div class="sig-title">NGƯỜI MUA HÀNG</div>
                  <div class="sig-hint">(Ký, ghi rõ họ tên)</div>
                  <div style="height: 50px;"></div>
                  <div><strong>${invoiceData.name}</strong></div>
                </div>
                <div class="sig-col">
                  <div class="sig-title">NGƯỜI BÁN HÀNG / THỦ TRƯỞNG ĐƠN VỊ</div>
                  <div class="sig-hint">(Chữ ký điện tử, con dấu số)</div>
                  <div class="stamp-box">
                    <div>✔ ĐÃ KÝ ĐIỆN TỬ</div>
                    <div style="font-size: 9px; margin-top: 2px;">DANGVINHPC STORE</div>
                    <div style="font-size: 9px; color: #64748b;">${invoiceData.dateFormatted}</div>
                  </div>
                </div>
              </div>

              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 250);
                };
              </script>
            </body>
            </html>
          `;
          printWindow.document.open();
          printWindow.document.write(html);
          printWindow.document.close();
          return;
        }
      } catch (e) {
        console.warn('Popup print blocked or failed, fallback to window.print():', e);
      }
      window.print();
    } else {
      alert('Chức năng in sẵn sàng trên trình duyệt máy tính / điện thoại');
    }
  };

  if (!visible || !invoiceData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        {/* THANH ĐIỀU KHIỂN NỔI (ACTION BAR) - ẨN KHI BẤM IN */}
        <View style={styles.controlBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="receipt-outline" size={20} color="#ffffff" />
            <Text style={styles.controlBarTitle}>
              Hóa đơn điện tử #{invoiceData.invoiceCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable style={styles.printBtn} onPress={handlePrint}>
              <Ionicons name="print-outline" size={17} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.printBtnText}>In hóa đơn / Lưu PDF</Text>
            </Pressable>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* KHUNG GIẤY HÓA ĐƠN TRẮNG A4 TIÊU CHUẨN */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.paperScroll}
          contentContainerStyle={[styles.paperScrollContent, isMobile && { padding: 8 }]}
        >
          <View style={[styles.invoicePaper, isMobile && styles.invoicePaperMobile]}>
            {/* DẤU MỘC ĐIỆN TỬ NẰM CHÌM MỜ */}
            <View style={styles.sealWatermark}>
              <View style={[styles.sealCircle, invoiceData.isPaid ? styles.sealCirclePaid : styles.sealCirclePending]}>
                <Text style={[styles.sealTextTop, invoiceData.isPaid ? styles.sealTextPaid : styles.sealTextPending]}>
                  DANGVINHPC STORE
                </Text>
                <Text style={[styles.sealTextMid, invoiceData.isPaid ? styles.sealTextPaid : styles.sealTextPending]}>
                  {invoiceData.isPaid ? '★ ĐÃ THANH TOÁN ★' : '★ XÁC NHẬN ĐƠN ★'}
                </Text>
                <Text style={[styles.sealTextBot, invoiceData.isPaid ? styles.sealTextPaid : styles.sealTextPending]}>
                  CHÍNH HÃNG 100%
                </Text>
              </View>
            </View>

            {/* HEADER CÔNG TY & LOGO */}
            <View style={styles.companyHeader}>
              <View style={{ flex: 1, minWidth: 200 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <View style={styles.brandIconMini}>
                    <Ionicons name="hardware-chip" size={18} color="#ffffff" />
                  </View>
                  <Text style={styles.companyName}>DANGVINHPC HI-END STORE</Text>
                </View>
                <Text style={styles.companyInfoText}>
                  CÔNG TY TNHH THƯƠNG MẠI & CÔNG NGHỆ DANGVINHPC
                </Text>
                <Text style={styles.companyInfoText}>
                  Trụ sở: 191 Nguyễn Thị Duệ, Phường Thanh Bình, TP. Hải Dương
                </Text>
                <Text style={styles.companyInfoText}>
                  Chi nhánh: 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </Text>
                <Text style={styles.companyInfoText}>
                  Hotline: <Text style={{ fontWeight: '700' }}>1900 8888</Text> • Website: <Text style={{ color: '#2563eb' }}>dangvinhpc.vn</Text>
                </Text>
              </View>

              <View style={[styles.invoiceMetaBox, isMobile && { marginTop: 12, alignItems: 'flex-start' }]}>
                <Text style={styles.invoiceMetaTitle}>HÓA ĐƠN BÁN HÀNG</Text>
                <Text style={styles.invoiceMetaSub}>KIÊM PHIẾU BẢO HÀNH CHÍNH HÃNG</Text>
                <Text style={styles.invoiceMetaCode}>Số HĐ: <Text style={{ fontWeight: '800', color: '#dc2626' }}>{invoiceData.invoiceCode}</Text></Text>
                <Text style={styles.invoiceMetaDate}>Mã đơn hàng: #{invoiceData.orderNum}</Text>
                <Text style={styles.invoiceMetaDate}>Ngày lập: {invoiceData.dateFormatted} lúc {invoiceData.timeFormatted}</Text>
              </View>
            </View>

            <View style={styles.invoiceDivider} />

            {/* THÔNG TIN KHÁCH HÀNG & PHƯƠNG THỨC THANH TOÁN */}
            <View style={styles.customerSection}>
              <View style={styles.customerCol}>
                <Text style={styles.sectionLabel}>THÔNG TIN NGƯỜI MUA HÀNG:</Text>
                <Text style={styles.customerText}>
                  Họ và tên: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{invoiceData.name}</Text>
                </Text>
                <Text style={styles.customerText}>
                  Số điện thoại: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{invoiceData.phone}</Text>
                </Text>
                <Text style={styles.customerText}>
                  Địa chỉ nhận hàng: {invoiceData.address}
                </Text>
              </View>

              <View style={styles.customerCol}>
                <Text style={styles.sectionLabel}>HÌNH THỨC GIAO DỊCH:</Text>
                <Text style={styles.customerText}>
                  Phương thức thanh toán: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{invoiceData.paymentMethod}</Text>
                </Text>
                <Text style={styles.customerText}>
                  Trạng thái thanh toán:{' '}
                  <Text style={{ fontWeight: '800', color: invoiceData.isPaid ? '#15803d' : '#b45309' }}>
                    {invoiceData.isPaid ? '✔ Đã thanh toán đầy đủ' : '⏳ Thu tiền khi giao hàng (COD)'}
                  </Text>
                </Text>
                <Text style={styles.customerText}>
                  Đơn vị vận chuyển: DPC Express Chuyển phát hỏa tốc
                </Text>
              </View>
            </View>

            {/* BẢNG CHI TIẾT SẢN PHẨM / THIẾT BỊ */}
            <View style={styles.tableWrap}>
              <View style={styles.tableHeader}>
                <Text style={[styles.thText, { width: 36, textAlign: 'center' }]}>STT</Text>
                <Text style={[styles.thText, { flex: 3 }]}>Tên sản phẩm / Linh kiện</Text>
                <Text style={[styles.thText, { flex: 2 }]}>Mã bảo hành / S/N</Text>
                <Text style={[styles.thText, { width: 50, textAlign: 'center' }]}>SL</Text>
                <Text style={[styles.thText, { flex: 1.8, textAlign: 'right' }]}>Đơn giá</Text>
                <Text style={[styles.thText, { flex: 2, textAlign: 'right' }]}>Thành tiền</Text>
              </View>

              {invoiceData.items.map((it: any, i: number) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tdText, { width: 36, textAlign: 'center' }]}>{it.stt}</Text>
                  <View style={{ flex: 3, paddingRight: 6 }}>
                    <Text style={styles.productNameText}>{it.name}</Text>
                    {it.selectedConfig ? (
                      <Text style={styles.productConfigText}>Cấu hình: {it.selectedConfig}</Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 2, paddingRight: 4 }}>
                    {it.deviceUnits && it.deviceUnits.length > 0 ? (
                      it.deviceUnits.map((u: any, uIdx: number) => (
                        <View key={uIdx} style={{ marginBottom: 3 }}>
                          {u.manufacturerSerial ? (
                            <Text style={[styles.serialCodeText, { color: '#059669', fontWeight: '800' }]}>
                              IMEI: {u.manufacturerSerial}
                            </Text>
                          ) : null}
                          <Text style={[styles.serialCodeText, { fontSize: 10, color: '#475569' }]}>
                            Mã BH: {u.code}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.serialCodeText}>{it.serial}</Text>
                    )}
                    <Text style={styles.warrantyHint}>BH chính hãng</Text>
                  </View>
                  <Text style={[styles.tdText, { width: 50, textAlign: 'center', fontWeight: '700' }]}>{it.quantity}</Text>
                  <Text style={[styles.tdText, { flex: 1.8, textAlign: 'right' }]}>{formatPrice(it.price)}</Text>
                  <Text style={[styles.tdText, { flex: 2, textAlign: 'right', fontWeight: '800', color: '#0f172a' }]}>
                    {formatPrice(it.total)}
                  </Text>
                </View>
              ))}
            </View>

            {/* TỔNG TIỀN VÀ THANH TOÁN */}
            <View style={styles.summarySection}>
              <View style={styles.wordsAmountWrap}>
                <Text style={styles.wordsAmountLabel}>Số tiền viết bằng chữ:</Text>
                <Text style={styles.wordsAmountText}>{invoiceData.amountInWords}.</Text>
                <Text style={styles.invoiceNote}>
                  * Quý khách vui lòng kiểm tra kỹ số lượng, ngoại quan máy và phiếu bảo hành trước khi nhận hàng. Giữ hóa đơn để phục vụ công tác tra cứu bảo hành chính hãng.
                </Text>
              </View>

              <View style={styles.totalsTable}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>Tổng tiền hàng:</Text>
                  <Text style={styles.totalRowVal}>{formatPrice(invoiceData.subtotal)}</Text>
                </View>
                {invoiceData.discount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalRowLabel, { color: '#16a34a' }]}>Chiết khấu / Voucher:</Text>
                    <Text style={[styles.totalRowVal, { color: '#16a34a' }]}>-{formatPrice(invoiceData.discount)}</Text>
                  </View>
                )}
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>Phí vận chuyển:</Text>
                  <Text style={styles.totalRowVal}>
                    {invoiceData.tax?.shippingAmount === 0 ? 'Miễn phí (0₫)' : formatPrice(invoiceData.tax?.shippingAmount || 0)}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>Tiền hàng trước thuế:</Text>
                  <Text style={styles.totalRowVal}>{formatPrice(invoiceData.tax.netAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>Thuế GTGT (VAT {invoiceData.tax.vatRate}% đã bao gồm):</Text>
                  <Text style={[styles.totalRowVal, { color: '#2563eb', fontWeight: '800' }]}>{formatPrice(invoiceData.tax.vatAmount)}</Text>
                </View>
                <View style={styles.totalDivider} />
                <View style={styles.finalTotalRow}>
                  <Text style={styles.finalTotalLabel}>TỔNG CỘNG THANH TOÁN:</Text>
                  <Text style={styles.finalTotalVal}>{formatPrice(invoiceData.totalAmount)}</Text>
                </View>
              </View>
            </View>

            {/* CHỮ KÝ VÀ DẤU XÁC NHẬN */}
            <View style={styles.signatureRow}>
              <View style={styles.signCol}>
                <Text style={styles.signTitle}>NGƯỜI MUA HÀNG</Text>
                <Text style={styles.signSubtitle}>(Ký và ghi rõ họ tên)</Text>
                <View style={{ height: 65 }} />
                <Text style={styles.signedName}>{invoiceData.name}</Text>
              </View>

              <View style={styles.signCol}>
                <Text style={styles.signTitle}>NGƯỜI GIAO HÀNG</Text>
                <Text style={styles.signSubtitle}>(Ký và ghi rõ họ tên)</Text>
                <View style={{ height: 65 }} />
                <Text style={styles.signedName}>Bưu tá DPC Express</Text>
              </View>

              <View style={styles.signCol}>
                <Text style={styles.signTitle}>ĐẠI DIỆN DANGVINHPC</Text>
                <Text style={styles.signSubtitle}>(Ký, đóng dấu số điện tử)</Text>
                <View style={styles.electronicStamp}>
                  <Text style={styles.electronicStampText}>ĐÃ KÝ ĐIỆN TỬ</Text>
                  <Text style={styles.electronicStampSub}>DANGVINHPC CO., LTD</Text>
                </View>
                <Text style={styles.signedName}>Nguyễn Đăng Vịnh</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlBar: {
    width: '100%',
    maxWidth: 820,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    marginBottom: 12,
  },
  controlBarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  printBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#334155',
  },

  paperScroll: {
    width: '100%',
    maxWidth: 820,
  },
  paperScrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  invoicePaper: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  invoicePaperMobile: {
    padding: 16,
  },

  /* WATERMARK SEAL */
  sealWatermark: {
    position: 'absolute',
    top: '38%',
    right: 40,
    opacity: 0.08,
    pointerEvents: 'none',
    transform: [{ rotate: '-18deg' }],
  },
  sealCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  sealCirclePaid: {
    borderColor: '#16a34a',
  },
  sealCirclePending: {
    borderColor: '#ea580c',
  },
  sealTextTop: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  sealTextMid: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    marginVertical: 4,
  },
  sealTextBot: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  sealTextPaid: {
    color: '#16a34a',
  },
  sealTextPending: {
    color: '#ea580c',
  },

  /* COMPANY HEADER */
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
  },
  brandIconMini: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  companyInfoText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  invoiceMetaBox: {
    alignItems: 'flex-end',
  },
  invoiceMetaTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  invoiceMetaSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  invoiceMetaCode: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  invoiceMetaDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  invoiceDivider: {
    height: 2,
    backgroundColor: '#0f172a',
    marginVertical: 18,
  },

  /* CUSTOMER & ORDER SECTION */
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  customerCol: {
    flex: 1,
    minWidth: 240,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  customerText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  /* PRODUCT TABLE */
  tableWrap: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  thText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tdText: {
    fontSize: 12,
    color: '#334155',
  },
  productNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 16,
  },
  productConfigText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  serialCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  warrantyHint: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '600',
  },

  /* SUMMARY */
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  wordsAmountWrap: {
    flex: 1,
    minWidth: 260,
  },
  wordsAmountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  wordsAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    fontStyle: 'italic',
    marginTop: 2,
  },
  invoiceNote: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 10,
    lineHeight: 16,
  },
  totalsTable: {
    width: 280,
    gap: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRowLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  totalRowVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  finalTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#dc2626',
  },

  /* SIGNATURE */
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  signCol: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
  },
  signTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  signSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  signedName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 6,
  },
  electronicStamp: {
    height: 65,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    transform: [{ rotate: '-4deg' }],
  },
  electronicStampText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 1,
  },
  electronicStampSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 2,
  },
});
