"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  UserRound,
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function ProfilePage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // States
  const [apiKey, setApiKey] = useState("aw_live_8921a9fb201bce47");
  const [copiedKey, setCopiedKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    setToastMessage("Master API Key berhasil disalin!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegenerateKey = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newKey = "aw_live_" + Math.random().toString(36).substring(2, 18);
    setApiKey(newKey);
    setIsGenerating(false);
    setToastMessage("Master API Key baru berhasil dibuat!");
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
                  <UserRound className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Profil Akun &amp; Developer Access
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Kelola informasi akun studio, kredensial autentikasi, dan Master API Token.
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
              Informasi Pengguna
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 font-bold text-white text-lg shadow-sm">
                RD
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-base font-bold text-foreground">Ryan Dev</h4>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
                    Owner / Studio Lead
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  ryan@awstudio.local
                </p>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <KeyRound className="size-4 text-indigo-500" />
                Master AW Studio API Token
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" /> Full Access
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Gunakan token ini untuk menghubungkan bot eksternal, backend integrasi, atau Roblox Studio Plugin resmi.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 font-mono text-xs text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shrink-0 shadow-xs"
              >
                {copiedKey ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Salin Token</span>
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleRegenerateKey}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shrink-0 shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`size-3.5 text-indigo-500 ${isGenerating ? "animate-spin" : ""}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Security Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Lock className="size-4 text-indigo-500" />
              Ganti Password
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setToastMessage("Password berhasil diperbarui!");
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="space-y-4 text-xs max-w-md"
            >
              <div className="space-y-1.5">
                <label className="font-semibold block text-foreground">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold block text-foreground">Password Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
              >
                Simpan Password Baru
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
