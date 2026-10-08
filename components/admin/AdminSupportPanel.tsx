import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { apiService, type SupportStatus, type SupportTicket } from '@/services/api';

type Filter = 'all' | SupportStatus;

interface Props {
  isDark: boolean;
  isDesktop: boolean;
  searchTerm?: string;
  showToast: (msg: string) => void;
  onPendingChange?: (count: number) => void;
}

const FILTERS: { id: Filter; label: string; color: string }[] = [
  { id: 'all', label: 'Tất cả', color: '#475569' },
  { id: 'open', label: 'Chờ xử lý', color: '#ef4444' },
  { id: 'answered', label: 'Đã trả lời', color: '#2563eb' },
  { id: 'closed', label: 'Đã đóng', color: '#16a34a' },
];

const QUICK_REPLIES = [
  'Chào bạn, mình là nhân viên DANGVINHPC. Mình có thể giúp gì cho bạn ạ?',
  'Bạn vui lòng cho mình xin mã đơn hàng / số điện thoại đặt hàng để kiểm tra nhé.',
  'Sản phẩm này hiện còn hàng, bạn có thể đặt ngay trên website ạ.',
  'Cảm ơn bạn đã liên hệ! Nếu cần hỗ trợ thêm, bạn cứ nhắn tại đây nhé.',
];

const STATUS_META: Record<SupportStatus, { label: string; bg: string; color: string }> = {
  open: { label: 'Chờ xử lý', bg: '#fef2f2', color: '#dc2626' },
  answered: { label: 'Đã trả lời', bg: '#eff6ff', color: '#2563eb' },
  closed: { label: 'Đã đóng', bg: '#f0fdf4', color: '#16a34a' },
};

function timeAgo(value?: string) {
  if (!value) return '';
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return new Date(value).toLocaleDateString('vi-VN');
}

