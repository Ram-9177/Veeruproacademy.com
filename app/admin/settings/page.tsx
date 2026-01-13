'use client'

import { useEffect, useMemo, useState } from 'react'
import { Settings, Save, Bell, Shield, Database, Mail, Globe, Palette, Check } from 'lucide-react'
import { AttractiveBackground } from '../../components/AttractiveBackground'

type Tab = 'General' | 'Notifications' | 'Security' | 'Email' | 'Database' | 'Appearance'

const navItems: Array<{ icon: any; label: Tab }> = [
  { icon: Globe, label: 'General' },
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Security' },
  { icon: Mail, label: 'Email' },
  { icon: Database, label: 'Database' },
  { icon: Palette, label: 'Appearance' }
]

export const dynamic = 'force-dynamic'
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('General')
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [form, setForm] = useState({
    siteName: "Veeru's Pro Academy",
    siteUrl: 'https://veerupro.academy',
    siteDescription: 'Learn web development with hands-on projects and expert guidance.',
    adminEmail: 'admin@veerupro.academy',
    supportEmail: 'support@veerupro.academy',
    merchantName: "Veeru's Pro Academy",
    merchantUpi: '',
    paymentFormUrl: ''
  })

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/admin/settings')
        if (!resp.ok) return
        const data = await resp.json()
        const s = data.settings || {}
        setForm((prev) => ({
          ...prev,
          siteName: (s.site_name as string) || prev.siteName,
          siteUrl: (s.site_url as string) || prev.siteUrl,
          siteDescription: (s.site_description as string) || prev.siteDescription,
          adminEmail: (s.admin_email as string) || prev.adminEmail,
          supportEmail: (s.support_email as string) || prev.supportEmail,
          merchantName: (s.merchant_name as string) || prev.merchantName,
          merchantUpi: (s.merchant_upi as string) || prev.merchantUpi,
          paymentFormUrl: (s.payment_form_url as string) || prev.paymentFormUrl
        }))
      } catch (e) {
        console.warn('Failed to load settings', e)
      }
    }
    load()
  }, [])

  const save = async () => {
    setIsSaving(true)
    setStatus(null)
    try {
      const resp = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          general: form,
          payments: {
            merchantName: form.merchantName,
            merchantUpi: form.merchantUpi,
            paymentFormUrl: form.paymentFormUrl
          }
        })
      })
      if (!resp.ok) throw new Error('Save failed')
      setStatus('Saved successfully')
    } catch (e: any) {
      setStatus(e?.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const activeContent = useMemo(() => {
    if (activeTab === 'General') {
      return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
          <p className="text-white/60 mb-4">Update site branding and contact information.</p>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm((p) => ({ ...p, siteName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={form.siteUrl}
                  onChange={(e) => setForm((p) => ({ ...p, siteUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Site Description
              </label>
              <textarea
                rows={3}
                value={form.siteDescription}
                onChange={(e) => setForm((p) => ({ ...p, siteDescription: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => setForm((p) => ({ ...p, adminEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Payments</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    value={form.merchantName}
                    onChange={(e) => setForm((p) => ({ ...p, merchantName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Merchant UPI
                  </label>
                  <input
                    type="text"
                    value={form.merchantUpi}
                    onChange={(e) => setForm((p) => ({ ...p, merchantUpi: e.target.value }))}
                    placeholder="merchant@upi"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Payment Evidence Form URL
                </label>
                <input
                  type="url"
                  value={form.paymentFormUrl}
                  onChange={(e) => setForm((p) => ({ ...p, paymentFormUrl: e.target.value }))}
                  placeholder="https://forms.gle/..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
        <h3 className="text-2xl font-bold text-white mb-2">{activeTab} Settings</h3>
        <p className="text-white/70">This section is available, but specific controls are not configured yet.</p>
      </div>
    )
  }, [activeTab, form])

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
                <Settings className="w-4 h-4" />
                Platform Settings
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Configure your platform settings, notifications, and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const active = activeTab === item.label
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        active
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {activeContent}

            <div className="flex justify-end items-center gap-3">
              {status && (
                <span className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {status}
                </span>
              )}
              <button
                onClick={save}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
