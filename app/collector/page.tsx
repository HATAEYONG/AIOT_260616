"use client"

import { useState } from "react"
import { Brain, RefreshCw, Calendar, Play, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CollectorPage() {
  const [running, setRunning] = useState(false)

  const handleRun = () => {
    setRunning(true)
    setTimeout(() => setRunning(false), 3000)
  }

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
            <span className="text-sm text-[#64748B]">수집 에이전트</span>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">정보수집 에이전트</h1>
            <p className="text-sm text-[#64748B]">슈카월드 유튜브 영상 자동 수집 및 RAG 갱신</p>
          </div>
          <button onClick={handleRun} disabled={running} className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {running ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            {running ? "수집 중..." : "수동 실행"}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "마지막 수집", value: "-" },
            { label: "다음 예약", value: "매주 일요일 03:00" },
            { label: "신규 영상 감지", value: "0개" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <p className="text-xs text-[#64748B] mb-2">{s.label}</p>
              <p className="font-semibold text-sm">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6">
          <h2 className="font-semibold mb-4">수집 파이프라인</h2>
          <div className="space-y-3">
            {["채널 영상 목록 조회","기존 DB와 비교 (중복 제거)","신규 영상 트랜스크립트 수집","텍스트 정제 및 청크 분할","임베딩 생성 (text-embedding-3-small)","Vector DB 저장","수집 리포트 생성"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-[#64748B] font-medium shrink-0">{i + 1}</div>
                <p className="text-sm text-[#64748B]">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">YouTube API Key와 OpenAI API Key가 설정되어야 수집이 가능합니다. <Link href="/admin" className="underline">관리자 설정</Link>에서 등록해주세요.</p>
        </div>
      </div>
    </div>
  )
}