export function AdminSupportPanel({ isDark, isDesktop, searchTerm = '', showToast, onPendingChange }: Props) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const loadTickets = useCallback(async () => {
    try {
      const data = await apiService.getSupportTickets('all');
      const list = Array.isArray(data) ? data : [];
      setTickets(list);
      setError('');
      onPendingChange?.(list.filter((t) => t.status === 'open').length);
    } catch (err: any) {
      setError(err?.message || 'Không kết nối được máy chủ');
    } finally {
      setLoading(false);
    }
  }, [onPendingChange]);

  const loadSelected = useCallback(async () => {
    if (!selectedId) return;
    try {
      setSelected(await apiService.getSupportTicket(selectedId, 'admin'));
    } catch {}
  }, [selectedId]);

  useEffect(() => {
    loadTickets();
    const timer = setInterval(loadTickets, 6000);
    return () => clearInterval(timer);
  }, [loadTickets]);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    loadSelected();
    const timer = setInterval(loadSelected, 4000);
    return () => clearInterval(timer);
  }, [selectedId, loadSelected]);

  const counts = useMemo(
    () => ({
      all: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      answered: tickets.filter((t) => t.status === 'answered').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    }),
    [tickets]
  );

  const visibleTickets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (!q) return true;
      return [t.customerName, t.customerContact, t.lastMessage, `#${t.id}`]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [tickets, filter, searchTerm]);

  const handleSend = async (text = reply) => {
    const value = text.trim();
    if (!value || !selected || sending) return;
    setSending(true);
    try {
      const updated = await apiService.sendSupportMessage(selected.id, 'admin', value);
      setSelected(updated);
      setReply('');
      loadTickets();
    } catch (err: any) {
      showToast(`Gửi phản hồi thất bại: ${err?.message || 'lỗi kết nối'}`);
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: SupportStatus) => {
    if (!selected) return;
    try {
      setSelected(await apiService.updateSupportTicketStatus(selected.id, status));
      showToast(status === 'closed' ? 'Đã đóng hội thoại' : 'Đã mở lại hội thoại');
      loadTickets();
    } catch (err: any) {
      showToast(`Không cập nhật được: ${err?.message || 'lỗi kết nối'}`);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await apiService.deleteSupportTicket(selected.id);
      showToast('Đã xóa hội thoại');
      setSelectedId(null);
      loadTickets();
    } catch (err: any) {
      showToast(`Không xóa được: ${err?.message || 'lỗi kết nối'}`);
    }
  };

  const c = isDark ? dark : light;
  const showList = isDesktop || !selectedId;
  const showChat = isDesktop || !!selectedId;

  return (
    <View style={[styles.card, c.card]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, c.text]}>Tin nhắn hỗ trợ khách hàng</Text>
          <Text style={[styles.subtitle, c.muted]}>
            Các câu hỏi chatbot không trả lời được sẽ được chuyển về đây để Admin phản hồi trực tiếp
          </Text>
        </View>
        <Pressable style={[styles.refreshBtn, c.chip]} onPress={() => { loadTickets(); loadSelected(); }}>
          <Ionicons name="refresh" size={15} color={isDark ? '#cbd5e1' : '#475569'} />
          <Text style={[styles.refreshText, c.muted]}>Làm mới</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.filterChip, c.chip, active && { backgroundColor: f.color, borderColor: f.color }]}
            >
              <Text style={[styles.filterText, c.muted, active && { color: '#fff' }]}>{f.label}</Text>
              <View style={[styles.filterCount, { backgroundColor: active ? 'rgba(255,255,255,0.25)' : isDark ? '#334155' : '#e2e8f0' }]}>
                <Text style={[styles.filterCountText, { color: active ? '#fff' : isDark ? '#cbd5e1' : '#475569' }]}>
                  {counts[f.id]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={16} color="#b45309" />
          <Text style={styles.errorText}>Không tải được tin nhắn hỗ trợ: {error}. Hãy chắc chắn server backend đang chạy.</Text>
        </View>
      ) : null}

      <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
        {/* Ticket list */}
        {showList && (
          <View style={[styles.listCol, isDesktop && styles.listColDesktop, isDesktop && c.borderRight]}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator color="#7c3aed" />
              </View>
            ) : visibleTickets.length === 0 ? (
              <View style={styles.center}>
                <Ionicons name="chatbubbles-outline" size={42} color="#94a3b8" />
                <Text style={[styles.emptyText, c.muted]}>Chưa có tin nhắn nào cần xử lý</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: isDesktop ? 560 : undefined }} contentContainerStyle={{ gap: 8 }}>
                {visibleTickets.map((t) => {
                  const active = t.id === selectedId;
                  const meta = STATUS_META[t.status] || STATUS_META.open;
                  const unread = Number(t.unreadByAdmin) || 0;
                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => setSelectedId(t.id)}
                      style={[styles.ticketRow, c.row, active && styles.ticketRowActive]}
                    >
                      <View style={[styles.avatar, { backgroundColor: t.userId ? '#2563eb' : '#64748b' }]}>
                        <Text style={styles.avatarText}>{(t.customerName || 'K')[0].toUpperCase()}</Text>
                        {unread > 0 && <View style={styles.avatarDot} />}
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View style={styles.rowTop}>
                          <Text numberOfLines={1} style={[styles.ticketName, c.text, unread > 0 && { fontWeight: '900' }]}>
                            {t.customerName || 'Khách vãng lai'}
                          </Text>
                          <Text style={[styles.ticketTime, c.muted]}>{timeAgo(t.updatedAt)}</Text>
                        </View>
                        <Text numberOfLines={1} style={[styles.ticketPreview, c.muted, unread > 0 && c.text]}>
                          {t.lastSender === 'admin' ? 'Bạn: ' : ''}
                          {t.lastMessage || '...'}
                        </Text>
                        <View style={styles.rowBottom}>
                          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                            <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
                          </View>
                          {unread > 0 && (
                            <View style={styles.unreadPill}>
                              <Text style={styles.unreadPillText}>{unread} mới</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* Conversation */}
        {showChat && (
          <View style={styles.chatCol}>
            {!selected ? (
              <View style={[styles.center, { minHeight: 360 }]}>
                <View style={styles.chatPlaceholderIcon}>
                  <Ionicons name="chatbubble-ellipses-outline" size={34} color="#7c3aed" />
                </View>
                <Text style={[styles.title, c.text, { fontSize: 15 }]}>Chọn một hội thoại</Text>
                <Text style={[styles.emptyText, c.muted]}>Chọn khách hàng ở danh sách bên trái để xem và trả lời</Text>
              </View>
            ) : (
              <>
                <View style={[styles.chatHeader, c.borderBottom]}>
                  {!isDesktop && (
                    <Pressable onPress={() => setSelectedId(null)} style={styles.iconBtn}>
                      <Ionicons name="arrow-back" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                    </Pressable>
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={[styles.chatName, c.text]}>
                      {selected.customerName || 'Khách vãng lai'} <Text style={c.muted}>#{selected.id}</Text>
                    </Text>
                    <Text numberOfLines={1} style={[styles.chatContact, c.muted]}>
                      {selected.customerContact || (selected.userId ? `User ID: ${selected.userId}` : 'Khách chưa đăng nhập')}
                    </Text>
                  </View>
                  {selected.status === 'closed' ? (
                    <Pressable style={[styles.actionBtn, { backgroundColor: '#eff6ff' }]} onPress={() => handleStatus('open')}>
                      <Ionicons name="refresh-circle-outline" size={15} color="#2563eb" />
                      <Text style={[styles.actionBtnText, { color: '#2563eb' }]}>Mở lại</Text>
                    </Pressable>
                  ) : (
                    <Pressable style={[styles.actionBtn, { backgroundColor: '#f0fdf4' }]} onPress={() => handleStatus('closed')}>
                      <Ionicons name="checkmark-done" size={15} color="#16a34a" />
                      <Text style={[styles.actionBtnText, { color: '#16a34a' }]}>Đã xử lý</Text>
                    </Pressable>
                  )}
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#fef2f2' }]} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={15} color="#ef4444" />
                  </Pressable>
                </View>

                <ScrollView
                  ref={scrollRef}
                  style={[styles.messages, c.messagesBg]}
                  contentContainerStyle={{ padding: 14, gap: 10 }}
                  onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                  {(selected.messages || []).map((m) => {
                    const isAdminMsg = m.sender === 'admin';
                    const isBot = m.sender === 'bot';
                    return (
                      <View key={m.id} style={[styles.msgGroup, isAdminMsg && { alignSelf: 'flex-end', alignItems: 'flex-end' }]}>
                        <Text style={[styles.msgMeta, c.muted]}>
                          {isAdminMsg ? 'Admin' : isBot ? '🤖 Chatbot' : selected.customerName || 'Khách'} •{' '}
                          {new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <View
                          style={[
                            styles.bubble,
                            isAdminMsg ? styles.bubbleAdmin : isBot ? [styles.bubbleBot, c.bubbleBot] : [styles.bubbleCustomer, c.bubbleCustomer],
                          ]}
                        >
                          <Text style={[styles.bubbleText, isAdminMsg ? { color: '#fff' } : c.text, isBot && { fontStyle: 'italic' }]}>
                            {m.text}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {selected.status !== 'closed' && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplies}>
                    {QUICK_REPLIES.map((q) => (
                      <Pressable key={q} style={[styles.quickReply, c.chip]} onPress={() => setReply(q)}>
                        <Text numberOfLines={1} style={[styles.quickReplyText, c.muted]}>{q}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                <View style={[styles.composer, c.borderTop]}>
                  <TextInput
                    value={reply}
                    onChangeText={setReply}
                    onSubmitEditing={() => handleSend()}
                    placeholder={selected.status === 'closed' ? 'Hội thoại đã đóng – gửi tin sẽ mở lại' : 'Nhập phản hồi cho khách hàng...'}
                    placeholderTextColor="#94a3b8"
                    returnKeyType="send"
                    multiline
                    style={[styles.input, c.input]}
                  />
                  <Pressable
                    onPress={() => handleSend()}
                    disabled={!reply.trim() || sending}
                    style={[styles.sendBtn, (!reply.trim() || sending) && { backgroundColor: '#94a3b8' }]}
                  >
                    {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={17} color="#fff" />}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12.5, marginTop: 4, lineHeight: 18 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  refreshText: { fontSize: 12, fontWeight: '700' },
  filters: { gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12.5, fontWeight: '700' },
  filterCount: { minWidth: 20, paddingHorizontal: 6, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  filterCountText: { fontSize: 10.5, fontWeight: '800' },
  errorBox: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: 1, padding: 10, borderRadius: 10 },
  errorText: { flex: 1, color: '#92400e', fontSize: 12 },
  body: { gap: 14 },
  bodyDesktop: { flexDirection: 'row', minHeight: 560 },
  listCol: {},
  listColDesktop: { width: 330, paddingRight: 14, borderRightWidth: 1 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 13, textAlign: 'center' },
  ticketRow: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  ticketRowActive: { borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.08)' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  avatarDot: { position: 'absolute', top: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#fff' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  ticketName: { flex: 1, fontSize: 13.5, fontWeight: '700' },
  ticketTime: { fontSize: 10.5 },
  ticketPreview: { fontSize: 12, marginTop: 3 },
  rowBottom: { flexDirection: 'row', gap: 6, marginTop: 7 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusPillText: { fontSize: 10.5, fontWeight: '800' },
  unreadPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: '#ef4444' },
  unreadPillText: { fontSize: 10.5, fontWeight: '800', color: '#fff' },
  chatCol: { flex: 1, minWidth: 0 },
  chatPlaceholderIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 12, borderBottomWidth: 1 },
  iconBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  chatName: { fontSize: 15, fontWeight: '800' },
  chatContact: { fontSize: 12, marginTop: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9 },
  actionBtnText: { fontSize: 12, fontWeight: '800' },
  messages: { flex: 1, minHeight: 320, maxHeight: 440, borderRadius: 12, marginTop: 12 },
  msgGroup: { maxWidth: '82%', alignItems: 'flex-start' },
  msgMeta: { fontSize: 10.5, marginBottom: 4, marginHorizontal: 4 },
  bubble: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14 },
  bubbleAdmin: { backgroundColor: '#7c3aed', borderTopRightRadius: 4 },
  bubbleBot: { borderWidth: 1, borderStyle: 'dashed', borderTopLeftRadius: 4 },
  bubbleCustomer: { borderWidth: 1, borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 13.5, lineHeight: 20 },
  quickReplies: { gap: 8, paddingTop: 10 },
  quickReply: { maxWidth: 260, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  quickReplyText: { fontSize: 12 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingTop: 10, marginTop: 10, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 42, maxHeight: 110, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, fontSize: 13.5 },
  sendBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center' },
});

const light = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  text: { color: '#0f172a' },
  muted: { color: '#64748b' },
  chip: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  row: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  borderRight: { borderRightColor: '#e2e8f0' },
  borderBottom: { borderBottomColor: '#e2e8f0' },
  borderTop: { borderTopColor: '#e2e8f0' },
  messagesBg: { backgroundColor: '#f8fafc' },
  bubbleBot: { backgroundColor: '#ffffff', borderColor: '#cbd5e1' },
  bubbleCustomer: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  input: { backgroundColor: '#f1f5f9', color: '#0f172a' },
});

const dark = StyleSheet.create({
  card: { backgroundColor: '#18181b', borderColor: '#27272a' },
  text: { color: '#f1f5f9' },
  muted: { color: '#94a3b8' },
  chip: { backgroundColor: '#1f2937', borderColor: '#334155' },
  row: { backgroundColor: '#1f1f23', borderColor: '#2f2f35' },
  borderRight: { borderRightColor: '#27272a' },
  borderBottom: { borderBottomColor: '#27272a' },
  borderTop: { borderTopColor: '#27272a' },
  messagesBg: { backgroundColor: '#111114' },
  bubbleBot: { backgroundColor: '#1f1f23', borderColor: '#3f3f46' },
  bubbleCustomer: { backgroundColor: '#27272a', borderColor: '#3f3f46' },
  input: { backgroundColor: '#27272a', color: '#f1f5f9' },
});
