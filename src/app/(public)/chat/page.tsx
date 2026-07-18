'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiClient } from '@/lib/api-client';
import { Card, Input, Button, Spinner, Avatar } from '@heroui/react';
import { Thunderbolt } from '@gravity-ui/icons';
import Link from 'next/link';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const SUGGESTED_PROMPTS = [
  'Analyze my facility emission trends',
  'Suggest 3 carbon reduction steps',
  'Which facility has the highest carbon emissions?',
  'What is my total energy consumption?'
];

export default function ChatPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [inputValue, setInputValue] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize or retrieve Chat Session ID
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      let storedSession = sessionStorage.getItem('greenpulse_chat_session');
      if (!storedSession) {
        storedSession = `session_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('greenpulse_chat_session', storedSession);
      }
      setSessionId(storedSession);
    }
  }, []);

  // ─── useChat integration with Custom Transport ───────────────────────────
  const transport = React.useMemo(() => {
    if (!sessionId) return undefined;
    return new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
      body: {
        sessionId,
      },
      credentials: 'include',
    });
  }, [sessionId]);

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error
  } = useChat({
    transport,
  });

  const isLoading = status === 'submitted';

  // Fetch past conversation messages from database on load
  useEffect(() => {
    if (session?.user && sessionId) {
      const loadHistory = async () => {
        try {
          interface DbMessage {
            sender: 'user' | 'assistant';
            content: string;
          }
          const res = await apiClient.get<{ status: string; data?: { messages: DbMessage[] } }>(
            `/ai/chat/history?sessionId=${sessionId}`
          ).catch(() => null);

          if (res?.data?.messages && res.data.messages.length > 0) {
            const mappedMessages: UIMessage[] = res.data.messages.map((m, idx) => ({
              id: `history_${idx}`,
              role: m.sender === 'user' ? 'user' : 'assistant',
              parts: [{ type: 'text', text: m.content }]
            }));
            setMessages(mappedMessages);
          } else {
            // First time welcome message
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                parts: [{
                  type: 'text',
                  text: `Hello ${session.user.name ?? 'Sustainability Manager'}! I am your Net-Zero AI Sustainability Assistant. Ask me anything about your corporate energy audits, facility footprints, or decarbonization actions.`
                }]
              }
            ]);
          }
        } catch {
          // Silent fallback
        }
      };
      loadHistory();
    }
  }, [session, sessionId, setMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInputValue('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  if (!mounted || isSessionLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-neutral-50/50 dark:bg-neutral-950">
        <Spinner size="lg" className="text-emerald-600" aria-label="Loading spinner" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Loading AI interface...</span>
      </div>
    );
  }

  // Logged-out layout: CTA banner
  if (!session?.user) {
    return (
      <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-16 transition-colors duration-300">
        <div className="mx-auto max-w-xl px-4 text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-md animate-pulse">
            <Thunderbolt className="h-8 w-8" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Activate Net-Zero AI Copilot
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Sign in to enable your conversational assistant. Ask questions about your facility audits, analyze carbon anomalies, and compile net-zero compliance strategies in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-md" aria-label="Sign In redirection button">
                Sign In to Chat
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full sm:w-auto border border-neutral-300 dark:border-neutral-800 bg-white hover:bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200" aria-label="Register redirection button">
                Register Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-6 transition-colors duration-300 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 w-full flex-1 flex flex-col gap-6">
        
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
            <Thunderbolt className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Net-Zero Sustainability Assistant</h1>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">Gemini 2.5 Flash Co-Pilot</p>
          </div>
        </div>

        {/* Suggested Prompts Grid */}
        {messages.length <= 1 && (
          <div className="space-y-3 animate-fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Suggested Inquiries:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  aria-label={`Ask AI about: ${prompt}`}
                  className="p-3.5 text-left rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message History Area */}
        <div className="flex-1 overflow-y-auto min-h-[40vh] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm flex flex-col gap-4">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0" aria-label={`${msg.role} avatar`}>
                {msg.role === 'user' ? (
                  <Avatar.Fallback className="bg-emerald-600 text-white font-bold text-xs">
                    {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                  </Avatar.Fallback>
                ) : (
                  <Avatar.Fallback className="bg-neutral-900 text-emerald-400 font-bold text-xs">
                    AI
                  </Avatar.Fallback>
                )}
              </Avatar>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Loop and render parts of the message */}
                {msg.parts.map((part, pIdx) => {
                  if (part.type === 'text') {
                    return (
                      <div key={pIdx} className="whitespace-pre-line prose dark:prose-invert max-w-none">
                        {part.text}
                      </div>
                    );
                  }

                  if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
                    const toolPart = part as any;
                    const toolName = toolPart.toolName || part.type.replace('tool-', '');
                    const state = toolPart.state;

                    return (
                      <div key={pIdx} className="mt-3 p-3 bg-neutral-50 dark:bg-black/30 rounded-xl border border-neutral-200/50 dark:border-neutral-800 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          <span>🔧 Agent Tool: {toolName}</span>
                          {(state === 'input-streaming' || state === 'input-available' || state === 'call') && (
                            <span className="text-amber-500 font-semibold italic">calculating...</span>
                          )}
                          {(state === 'output-available' || state === 'result') && (
                            <span className="text-emerald-500 font-semibold">executed</span>
                          )}
                        </div>

                        {(state === 'output-available' || state === 'result') && toolPart.output && (
                          <pre className="text-[10px] text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap max-w-full font-mono bg-white dark:bg-neutral-950 p-2 rounded-lg border border-neutral-200 dark:border-neutral-850">
                            {JSON.stringify(toolPart.output, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 self-start max-w-[85%]">
              <Avatar className="h-8 w-8 shrink-0" aria-label="AI typing avatar">
                <Avatar.Fallback className="bg-neutral-900 text-emerald-400 font-bold text-xs">
                  AI
                </Avatar.Fallback>
              </Avatar>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs rounded-tl-none shadow-sm flex items-center gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce [animation-delay:0.2s]">●</span>
                <span className="animate-bounce [animation-delay:0.4s]">●</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex gap-2 pb-4"
        >
          <Input
            id="chat-input-field"
            placeholder="Type your net-zero inquiry..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-white"
            aria-label="Sustainability query input field"
          />
          <Button
            type="submit"
            isDisabled={isLoading || !inputValue.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-semibold px-6 rounded-lg transition-colors cursor-pointer"
            aria-label="Send message button"
          >
            Send
          </Button>
        </form>

      </div>
    </div>
  );
}
