
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabaseClient';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FloatingActions: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하세요! TEAM 1502 AI 컨설턴트입니다. \n업무 자동화, 마케팅, 앱 개발 등 무엇이든 물어보세요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // System prompt to define the persona
      const systemInstruction = `
        당신은 프리미엄 AI 에이전시 'TEAM 1502'의 전문 AI 컨설턴트입니다.
        
        [TEAM 1502 서비스 소개]
        1. AI 업무 자동화: 반복 업무를 대체하는 맞춤형 AI 에이전트 개발.
        2. 퍼포먼스 마케팅: 데이터 기반 타겟팅 및 ROAS 최적화.
        3. 지능형 챗봇: 24/7 고객 응대 및 사내 지식 관리 시스템.
        4. 웹/앱 개발: 최신 트렌드를 반영한 반응형 웹사이트 및 앱 구축.
        5. 데이터 분석: 비즈니스 의사결정을 위한 데이터 시각화.
        6. 브랜드 전략: 시장 분석을 통한 독보적 아이덴티티 수립.

        [지침]
        - 고객에게 정중하고 전문적인 톤으로 응대하세요.
        - 답변은 한국어로 제공하며, 너무 길지 않게 핵심을 전달하세요.
        - 구체적인 견적이나 프로젝트 문의는 하단의 '문의하기' 폼을 이용하도록 안내하세요.
        - 연락처(010-2455-1502)를 물어보면 안내해주세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const reply = response.text || "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "시스템 연결에 문제가 생겼습니다. 전화로 문의 부탁드립니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to summarize chat and save to Supabase
  const summarizeAndSaveChat = async () => {
    // Only summarize if there has been a meaningful conversation (more than just the greeting)
    if (messages.length <= 2) return;

    try {
      const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
      
      const summaryResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `다음 대화 내용을 [고객 니즈], [문의 유형], [감정 상태] 3가지 항목으로 요약 정리해줘:\n\n${historyText}` }] }
        ]
      });

      const summary = summaryResponse.text;

      if (summary) {
        await supabase.from('chat_logs').insert({
          summary: summary,
          raw_log: historyText,
          created_at: new Date().toISOString()
        });
        console.log("Chat log saved successfully.");
      }
    } catch (error) {
      console.error("Failed to summarize chat:", error);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    // Trigger summary in background when closing
    summarizeAndSaveChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shared button styles
  const buttonBaseClass = "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300";
  const whiteButtonClass = `${buttonBaseClass} bg-white text-neutral-700 border border-neutral-100 hover:bg-blue-600 hover:text-white hover:border-blue-600`;
  const darkButtonClass = `${buttonBaseClass} ${isChatOpen ? 'bg-neutral-800 rotate-90' : 'bg-[#1a1a1a] hover:bg-blue-600'} text-white relative`;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-4 font-sans">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] max-w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200 mb-2 origin-bottom-right"
          >
            {/* Chat Header */}
            <div className="bg-[#1a1a1a] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Icon icon="solar:stars-minimalistic-linear" width={16} className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display tracking-wide">TEAM 1502 AI</h3>
                  <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCloseChat}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl
                      ${msg.role === 'user' 
                        ? 'bg-[#1a1a1a] text-white rounded-tr-sm' 
                        : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-sm shadow-sm'
                      }
                    `}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>{line}<br/></span>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-neutral-200 shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-neutral-100">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                  className="w-full pl-4 pr-12 py-3 bg-neutral-50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] resize-none text-neutral-800"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a] text-white rounded-lg flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="solar:plain-3-linear" width={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons Group */}
      <div className="flex flex-col gap-4 items-end">
        
        {/* Phone Button */}
        <motion.a
          href="tel:010-2455-1502"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group flex items-center gap-3 pr-1"
        >
          <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none hidden md:block">
            <span className="text-xs font-bold text-neutral-600">전화 상담</span>
          </div>
          <motion.div 
            className={whiteButtonClass}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon icon="solar:phone-calling-linear" width={24} />
          </motion.div>
        </motion.a>

        {/* Inquiry Button */}
        <motion.button
          onClick={scrollToContact}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group flex items-center gap-3 pr-1"
        >
          <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none hidden md:block">
            <span className="text-xs font-bold text-neutral-600">프로젝트 문의</span>
          </div>
          <motion.div 
            className={whiteButtonClass}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon icon="solar:letter-linear" width={24} />
          </motion.div>
        </motion.button>

        {/* Chat Toggle Button */}
        <div className="group flex items-center gap-3 pr-1">
          <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none hidden md:block">
            <span className="text-xs font-bold text-neutral-600">Ai 챗봇</span>
          </div>
          <motion.button
            onClick={() => {
              if (isChatOpen) handleCloseChat();
              else setIsChatOpen(true);
            }}
            className={darkButtonClass}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isChatOpen ? (
              <Icon icon="solar:close-circle-linear" width={24} className="text-white" />
            ) : (
              <>
                 <span className="absolute inset-0 rounded-full bg-white/20 animate-ping duration-[2s]"></span>
                 <Icon icon="solar:chat-round-line-linear" width={24} className="text-white relative z-10" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FloatingActions;
