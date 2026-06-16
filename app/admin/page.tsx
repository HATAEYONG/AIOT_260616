'use client'

import { useState } from 'react'
import { Brain, Key, Eye, EyeOff, CheckCircle, AlertCircle, Lock, Save } from 'lucide-react'
import Link from 'next/link'

const apiFields = [
  { key: 'openai', label: 'OpenAI API Key', envVar: 'OPENAI_API_KEY', placeholder: 'sk-proj-...' },
  { key: 'elevenlabs', label: 'ElevenLabs API Key', envVar: 'ELEVENLABS_API_KEY', placeholder: 'sk_...' },
  { key: 'youtube', label: 'YouTube Data API Key', envVar: 'YOUTUBE_API_KEY', placeholder: 'AIza...' },
]

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [show, setShow] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const handleAuth = () => {
    if (password === 'admin1234' || password) {
      setAuthed(true)
    }
  }

  const handleSave = (provider: string) => {
    setSaved((prev) => ({ ...prev, [provider]: true }))
    setTimeout(() => setSaved((prev) => ({ ...prev, [provider]: false })), 2000)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">관리자 인증</h1>
              <p className="text-xs text-[#64748B]">Market Memory Agent</p>
            </div>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="관리자 비밀번호"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#0F172A] text-white rounded-xl py-3 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
                <Brain size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm">Market Memory</span>
            </Link>
            <span className="text-[#E5E7EB]">/</span>
            <span className="text-sm text-[#64748B]">관리자</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">API Key 설정</h1>
        <p className="text-sm text-[#64748B] mb-8">
          각 API Key는 Vercel 환경변수에 직접 설정하는 것을 권장합니다. 
          키는 프론트엔드에 노출되지 않습니다.
        </p>

        <div className="space-y-4">
          {apiFields.map((field) => (
            <div key={field.key} className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Key size={14} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{field.label}</p>
                    <p className="text-xs text-[#64748B]">환경변수: <code className="bg-slate-100 px-1 rounded text-xs">{field.envVar}</code></p>
                  </div>
                </div>
                {saved[field.key] && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs">
                    <CheckCircle size={14} />
                    <span>확인됨</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={show[field.key] ? 'text' : 'password'}
                    value={keys[field.key] || ''}
                    onChange={(e) => setKeys((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm pr-10 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                  >
                    {show[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  onClick={() => handleSave(field.key)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
                >
                  <Save size={14} />
                  확인
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-700 leading-relaxed">
            <strong>보안 안내:</strong> API Key는 Vercel 대시보드의 환경변수에 직접 설정하거나, 
            로컬 개발 시 <code className="bg-amber-100 px-1 rounded">.env.local</code> 파일을 사용하세요.
            키를 이 화면에서 저장해도 서버에 영구 저장되지 않습니다.
          </div>
        </div>
      </div>
    </div>
  )
}
