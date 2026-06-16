'use client'

import { ChatWidget } from '@/components/agent/chat-widget'
import { Brain, TrendingUp, Database, Clock, Play, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: '수집 영상', value: '0', unit: '개', icon: Play },
  { label: '지식 청크', value: '0', unit: '개', icon: Database },
  { label: '마지막 업데이트', value: '-', unit: '', icon: Clock },
  { label: '질문 처리', value: '0', unit: '건', icon: TrendingUp },
]

const topics = [
  '반도체', '2차전지', '금리·환율', '미국 주식', '한국 증시',
  '부동산', '원자재', '빅테크', '중국 경제', 'ETF',
]

const examples = [
  { q: '최근 반도체 업황에 대해 슈카월드에서 어떤 관점이 있었나요?', tag: '산업분석' },
  { q: '금리 인하가 한국 주식시장에 미칠 영향을 정리해줘.', tag: '매크로' },
  { q: '2차전지 관련해서 과거 영상에서 어떤 리스크를 말했어?', tag: '리스크' },
  { q: '삼성전자 투자 판단 전에 봐야 할 매크로 이슈 정리해줘.', tag: '기업분석' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Market Memory</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/knowledge" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">지식베이스</Link>
            <Link href="/collector" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">수집 에이전트</Link>
            <Link href="/admin" className="text-sm px-4 py-1.5 rounded-full border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">관리자</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-blue-700">슈카월드 RAG 기반 경제 에이전트</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-5">
            슈카월드의 경제 해설을<br />
            <span className="text-[#2563EB]">장기 기억</span>으로 축적합니다
          </h1>
          <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
            복잡한 경제 영상을 다시 찾아볼 필요 없이, 질문 한 번으로
            과거 영상의 핵심 맥락과 근거를 확인하세요.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Brain size={18} />
              Agent 호출하기
              <ArrowRight size={16} />
            </button>
            <Link href="/knowledge" className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
              지식베이스 보기 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#64748B] mb-1">
                  <s.icon size={14} />
                  <span className="text-xs font-medium">{s.label}</span>
                </div>
                <p className="text-3xl font-bold text-[#0F172A]">
                  {s.value}<span className="text-base font-normal text-[#64748B] ml-1">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">핵심 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Database, title: 'RAG 지식베이스', desc: '슈카월드 영상 전체를 텍스트로 변환하여 구조화된 지식베이스로 구축합니다.', color: 'blue' },
            { icon: Zap, title: '오케스트레이션 에이전트', desc: 'OpenAI 기반 AI가 질문 의도를 분석하고 RAG 검색 결과를 근거로 답변합니다.', color: 'violet' },
            { icon: BarChart3, title: '출처 기반 답변', desc: '모든 답변에 출처 영상, 업로드 날짜, 시간대를 포함하여 신뢰성을 확보합니다.', color: 'emerald' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#E5E7EB] p-6 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 rounded-xl bg-${f.color}-100 flex items-center justify-center mb-4`}>
                <f.icon size={20} className={`text-${f.color}-600`} />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">주요 주제</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full border border-[#E5E7EB] text-sm text-[#64748B] bg-[#F8FAFC] hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">예시 질문</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((e, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium shrink-0 mt-0.5">{e.tag}</span>
              <p className="text-sm text-[#0F172A] group-hover:text-blue-700 transition-colors leading-relaxed">{e.q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center gap-3">
          <Shield size={16} className="text-[#64748B]" />
          <p className="text-xs text-[#64748B]">
            본 서비스는 <strong>투자 자문 서비스가 아닙니다.</strong> 슈카월드 영상 기반 정보 분석 보조 서비스이며, 매수·매도·보유 추천을 하지 않습니다. 투자 판단은 본인 책임입니다.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
