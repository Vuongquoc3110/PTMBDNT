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
      const rawDigits = orderNum.replace(/[^0-9]/g, '');
      const serial = it.serialNumber || `SN-DPC-${rawDigits.slice(-8) || order.id || '88392102'}-${idx + 1}`;
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
    const discount = Math.max(0, subtotal - totalAmount);
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
                <Text style={[styles.thText, { flex: 2 }]}>Mã S/N (Bảo hành)</Text>
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
                    <Text style={styles.serialCodeText}>{it.serial}</Text>
                    <Text style={styles.warrantyHint}>BH 24-36T chính hãng</Text>
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
                  <Text style={[styles.totalRowVal, { color: '#16a34a', fontWeight: '700' }]}>MIỄN PHÍ</Text>
                </View>
                <View style={styles.totalDivider} />
                <View style={styles.finalTotalRow}>
                  <Text style={styles.finalTotalLabel}>TỔNG CỘNG:</Text>
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
