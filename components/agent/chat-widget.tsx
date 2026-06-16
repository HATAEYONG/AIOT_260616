'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { MessageCircle, X, Send, Mic, Volume2, Loader2, Bot, User, AlertCircle } from 'lucide-react'

interface Source {
  title: string
  url: string
  date?: string
  time?: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const exampleQuestions = [
    '최근 반도체 업황에 대해 어떤 관점이 있었나요?',
    '금리 인하가 한국 주식시장에 미칠 영향은?',
    '2차전지 관련 과거 영상에서 어떤 리스크를 언급했나요?',
    '삼성전자 투자 전 봐야 할 매크로 이슈는?',
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-3 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 ${open ? 'hidden' : 'flex'}`}
      >
        <Bot size={20} />
        <span className="font-medium text-sm">Agent 호출</span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[420px] h-[600px] rounded-2xl bg-white shadow-2xl shadow-black/15 border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">Market Memory Agent</p>
                <p className="text-xs text-slate-400">슈카월드 RAG 기반 경제 분석</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border-b border-amber-100">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">투자 자문이 아닌 정보 분석 보조 서비스입니다. 투자 판단은 본인 책임입니다.</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-[#64748B] text-center font-medium">예시 질문</p>
                {exampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleInputChange({ target: { value: q } } as React.ChangeEvent<HTMLInputElement>)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-white border border-[#E5E7EB] text-[#0F172A] hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#2563EB] text-white rounded-tr-sm'
                      : 'bg-white border border-[#E5E7EB] text-[#0F172A] rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-blue-600" />
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                오류가 발생했습니다. API Key 설정을 확인해주세요.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white border-t border-[#E5E7EB]">
            <button type="button" className="p-2 text-[#64748B] hover:text-blue-500 transition-colors">
              <Mic size={18} />
            </button>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="경제·주식 이슈를 질문하세요..."
              className="flex-1 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-full px-4 py-2 text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#2563EB] text-white rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
