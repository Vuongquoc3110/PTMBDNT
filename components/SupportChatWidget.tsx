import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

type ChatAction = { label: string; path: '/products' | '/orders' };
type ChatMessage = { id: number; role: 'assistant' | 'customer'; text: string; action?: ChatAction };

const QUICK_PROMPTS = ['Tư vấn sản phẩm', 'Kiểm tra đơn hàng', 'Bảo hành, đổi trả'];

function getReply(message: string): Pick<ChatMessage, 'text' | 'action'> {
  const query = message.toLowerCase();

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

  return {
    text: 'Mình là trợ lý tự động của DANGVINHPC. Bạn có thể hỏi về sản phẩm, đơn hàng, giao hàng hoặc bảo hành; câu hỏi ngoài các mục này cần nhân viên hỗ trợ xác nhận.',
  };
}

export function SupportChatWidget() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const bottomOffset = isMobile ? 82 : 22;
  const panelWidth = Math.min(width - 24, 360);
  const panelHeight = Math.min(460, Math.max(300, height - bottomOffset - 36));
  const messageId = useRef(1);
  const listRef = useRef<ScrollView>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Chào bạn! Mình có thể giúp tìm sản phẩm, tra cứu đơn hàng hoặc hướng dẫn bảo hành. Chọn một chủ đề hoặc nhập câu hỏi nhé.',
    },
  ]);

  const sendMessage = (value = draft) => {
    const text = value.trim();
    if (!text) return;

    const reply = getReply(text);
    const customerMessageId = messageId.current++;
    const assistantMessageId = messageId.current++;
    setMessages((current) => [
      ...current,
      { id: customerMessageId, role: 'customer', text },
      { id: assistantMessageId, role: 'assistant', ...reply },
    ]);
    setDraft('');
  };

  return (
    <View pointerEvents="box-none" style={[styles.anchor, { bottom: bottomOffset }]}>
      {isOpen && (
        <View style={[styles.panel, { width: panelWidth, height: panelHeight, bottom: 70 }]}>
          <View style={styles.panelHeader}>
            <View style={styles.headerIdentity}>
              <View style={styles.headerIcon}>
                <Ionicons name="headset-outline" size={19} color="#ffffff" />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.headerTitle}>Hỗ trợ DANGVINHPC</Text>
                <Text style={styles.headerSubtitle}>Trợ lý tự động</Text>
              </View>
            </View>
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
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageGroup,
                  message.role === 'customer' && styles.customerMessageGroup,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'customer' ? styles.customerBubble : styles.assistantBubble,
                  ]}
                >
                  <Text style={[styles.messageText, message.role === 'customer' && styles.customerText]}>
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

            {messages.length === 1 && (
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
              placeholder="Nhập câu hỏi..."
              placeholderTextColor="#94a3b8"
              returnKeyType="send"
              style={styles.input}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gửi câu hỏi"
              disabled={!draft.trim()}
              onPress={() => sendMessage()}
              style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
            >
              <Ionicons name="send" size={17} color="#ffffff" />
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
        {!isOpen && <View style={styles.onlineDot} />}
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
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  headerSubtitle: {
    marginTop: 3,
    color: '#cbd5e1',
    fontSize: 11,
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
