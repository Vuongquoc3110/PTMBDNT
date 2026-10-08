import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { apiService, type SupportTicket } from '@/services/api';

type ChatAction = { label: string; path: '/products' | '/orders' };
type ChatRole = 'assistant' | 'customer' | 'admin';
type ChatMessage = { id: string | number; role: ChatRole; text: string; action?: ChatAction; pending?: boolean };
type BotReply = Pick<ChatMessage, 'text' | 'action'> & { escalate?: boolean };

const QUICK_PROMPTS = ['Tư vấn sản phẩm', 'Kiểm tra đơn hàng', 'Bảo hành, đổi trả', 'Gặp nhân viên hỗ trợ'];
const SESSION_KEY = 'dvpc_support_session';
const ESCALATE_TEXT =
  'Câu hỏi này mình chưa trả lời được nên đã chuyển tới nhân viên hỗ trợ. Admin sẽ phản hồi ngay tại khung chat này, bạn vui lòng đợi trong giây lát nhé!';

let memorySessionId: string | null = null;
function createSessionId() {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function getSessionId() {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = createSessionId();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }
  if (!memorySessionId) memorySessionId = createSessionId();
  return memorySessionId;
}

function getReply(message: string): BotReply {
  const query = message.toLowerCase();

  if (/nhân viên|admin|người thật|tư vấn viên|hỗ trợ trực tiếp|liên hệ/.test(query)) {
    return {
      text: 'Đã kết nối bạn với nhân viên hỗ trợ. Admin sẽ trả lời ngay tại đây, bạn cứ để lại câu hỏi nhé!',
      escalate: true,
    };
  }

  if (/đơn hàng|mã đơn|vận đơn|theo dõi đơn/.test(query)) {
    return {
      text: 'Bạn có thể xem trạng thái đơn trong mục Đơn hàng sau khi đăng nhập. Nếu chưa thấy đơn, hãy kiểm tra lại bằng email hoặc số điện thoại đã đặt hàng.',
      action: { label: 'Mở đơn hàng', path: '/orders' },
    };
  }

  if (/bảo hành|đổi trả|đổi hàng|hoàn tiền/.test(query)) {
    return {
      text: 'Chính sách bảo hành và đổi trả tùy theo sản phẩm. Bạn gửi tên sản phẩm cùng mã đơn để được hướng dẫn tra cứu chính xác nhé.',
    };
  }

  if (/giao hàng|vận chuyển|ship|thanh toán|trả góp/.test(query)) {
    return {
      text: 'Phương thức thanh toán và thông tin giao hàng sẽ được hiển thị ở bước thanh toán theo địa chỉ nhận hàng của bạn.',
      action: { label: 'Xem sản phẩm', path: '/products' },
    };
  }

  if (/tư vấn|sản phẩm|laptop|pc|máy tính|ngân sách|giá/.test(query)) {
    return {
      text: 'Mình có thể giúp bạn bắt đầu tìm kiếm. Bạn cho biết nhu cầu chính và khoảng ngân sách để chọn nhóm sản phẩm phù hợp nhé.',
      action: { label: 'Duyệt sản phẩm', path: '/products' },
    };
  }

  // Không hiểu câu hỏi -> chuyển cho admin xử lý
  return { text: ESCALATE_TEXT, escalate: true };
}

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  text: 'Chào bạn! Mình có thể giúp tìm sản phẩm, tra cứu đơn hàng hoặc hướng dẫn bảo hành. Nếu mình không trả lời được, câu hỏi sẽ được chuyển tới nhân viên hỗ trợ.',
};

