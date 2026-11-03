"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  FlaskConical,
  Send,
  Volume2,
  Tv,
  Coins,
  CheckCircle2,
  Gamepad2,
  RefreshCw,
} from "lucide-react";

export default function FakeDonationPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Form states
  const [provider, setProvider] = useState<"SAWERIA" | "SOCIABUZZ" | "BAGIBAGI">("SAWERIA");
  const [donator, setDonator] = useState("SultanRobloxian_VIP");
  const [robloxUsername, setRobloxUsername] = useState("RyanDev_Roblox");
  const [amount, setAmount] = useState(50000);
  const [message, setMessage] = useState("Mantap bang gamenya seru banget! Nih buat beli pet baru.");
  const [soundEffect, setSoundEffect] = useState("CHIME_BELL");
  const [alertStyle, setAlertStyle] = useState("GOLDEN_BANNER");
  const [isFiring, setIsFiring] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFireTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFiring(true);
    setPreviewActive(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsFiring(false);
    setToastMessage(`Fake Donation Rp ${amount.toLocaleString("id-ID")} berhasil ditembakkan ke game!`);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    setTimeout(() => {
      setPreviewActive(false);
    }, 6000);
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FlaskConical className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Fake Donation Simulator
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Alat pengujian khusus developer untuk memicu notifikasi alert dan audio in-game Roblox tanpa biaya nyata.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                  Pengaturan Parameter Donasi Tiruan
                </h3>

                <form onSubmit={handleFireTest} className="space-y-4 text-xs">
                  {/* Provider Select */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground uppercase tracking-wider block text-[11px]">
                      Provider Tiruan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["SAWERIA", "SOCIABUZZ", "BAGIBAGI"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setProvider(p)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                            provider === p
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs"
                              : "border-border bg-background text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donator & Target */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground block">Nama Donatur</label>
                      <input
                        type="text"
                        required
                        value={donator}
                        onChange={(e) => setDonator(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground block">Roblox Username Penerima</label>
                      <input
                        type="text"
                        required
                        value={robloxUsername}
                        onChange={(e) => setRobloxUsername(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Nominal */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-foreground">Nominal Donasi (IDR)</label>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Coins className="size-3.5" />
                        Reward: +{amount.toLocaleString("id-ID")} Cash
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[10000, 25000, 50000, 100000].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(v)}
                          className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            amount === v
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                              : "border-border bg-background text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          Rp {(v / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground block">Pesan Donasi</label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs resize-none"
                    />
                  </div>

                  {/* Sound Effect & Alert Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground block flex items-center gap-1.5">
                        <Volume2 className="size-3.5 text-indigo-500" /> Sound Effect
                      </label>
                      <select
                        value={soundEffect}
                        onChange={(e) => setSoundEffect(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground cursor-pointer shadow-xs focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="CHIME_BELL">Chime Bell (Soft)</option>
                        <option value="VICTORY_FANFARE">Victory Fanfare (Epic)</option>
                        <option value="RETRO_COIN">Retro Coin Up (Arcade)</option>
                        <option value="KASIR_CASH">Cash Register (Kaching!)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground block flex items-center gap-1.5">
                        <Tv className="size-3.5 text-indigo-500" /> Tipe Banner Pop-up
                      </label>
                      <select
                        value={alertStyle}
                        onChange={(e) => setAlertStyle(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground cursor-pointer shadow-xs focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="GOLDEN_BANNER">Golden Banner (Top Screen)</option>
                        <option value="VIP_TAKEOVER">VIP Center Screen Alert</option>
                        <option value="CHAT_BROADCAST">Chat Box Announcement Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isFiring}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 w-full py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-sm mt-2 disabled:opacity-50"
                  >
                    {isFiring ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Memicu Event Roblox...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        <span>Tembak Donasi Tiruan ke Game Sekarang</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* In-Game Preview Mockup Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Gamepad2 className="size-4 text-emerald-600" />
                    Preview Tampilan di Layar Roblox
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    1920x1080 Viewport
                  </span>
                </div>

                {/* Simulated Game Screen */}
                <div className="relative aspect-video w-full rounded-xl border border-slate-700 bg-zinc-950 overflow-hidden shadow-inner flex flex-col justify-between p-3.5">
                  {/* Top Bar of Roblox Game */}
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-mono">
                    <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Roblox Studio Test Mode</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 text-emerald-400 font-semibold backdrop-blur-sm">
                      <Coins className="size-3" />
                      <span>Cash: 250,000</span>
                    </div>
                  </div>

                  {/* In-game Donation Pop-up Alert */}
                  {previewActive ? (
                    <div className="mx-auto w-11/12 max-w-sm rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-600/95 to-orange-600/95 p-3.5 text-white shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-2 border-b border-white/30 pb-2">
                        <span className="size-2 rounded-full bg-yellow-300 animate-ping"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-200">
                          DONASI MASUK ({provider})!
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-bold text-yellow-100 truncate">
                            {donator}
                          </span>
                          <span className="text-xs font-bold text-amber-200">
                            Rp {amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/90 italic truncate">
                          &quot;{message}&quot;
                        </p>
                        <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center justify-between text-[10px] text-yellow-300 font-semibold">
                          <span>Kredit kepada @{robloxUsername}</span>
                          <span className="text-emerald-300 font-bold">
                            +{amount.toLocaleString("id-ID")} Cash
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/40 text-xs font-medium">
                      Tekan tombol &quot;Tembak Donasi Tiruan&quot; di sebelah kiri untuk melihat animasi alert in-game di sini.
                    </div>
                  )}

                  {/* Chatbox preview bottom left */}
                  <div className="bg-black/75 rounded-lg p-2 max-w-[220px] border border-white/10 text-[10px] text-white space-y-0.5 font-mono backdrop-blur-sm">
                    <p className="text-amber-300 font-medium">[SYSTEM]: Server online.</p>
                    {previewActive && (
                      <p className="text-yellow-200 font-semibold animate-pulse">
                        [DONASI]: {donator} mendonasikan Rp {amount.toLocaleString("id-ID")}!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
