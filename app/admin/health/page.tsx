'use client'

import { useState, useCallback } from 'react'
import { Brain, RefreshCw, CheckCircle, XCircle, AlertCircle, Wifi, Clock, Zap, Database, Mic, Video, Key } from 'lucide-react'
import Link from 'next/link'

interface ServiceStatus { ok: boolean; latency: number; detail: string }
interface HealthData {
  status: 'ok' | 'degraded'
  timestamp: string
  services: {
    openai: ServiceStatus
    elevenlabs: ServiceStatus
    youtube: ServiceStatus
    database: ServiceStatus
  }
}

const SERVICE_META = {
  openai:     { label: 'OpenAI API',           icon: Zap,      desc: 'GPT 오케스트레이션 에이전트 · 임베딩 생성', envVar: 'OPENAI_API_KEY',      color: '#10A37F' },
  elevenlabs: { label: 'ElevenLabs API',        icon: Mic,      desc: 'STT 음성 입력 · TTS 음성 응답',            envVar: 'ELEVENLABS_API_KEY',  color: '#F97316' },
  youtube:    { label: 'YouTube Data API',      icon: Video,    desc: '슈카월드 채널 영상 수집 · 메타데이터',      envVar: 'YOUTUBE_API_KEY',     color: '#EF4444' },
  database:   { label: 'PostgreSQL (pgvector)', icon: Database, desc: 'RAG 벡터 DB · 영상 트랜스크립트 저장',     envVar: 'DATABASE_URL',        color: '#2563EB' },
} as const

type ServiceKey = keyof typeof SERVICE_META

export default function HealthPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkedAt, setCheckedAt] = useState<string | null>(null)

  const runCheck = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/health')
      const json = await res.json()
      setData(json)
      setCheckedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const overallOk = data?.status === 'ok'
  const services = data ? (Object.entries(data.services) as [ServiceKey, ServiceStatus][]) : []
  const okCount = services.filter(([, s]) => s.ok).length

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <Brain size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm">Market Memory</span>
            </Link>
            <span className="text-[#E5E7EB] mx-1">/</span>
            <Link href="/admin" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">관리자</Link>
            <span className="text-[#E5E7EB] mx-1">/</span>
            <span className="text-sm font-medium text-[#0F172A]">서비스 상태</span>
          </div>
          <button
            onClick={runCheck}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-full text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? '점검 중...' : '상태 점검'}
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">API 서비스 상태</h1>
          <p className="text-sm text-[#64748B]">
            Market Memory Agent를 구성하는 외부 API 서비스의 연결 상태를 실시간으로 확인합니다.
          </p>
        </div>

        {/* Overall Banner */}
        {data && (
          <div className={`flex items-center gap-4 rounded-2xl px-6 py-4 mb-8 border ${overallOk ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${overallOk ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              {overallOk
                ? <CheckCircle size={22} className="text-emerald-600" />
                : <AlertCircle size={22} className="text-amber-600" />}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${overallOk ? 'text-emerald-800' : 'text-amber-800'}`}>
                {overallOk ? '전체 서비스 정상' : `일부 서비스 점검 필요 (${okCount}/4 정상)`}
              </p>
              <p className={`text-xs mt-0.5 ${overallOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                마지막 점검: {checkedAt}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {services.map(([k, s]) => (
                <div
                  key={k}
                  className={`w-2.5 h-2.5 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-red-400'}`}
                  title={SERVICE_META[k].label}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E7EB] py-24 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <Wifi size={28} className="text-slate-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">아직 점검하지 않았습니다</h3>
            <p className="text-sm text-[#64748B] mb-7">버튼을 눌러 각 서비스 연결을 확인하세요.</p>
            <button
              onClick={runCheck}
              className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
            >
              <RefreshCw size={16} />
              지금 점검하기
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-6 bg-slate-100 rounded w-1/4 mt-3" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Cards */}
        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {services.map(([key, status]) => {
              const meta = SERVICE_META[key]
              const Icon = meta.icon
              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border p-6 transition-all ${
                    status.ok
                      ? 'border-[#E5E7EB] hover:border-emerald-200 hover:shadow-sm'
                      : 'border-red-100 bg-red-50/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: meta.color + '18' }}
                    >
                      <Icon size={22} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{meta.label}</h3>
                        {status.ok
                          ? <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                          : <XCircle size={15} className="text-red-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-[#64748B] mb-3 leading-relaxed">{meta.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          status.ok
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {status.ok ? '정상' : '오류'}
                        </span>
                        <span className="text-xs text-[#64748B] truncate ml-3 max-w-[180px]">
                          {status.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Key size={11} className="text-[#94A3B8]" />
                      <code className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {meta.envVar}
                      </code>
                    </div>
                    {status.ok && (
                      <div className="flex items-center gap-1 text-xs text-[#64748B]">
                        <Clock size={11} />
                        <span>{status.latency}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Fix Guide */}
        {data && services.some(([, s]) => !s.ok) && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-amber-500" />
              미설정 서비스 환경변수 안내
            </h2>
            <div className="space-y-2">
              {services.filter(([, s]) => !s.ok).map(([key]) => {
                const meta = SERVICE_META[key]
                return (
                  <div key={key} className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <XCircle size={14} className="text-red-400" />
                      <span className="text-sm font-medium">{meta.label}</span>
                    </div>
                    <code className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-mono">
                      {meta.envVar}
                    </code>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-[#64748B] mt-4 leading-relaxed">
              Vercel 대시보드 → 프로젝트 Settings → Environment Variables에서 등록하거나,{' '}
              로컬 개발 시 <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">.env.local</code> 파일에 추가하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
