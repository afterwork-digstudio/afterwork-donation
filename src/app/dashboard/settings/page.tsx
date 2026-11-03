"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  Settings,
  Coins,
  Bell,
  Save,
  CheckCircle2,
  Volume2,
  Send,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Form settings
  const [conversionRate, setConversionRate] = useState(1); // 1 IDR = 1 Cash
  const [minDonation, setMinDonation] = useState(5000);
  const [discordWebhook, setDiscordWebhook] = useState(
    "https://discord.com/api/webhooks/129810291029/ab_cde_token"
  );
  const [enableDiscord, setEnableDiscord] = useState(true);
  const [soundEffect, setSoundEffect] = useState("CHIME_BELL");
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    setToastMessage("Pengaturan sistem berhasil disimpan!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestDiscord = async () => {
    setIsTestingDiscord(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsTestingDiscord(false);
    setToastMessage("Pesan tes berhasil dikirim ke webhook Discord!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <WebhookSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSimulate={() => {}}
      />

      <DashboardSidebar
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={setCurrentWorkspace}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Settings className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Pengaturan Sistem Donasi
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Sesuaikan kurs konversi In-Game Cash, batas minimal donasi, dan integrasi notifikasi Discord.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Kurs Konversi */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Coins className="size-4 text-indigo-500" />
                Kurs &amp; Nilai Tukar In-Game Cash
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">
                    Multiplier Cash per 1 Rupiah
                  </label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      required
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                    />
                    <span className="font-medium text-muted-foreground whitespace-nowrap text-xs">
                      = {conversionRate * 1000} Cash / Rp 1.000
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Misal nilai 1: Donasi Rp 10.000 menghasilkan 10.000 Cash in-game.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">
                    Batas Minimal Donasi untuk Pop-up Alert
                  </label>
                  <input
                    type="number"
                    step={1000}
                    min={1000}
                    required
                    value={minDonation}
                    onChange={(e) => setMinDonation(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Donasi di bawah nilai ini tetap dikreditkan tapi tidak memunculkan alert layar.
                  </p>
                </div>
              </div>
            </div>

            {/* Discord Webhook Integration */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Bell className="size-4 text-indigo-500" />
                Integrasi Webhook Notifikasi Discord
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block cursor-pointer">
                      Kirim Notifikasi ke Discord
                    </label>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      Setiap donasi masuk dari Saweria/SociaBuzz/BagiBagi akan diteruskan ke channel Discord.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enableDiscord}
                    onClick={() => setEnableDiscord(!enableDiscord)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      enableDiscord ? "bg-indigo-600" : "bg-slate-200 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        enableDiscord ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {enableDiscord && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="font-semibold block text-foreground">Discord Webhook URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        required
                        value={discordWebhook}
                        onChange={(e) => setDiscordWebhook(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        disabled={isTestingDiscord}
                        onClick={handleTestDiscord}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 shadow-xs"
                      >
                        {isTestingDiscord ? (
                          <RefreshCw className="size-3.5 animate-spin" />
                        ) : (
                          <Send className="size-3.5 text-indigo-500" />
                        )}
                        <span>Kirim Pesan Tes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Settings */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Volume2 className="size-4 text-indigo-500" />
                Default Sound Effect In-Game
              </h3>

              <div className="text-xs space-y-1.5">
                <label className="font-semibold block text-foreground">Pilihan Efek Suara Saat Donasi Tiba</label>
                <select
                  value={soundEffect}
                  onChange={(e) => setSoundEffect(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground cursor-pointer shadow-xs focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="CHIME_BELL">Chime Bell (Soft Clean)</option>
                  <option value="VICTORY_FANFARE">Victory Fanfare (Epic Horns)</option>
                  <option value="RETRO_COIN">Retro Coin Up (Arcade Mario Style)</option>
                  <option value="KASIR_CASH">Cash Register Kaching</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>Simpan Semua Pengaturan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
