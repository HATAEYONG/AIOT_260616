import { Brain, Database, FileText, Search, Play, Tag } from 'lucide-react'
import Link from 'next/link'

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <Brain size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm">Market Memory</span>
            </Link>
            <span className="text-[#E5E7EB]">/</span>
            <span className="text-sm text-[#64748B]">지식베이스</span>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">RAG 지식베이스</h1>
        <p className="text-sm text-[#64748B] mb-8">슈카월드 영상 트랜스크립트 기반 지식베이스 현황</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '전체 영상', value: '0', icon: Play },
            { label: '전체 청크', value: '0', icon: Database },
            { label: '트랜스크립트', value: '0', icon: FileText },
            { label: '임베딩 완료', value: '0', icon: Tag },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-2 text-[#64748B] mb-2">
                <s.icon size={14} />
                <span className="text-xs">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input placeholder="영상 제목, 키워드, 기업명으로 검색..." className="w-full border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-300" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Database size={24} className="text-slate-400" />
          </div>
          <h3 className="font-semibold mb-2">아직 수집된 영상이 없습니다</h3>
          <p className="text-sm text-[#64748B] mb-4">수집 에이전트를 실행하거나 영상을 수동으로 등록해주세요.</p>
          <Link href="/collector" className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
            수집 에이전트로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}
