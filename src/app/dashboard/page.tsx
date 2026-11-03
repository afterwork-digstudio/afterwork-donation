"use strict";
"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import Link from "next/link";
import {
  TrendingUp,
  Coins,
  Radio,
  Gamepad2,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { initialDonations, initialUniverses, DonationItem } from "@/lib/data";
import { WebhookLog } from "@/components/WebhookDeliveryTable";

export default function OverviewPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [donations, setDonations] = useState<DonationItem[]>(initialDonations);
  const [universes, setUniverses] = useState(initialUniverses);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aw_universes");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setUniverses(parsed);
        }
      } catch {}
    }
  }, []);

  const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalCash = donations.reduce((sum, d) => sum + d.cashReward, 0);

  const handleSimulate = (log: WebhookLog) => {
    const newItem: DonationItem = {
      id: log.id,
      provider: log.provider,
      donator: log.donator,
      robloxUsername: log.robloxUsername,
      robloxUserId: "991029192",
      amount: log.amount,
      cashReward: log.cashReward,
      message: log.message,
      status: "CLAIMED",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      universeId: currentWorkspace,
    };
    setDonations([newItem, ...donations]);
    setToastMessage(`Donasi Rp ${log.amount.toLocaleString("id-ID")} berhasil masuk!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getProviderPill = (provider: string) => {
    switch (provider) {
      case "SAWERIA":
        return "bg-amber-500 text-white";
      case "SOCIABUZZ":
        return "bg-emerald-500 text-white";
      case "BAGIBAGI":
        return "bg-violet-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
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
        onSimulate={handleSimulate}
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
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  AW
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  AW Studio Overview
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Ringkasan performa revenue donasi dan sinkronisasi Roblox Cash secara real-time.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <Sparkles className="size-3.5 text-indigo-500" />
                <span>Simulasi Donasi</span>
              </button>
              <Link
                href="/dashboard/providers"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <Radio className="size-3.5" />
                <span>Konfigurasi Provider</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Pendapatan
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowUpRight className="size-3" /> +18.4% dari minggu lalu
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cash In-Game Diberikan
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Coins className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {totalCash.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Tersinkron otomatis ke DataStore
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Donasi
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <CircleDollarSign className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {donations.length} Transaksi
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                100% tingkat sukses webhook
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Roblox Universe Aktif
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                  <Gamepad2 className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                2 Universe
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                HTTP Service Polling Online
              </p>
            </div>
          </div>

          {/* Grid Layout: Universe Leaderboard & Recent Donations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Universe Leaderboard */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Gamepad2 className="size-4 text-indigo-500" />
                    Top Universe Revenue
                  </h3>
                  <Link
                    href="/dashboard/workspaces"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Kelola</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>

                <div className="space-y-2">
                  {universes.length === 0 ? (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      Belum ada universe terdaftar. Kelola di halaman Workspaces.
                    </div>
                  ) : (
                    universes.map((uni, index) => (
                      <div
                        key={uni.id}
                        className="flex items-center justify-between rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-3 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/80 font-bold text-xs text-indigo-700 dark:text-indigo-300">
                            #{index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-foreground">
                              {uni.name}
                            </p>
                            <p className="truncate text-[10px] text-muted-foreground font-mono">
                              Universe {uni.id}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block">
                            Revenue
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            Rp {uni.totalRevenue.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Security & Health Banner */}
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-900 dark:text-indigo-300">
                  <ShieldCheck className="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Sistem Siap Digunakan</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Webhook token diamankan dengan hash signature. Kredensial Saweria, SociaBuzz, dan BagiBagi tersimpan di vault terenkripsi.
                </p>
                <Link
                  href="/dashboard/diagnostics"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 w-full transition-colors shadow-xs mt-1"
                >
                  Lihat Diagnostik Sistem
                </Link>
              </div>
            </div>

            {/* Recent Donations Feed */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-indigo-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Donasi Terkini Masuk
                    </h3>
                  </div>
                  <Link
                    href="/dashboard/donations"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-border">
                  {donations.slice(0, 5).map((d) => (
                    <div
                      key={d.id}
                      className="p-4 hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg font-bold text-[10px] ${getProviderPill(
                            d.provider
                          )}`}
                        >
                          {d.provider.slice(0, 2)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground truncate">
                              {d.donator}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono truncate">
                              (@{d.robloxUsername})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate italic mt-0.5">
                            &quot;{d.message}&quot;
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-foreground">
                          Rp {d.amount.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                          <CheckCircle2 className="size-3" />
                          <span>+{d.cashReward.toLocaleString("id-ID")} Cash</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