export function SupportChatWidget() {
  const router = useRouter();
  const { user } = useAppContext();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const bottomOffset = isMobile ? 82 : 22;
  const panelWidth = Math.min(width - 24, 360);
  const panelHeight = Math.min(500, Math.max(320, height - bottomOffset - 36));
  const messageId = useRef(1);
  const listRef = useRef<ScrollView>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const ticketId = ticket?.id;
  const ticketStatus = ticket?.status;
  const isLive = !!ticket && ticket.status !== 'closed';
  const unread = ticket && !isOpen ? Number(ticket.unreadByCustomer) || 0 : 0;

  // Khôi phục hội thoại đang mở của phiên (nếu có)
  useEffect(() => {
    apiService
      .getSupportTicketBySession(getSessionId())
      .then((t) => {
        if (t && t.status !== 'closed') setTicket(t);
      })
      .catch(() => {});
  }, []);

  const refreshTicket = useCallback(async () => {
    if (!ticketId) return;
    try {
      const fresh = await apiService.getSupportTicket(ticketId, isOpen ? 'customer' : undefined);
      setTicket(fresh);
    } catch {}
  }, [ticketId, isOpen]);

  // Polling phản hồi từ admin
  useEffect(() => {
    if (!ticketId || ticketStatus === 'closed') return;
    refreshTicket();
    const timer = setInterval(refreshTicket, isOpen ? 4000 : 10000);
    return () => clearInterval(timer);
  }, [ticketId, ticketStatus, isOpen, refreshTicket]);

  const pushLocal = (items: Omit<ChatMessage, 'id'>[]) => {
    setMessages((current) => [...current, ...items.map((m) => ({ ...m, id: messageId.current++ }))]);
  };

  const escalate = async (text: string, botReply: string) => {
    setPendingText(text);
    setSending(true);
    try {
      const created = await apiService.createSupportTicket({
        sessionId: getSessionId(),
        message: text,
        botReply,
        userId: user?.id ?? null,
        customerName: user?.name || undefined,
        customerContact: user ? [user.phone, user.email].filter(Boolean).join(' • ') : undefined,
      });
      setTicket(created);
    } catch {
      pushLocal([
        { role: 'customer', text },
        {
          role: 'assistant',
          text: 'Hiện chưa kết nối được tới nhân viên hỗ trợ. Bạn vui lòng thử lại sau hoặc gọi hotline để được giúp đỡ nhanh nhất.',
        },
      ]);
    } finally {
      setPendingText(null);
      setSending(false);
    }
  };

  const sendMessage = async (value = draft) => {
    const text = value.trim();
    if (!text || sending) return;
    setDraft('');

    // Đang chat với nhân viên -> gửi thẳng vào hội thoại
    if (isLive && ticket) {
      setPendingText(text);
      setSending(true);
      try {
        setTicket(await apiService.sendSupportMessage(ticket.id, 'customer', text));
      } catch {
        pushLocal([{ role: 'assistant', text: 'Gửi tin nhắn thất bại, vui lòng thử lại.' }]);
        setDraft(text);
      } finally {
        setPendingText(null);
        setSending(false);
      }
      return;
    }

    const reply = getReply(text);
    if (reply.escalate) {
      await escalate(text, reply.text);
      return;
    }
    pushLocal([
      { role: 'customer', text },
      { role: 'assistant', text: reply.text, action: reply.action },
    ]);
  };

  const endLiveChat = async () => {
    if (!ticket) return;
    try {
      await apiService.updateSupportTicketStatus(ticket.id, 'closed');
    } catch {}
    // Giữ lại lịch sử trên màn hình rồi quay về trợ lý tự động
    const history: Omit<ChatMessage, 'id'>[] = (ticket.messages || []).map((m) => ({
      role: m.sender === 'bot' ? 'assistant' : m.sender,
      text: m.text,
    }));
    setTicket(null);
    pushLocal([...history, { role: 'assistant', text: 'Cuộc trò chuyện với nhân viên đã kết thúc. Cảm ơn bạn đã liên hệ DANGVINHPC!' }]);
  };

  const ticketMessages: ChatMessage[] = (ticket?.messages || []).map((m) => ({
    id: `t-${m.id}`,
    role: m.sender === 'bot' ? 'assistant' : m.sender,
    text: m.text,
  }));
  const displayMessages: ChatMessage[] = [
    ...messages,
    ...ticketMessages,
    ...(pendingText ? [{ id: 'pending', role: 'customer' as const, text: pendingText, pending: true }] : []),
  ];
  const showQuickPrompts = !ticket && messages.length === 1 && !pendingText;

  return (
    <View pointerEvents="box-none" style={[styles.anchor, { bottom: bottomOffset }]}>
      {isOpen && (
        <View style={[styles.panel, { width: panelWidth, height: panelHeight, bottom: 70 }]}>
          <View style={styles.panelHeader}>
            <View style={styles.headerIdentity}>
              <View style={[styles.headerIcon, isLive && styles.headerIconLive]}>
                <Ionicons name={isLive ? 'person' : 'headset-outline'} size={19} color="#ffffff" />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.headerTitle}>Hỗ trợ DANGVINHPC</Text>
                <View style={styles.headerStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: isLive ? '#22c55e' : '#94a3b8' }]} />
                  <Text style={styles.headerSubtitle}>
                    {isLive
                      ? ticket?.status === 'answered'
                        ? 'Nhân viên đã phản hồi'
                        : 'Đang chờ nhân viên phản hồi...'
                      : 'Trợ lý tự động'}
                  </Text>
                </View>
              </View>
            </View>
            {isLive && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Kết thúc trò chuyện với nhân viên"
                onPress={endLiveChat}
                style={styles.endButton}
              >
                <Text style={styles.endButtonText}>Kết thúc</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thu gọn cửa sổ hỗ trợ"
              hitSlop={10}
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={21} color="#ffffff" />
            </Pressable>
          </View>

          <ScrollView
            ref={listRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            {displayMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageGroup,
                  message.role === 'customer' && styles.customerMessageGroup,
                ]}
              >
                {message.role === 'admin' && (
                  <View style={styles.adminLabelRow}>
                    <Ionicons name="shield-checkmark" size={11} color="#7c3aed" />
                    <Text style={styles.adminLabel}>Nhân viên DANGVINHPC</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'customer'
                      ? styles.customerBubble
                      : message.role === 'admin'
                      ? styles.adminBubble
                      : styles.assistantBubble,
                    message.pending && { opacity: 0.6 },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'customer' && styles.customerText,
                      message.role === 'admin' && styles.adminText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                {message.action && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      router.push(message.action!.path as any);
                      setIsOpen(false);
                    }}
                    style={styles.actionLink}
                  >
                    <Text style={styles.actionLinkText}>{message.action.label}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2563eb" />
                  </Pressable>
                )}
              </View>
            ))}

            {isLive && ticket?.status === 'open' && !pendingText && (
              <View style={styles.waitingRow}>
                <ActivityIndicator size="small" color="#7c3aed" />
                <Text style={styles.waitingText}>Nhân viên sẽ phản hồi sớm nhất có thể</Text>
              </View>
            )}

            {showQuickPrompts && (
              <View style={styles.quickPrompts}>
                {QUICK_PROMPTS.map((prompt) => (
                  <Pressable key={prompt} onPress={() => sendMessage(prompt)} style={styles.quickPrompt}>
                    <Text style={styles.quickPromptText}>{prompt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.composer}>
            <TextInput
              accessibilityLabel="Nhập câu hỏi cho bộ phận hỗ trợ"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => sendMessage()}
              placeholder={isLive ? 'Nhắn cho nhân viên hỗ trợ...' : 'Nhập câu hỏi...'}
              placeholderTextColor="#94a3b8"
              returnKeyType="send"
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gửi câu hỏi"
              disabled={!draft.trim() || sending}
              onPress={() => sendMessage()}
              style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={17} color="#ffffff" />
              )}
            </Pressable>
          </View>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'Đóng hỗ trợ khách hàng' : 'Mở hỗ trợ khách hàng'}
        onPress={() => setIsOpen((open) => !open)}
        style={styles.launcher}
      >
        <Ionicons name={isOpen ? 'close' : 'chatbubble-ellipses'} size={25} color="#ffffff" />
        {!isOpen && unread > 0 ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        ) : (
          !isOpen && <View style={styles.onlineDot} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
    alignItems: 'flex-end',
  },
  launcher: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#7c2d12',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  unreadBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  panel: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    elevation: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  panelHeader: {
    minHeight: 68,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#111827',
  },
  headerIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f97316',
  },
  headerIconLive: {
    backgroundColor: '#7c3aed',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  headerStatusRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  headerSubtitle: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  endButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  endButtonText: {
    color: '#fecaca',
    fontSize: 11,
    fontWeight: '700',
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messageContent: {
    padding: 14,
    gap: 12,
  },
  messageGroup: {
    alignItems: 'flex-start',
    maxWidth: '92%',
  },
  customerMessageGroup: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  adminLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    marginLeft: 2,
  },
  adminLabel: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '800',
  },
  messageBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopLeftRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderTopLeftRadius: 4,
  },
  customerBubble: {
    backgroundColor: '#f97316',
    borderTopRightRadius: 4,
  },
  messageText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },
  customerText: {
    color: '#ffffff',
  },
  adminText: {
    color: '#3b0764',
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  waitingText: {
    color: '#64748b',
    fontSize: 11,
    fontStyle: 'italic',
  },
  actionLink: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
  },
  actionLinkText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  quickPrompts: {
    alignItems: 'flex-start',
    gap: 7,
  },
  quickPrompt: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  quickPromptText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  composer: {
    minHeight: 62,
    paddingHorizontal: 11,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontSize: 13,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});
