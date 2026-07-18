'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { askSupportAgent } from '@/lib/api-client';
import { Card, Input, Button, Spinner, Avatar } from '@heroui/react';
import { HelpCircle, Send, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'How do I lower Scope 2 indirect energy emissions?',
  'Give me a checklist for a corporate office carbon audit',
  'What is the difference between Scope 1, 2, and 3 emissions?',
  'How are facility carbon scores calculated?'
];

export default function SupportPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize welcome message
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I am your GreenPulse AI Decarbonization & Support Assistant. Ask me anything about mitigating carbon intensity, analyzing Scope 1/2/3 footprints, or optimizing ESG energy compliance logs."
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsPending(true);
    setErrorMsg(null);

    try {
      // Map local role type to backend expectations
      const backendPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await askSupportAgent(backendPayload);
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.text || 'I encountered an empty response. Please retry.' },
      ]);
    } catch (err: any) {
      console.error('[Support Chat Error]:', err);
      setErrorMsg(err.message || 'Support Agent is temporarily offline. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  if (!mounted || isSessionLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-neutral-50/50 dark:bg-neutral-950">
        <Spinner size="lg" className="text-emerald-600" aria-label="Loading spinner" />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Loading Support Portal...</span>
      </div>
    );
  }

  // Protected: redirect / login guard
  if (!session?.user) {
    return (
      <div className="flex-1 w-full bg-neutral-50/50 dark:bg-neutral-950 py-16 transition-colors duration-300">
        <div className="mx-auto max-w-xl px-4 text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-md animate-pulse">
            <HelpCircle className="h-8 w-8" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              GreenPulse AI Support Chat
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Access to our Expert Decarbonization Consultant requires an active account. Please sign in to ask compliance questions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-md">
                Sign In to Chat
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full sm:w-auto border border-neutral-300 dark:border-neutral-800 bg-white hover:bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200">
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
        
        {/* Support Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Support Chat & FAQ Copilot</h1>
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide">AI Decarbonization Consultant</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
            Active Online
          </span>
        </div>

        {/* Suggested Prompts Grid */}
        {messages.length <= 1 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Suggested Decarbonization Inquiries:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  aria-label={`Ask support: ${prompt}`}
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
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
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
                className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isPending && (
            <div className="flex gap-3 self-start max-w-[85%]">
              <Avatar className="h-8 w-8 shrink-0" aria-label="AI typing avatar">
                <Avatar.Fallback className="bg-neutral-900 text-emerald-400 font-bold text-xs">
                  AI
                </Avatar.Fallback>
              </Avatar>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs rounded-tl-none shadow-sm flex items-center gap-1 font-semibold italic">
                <Spinner size="sm" className="text-emerald-500 shrink-0" />
                <span>Loading...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs self-center">
              {errorMsg}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex gap-2 pb-4"
        >
          <input
            id="support-chat-input"
            type="text"
            placeholder="Ask AI Support Copilot..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isPending}
            className="flex-1 bg-neutral-900 text-white placeholder-zinc-400 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            aria-label="Support query input field"
          />
          <Button
            type="submit"
            isDisabled={isPending || !inputValue.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-semibold px-6 rounded-lg transition-colors cursor-pointer"
            aria-label="Send message button"
          >
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </form>

      </div>
    </div>
  );
}
