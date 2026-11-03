"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  Server,
  Radio,
  Gamepad2,
  Wifi,
  AlertCircle,
} from "lucide-react";

export default function DiagnosticsPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState("Baru saja");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunDiagnostics = async () => {
    setIsChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsChecking(false);
    setLastCheckTime(new Date().toLocaleTimeString("id-ID"));
    setToastMessage("Semua endpoint sistem terverifikasi normal!");
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Activity className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  System Diagnostics &amp; Health
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Pemeriksaan koneksi API Roblox, status server webhook, dan latensi antrean pesan.
              </p>
            </div>

            <button
              type="button"
              disabled={isChecking}
              onClick={handleRunDiagnostics}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isChecking ? "animate-spin" : ""}`} />
              <span>{isChecking ? "Memeriksa..." : "Jalankan Tes Diagnostik"}</span>
            </button>
          </div>

          {/* Health Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-foreground">
                  Status Sistem Keseluruhan: SEHAT &amp; OPERASIONAL
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Pemeriksaan terakhir: {lastCheckTime}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div className="rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-4 space-y-1.5 hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Roblox Open Cloud API
                  </span>
                  <Gamepad2 className="size-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>200 OK</span>
                </div>
                <p className="text-xs text-muted-foreground">Latensi: 82ms • Universe 10765129159</p>
              </div>

              <div className="rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-4 space-y-1.5 hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Webhook Ingress Uptime
                  </span>
                  <Radio className="size-4 text-indigo-500" />
                </div>
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>99.98%</span>
                </div>
                <p className="text-xs text-muted-foreground">0 paket drop dalam 24 jam terakhir</p>
              </div>

              <div className="rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-4 space-y-1.5 hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Kuota Rate Limit API
                  </span>
                  <Wifi className="size-4 text-sky-500" />
                </div>
                <div className="text-lg font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>49,200 / 50,000</span>
                </div>
                <p className="text-xs text-muted-foreground">Reset kuota dalam 7 menit</p>
              </div>
            </div>
          </div>

          {/* Providers Status Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Server className="size-4 text-indigo-500" />
                Status Koneksi Provider Masuk
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Provider</th>
                    <th className="px-4 py-3.5">Status Verifikasi</th>
                    <th className="px-4 py-3.5">Protokol</th>
                    <th className="px-4 py-3.5">Rata-rata Respon</th>
                    <th className="px-4 py-3.5">Uptime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-foreground">Saweria</td>
                    <td className="px-4 py-3.5 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Normal (Signature Valid)
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">HMAC-SHA256</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">42 ms</td>
                    <td className="px-4 py-3.5 font-bold text-foreground">100.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-foreground">SociaBuzz</td>
                    <td className="px-4 py-3.5 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Normal (Token OK)
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">Bearer Secret</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">51 ms</td>
                    <td className="px-4 py-3.5 font-bold text-foreground">99.9%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-foreground">BagiBagi</td>
                    <td className="px-4 py-3.5 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="size-3.5" /> Menunggu Aktivasi Kredensial
                    </td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">API Secret</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">--</td>
                    <td className="px-4 py-3.5 font-bold text-muted-foreground">--</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
