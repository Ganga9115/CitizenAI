import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import './ChatWidget.css';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  LogIn,
  Loader2
} from 'lucide-react';

import {
  useAuth
} from '../../contexts/AuthContext';

import {
  sendChatMessage,
  ChatMessage
} from '../../services/chat.service';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_REPLIES_GUEST = [
  'How do I register a complaint?',
  'How can I track a complaint?',
  'What does complaint status mean?',
  'What can CitizenAssist do?'
];

const QUICK_REPLIES_CITIZEN = [
  'Show my complaints',
  'Track my latest complaint',
  'What is the status of my complaints?',
  'How do I register a new complaint?'
];

export const ChatWidget: React.FC = () => {

  const {
    user,
    loading
  } = useAuth();

  const [open, setOpen] =
    useState(false);

  const [input, setInput] =
    useState('');

  const [sending, setSending] =
    useState(false);

  const [messages, setMessages] =
    useState<DisplayMessage[]>([]);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  // ========================================================
  // ONLY CITIZENS + GUESTS
  // ========================================================

  if (
    !loading &&
    user &&
    user.role !== 'CITIZEN'
  ) {
    return null;
  }

  // ========================================================
  // INITIAL MESSAGE
  // ========================================================

  useEffect(() => {

    if (messages.length > 0) {
      return;
    }

    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: user
          ? `Hello ${user.fullName.split(' ')[0]}! 👋 I'm CitizenAssist. I can help you check your complaints, track their status, and understand the grievance process.`
          : `Hello! 👋 I'm CitizenAssist. I can help you understand the complaint process, platform features, and general civic-service questions. Log in if you want to track your own complaints.`
      }
    ]);

  }, [user, messages.length]);

  // ========================================================
  // AUTO SCROLL
  // ========================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [messages]);

  // ========================================================
  // SEND
  // ========================================================

  const sendMessage = async (
    text?: string
  ) => {

    const message =
      (text ?? input).trim();

    if (
      !message ||
      sending
    ) {
      return;
    }

    const userMessage:
      DisplayMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message
      };

    const history:
      ChatMessage[] =
      messages
        .slice(-10)
        .map(item => ({
          role: item.role,
          content: item.content
        }));

    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    setInput('');
    setSending(true);

    try {

      const response =
        await sendChatMessage(
          message,
          history
        );

      const assistantMessage:
        DisplayMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          response.reply
      };

      setMessages(prev => [
        ...prev,
        assistantMessage
      ]);

    } catch (error: any) {

      console.error(
        '[CitizenAssist]',
        error
      );

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            error.response?.data?.message ||
            'I am unable to connect right now. Please make sure the CitizenAssist backend is running and try again.'
        }
      ]);

    } finally {

      setSending(false);
    }
  };

  // ========================================================
  // ENTER KEY
  // ========================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };

  const quickReplies =
    user
      ? QUICK_REPLIES_CITIZEN
      : QUICK_REPLIES_GUEST;

  // ========================================================
  // UI
  // ========================================================

  return (
    <>
      {/* ==================================================
          CHAT WINDOW
      ================================================== */}

      {open && (
        <div className="citizen-assist-window">

          {/* HEADER */}

          <div className="citizen-assist-header">

            <div className="citizen-assist-brand">

              <div className="citizen-assist-avatar">
                <Bot size={21} />
              </div>

              <div>
                <div className="citizen-assist-title">
                  CitizenAssist
                </div>

                <div className="citizen-assist-status">
                  <span className="citizen-assist-online-dot" />
                  AI Citizen Support
                </div>
              </div>

            </div>

            <button
              className="citizen-assist-close"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close CitizenAssist"
            >
              <X size={20} />
            </button>

          </div>

          {/* MESSAGES */}

          <div className="citizen-assist-messages">

            {messages.map(message => (

              <div
                key={message.id}
                className={
                  message.role === 'user'
                    ? 'citizen-assist-row citizen-assist-row-user'
                    : 'citizen-assist-row'
                }
              >

                {message.role === 'assistant' && (
                  <div className="citizen-assist-mini-avatar">
                    <Sparkles size={14} />
                  </div>
                )}

                <div
                  className={
                    message.role === 'user'
                      ? 'citizen-assist-bubble citizen-assist-user-bubble'
                      : 'citizen-assist-bubble citizen-assist-ai-bubble'
                  }
                >
                  {message.content}
                </div>

              </div>
            ))}

            {sending && (
              <div className="citizen-assist-row">

                <div className="citizen-assist-mini-avatar">
                  <Sparkles size={14} />
                </div>

                <div className="citizen-assist-bubble citizen-assist-ai-bubble citizen-assist-thinking">
                  <Loader2
                    size={15}
                    className="citizen-assist-spinner"
                  />

                  <span>
                    Thinking...
                  </span>
                </div>

              </div>
            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* QUICK REPLIES */}

          {!sending && (
            <div className="citizen-assist-quick-replies">

              {quickReplies.map(reply => (

                <button
                  key={reply}
                  onClick={() =>
                    sendMessage(reply)
                  }
                >
                  {reply}
                </button>

              ))}

            </div>
          )}

          {/* LOGIN HINT */}

          {!user && (
            <div className="citizen-assist-login-hint">

              <LogIn size={14} />

              <span>
                Log in to track your personal complaints.
              </span>

            </div>
          )}

          {/* INPUT */}

          <div className="citizen-assist-input-area">

            <input
              value={input}
              onChange={event =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask CitizenAssist..."
              disabled={sending}
            />

            <button
              className="citizen-assist-send"
              onClick={() =>
                sendMessage()
              }
              disabled={
                sending ||
                !input.trim()
              }
              aria-label="Send message"
            >
              {sending
                ? (
                  <Loader2
                    size={18}
                    className="citizen-assist-spinner"
                  />
                )
                : (
                  <Send size={18} />
                )
              }
            </button>

          </div>

          <div className="citizen-assist-footer">
            CitizenAssist • AI-powered civic support
          </div>

        </div>
      )}

      {/* ==================================================
          FLOATING ICON
      ================================================== */}

      <button
        className={
          open
            ? 'citizen-assist-fab citizen-assist-fab-open'
            : 'citizen-assist-fab'
        }
        onClick={() =>
          setOpen(value => !value)
        }
        aria-label={
          open
            ? 'Close CitizenAssist'
            : 'Open CitizenAssist'
        }
      >

        {open ? (
          <X size={25} />
        ) : (
          <MessageCircle size={26} />
        )}

        {!open && (
          <span className="citizen-assist-fab-pulse" />
        )}

      </button>
    </>
  );
};