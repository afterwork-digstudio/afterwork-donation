"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  CircleDollarSign,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { initialDonations, DonationItem } from "@/lib/data";
import { WebhookLog } from "@/components/WebhookDeliveryTable";

export default function DonationsPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [donations, setDonations] = useState<DonationItem[]>(initialDonations);
  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredDonations = donations.filter((d) => {
    const matchSearch =
      d.donator.toLowerCase().includes(search.toLowerCase()) ||
      d.robloxUsername.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchProvider =
      filterProvider === "ALL" || d.provider === filterProvider;
    const matchStatus = filterStatus === "ALL" || d.status === filterStatus;
    return matchSearch && matchProvider && matchStatus;
  });

  const totalAmount = filteredDonations.reduce((acc, d) => acc + d.amount, 0);

  const handleExportCSV = () => {
    const headers = "ID,Provider,Donator,RobloxUser,Amount,Cash,Status,Timestamp\n";
    const rows = filteredDonations
      .map(
        (d) =>
          `"${d.id}","${d.provider}","${d.donator}","${d.robloxUsername}",${d.amount},${d.cashReward},"${d.status}","${d.timestamp}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `donations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage("Data donasi berhasil diexport ke CSV!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualClaim = (id: string) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "CLAIMED" } : d))
    );
    setToastMessage(`Transaksi ${id} berhasil dikreditkan secara manual!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case "SAWERIA":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40";
      case "SOCIABUZZ":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40";
      case "BAGIBAGI":
        return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300";
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
        onSimulate={(newLog: WebhookLog) => {
          const newItem: DonationItem = {
            id: newLog.id,
            provider: newLog.provider,
            donator: newLog.donator,
            robloxUsername: newLog.robloxUsername,
            robloxUserId: "882910291",
            amount: newLog.amount,
            cashReward: newLog.cashReward,
            message: newLog.message,
            status: "CLAIMED",
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            universeId: currentWorkspace,
          };
          setDonations([newItem, ...donations]);
          setToastMessage(`Donasi dari ${newLog.donator} berhasil ditambahkan!`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
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
                  <CircleDollarSign className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Riwayat Donasi Masuk
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Daftar semua transaksi donasi yang masuk melalui Saweria, SociaBuzz, dan BagiBagi.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <Download className="size-3.5 text-muted-foreground" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <Sparkles className="size-3.5" />
                <span>Simulasi Donasi</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Donasi Terfilter
              </span>
              <div className="text-2xl font-bold text-foreground">
                Rp {totalAmount.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Dari {filteredDonations.length} transaksi yang tampil
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tersinkron ke In-Game
              </span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {filteredDonations.filter((d) => d.status === "CLAIMED").length} Transaksi
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Langsung masuk ke saldo player
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Menunggu Klaim Player
              </span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {filteredDonations.filter((d) => d.status === "PENDING").length} Transaksi
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Dikreditkan saat player join game
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama donatur, username Roblox, atau ID transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Filter Provider */}
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs cursor-pointer"
                >
                  <option value="ALL">Semua Provider</option>
                  <option value="SAWERIA">Saweria</option>
                  <option value="SOCIABUZZ">SociaBuzz</option>
                  <option value="BAGIBAGI">BagiBagi</option>
                </select>

                {/* Filter Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="CLAIMED">Claimed (Sukses)</option>
                  <option value="PENDING">Pending (Menunggu)</option>
                  <option value="FAILED">Failed (Gagal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">ID Transaksi</th>
                    <th className="px-4 py-3.5">Provider</th>
                    <th className="px-4 py-3.5">Donatur</th>
                    <th className="px-4 py-3.5">Roblox User</th>
                    <th className="px-4 py-3.5">Nominal</th>
                    <th className="px-4 py-3.5">In-Game Cash</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Waktu</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-muted-foreground">
                        Tidak ada transaksi donasi yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-muted-foreground">
                          {d.id}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getProviderBadge(
                              d.provider
                            )}`}
                          >
                            {d.provider}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div>{d.donator}</div>
                          {d.message && (
                            <div className="text-[11px] text-muted-foreground italic truncate max-w-xs mt-0.5">
                              &quot;{d.message}&quot;
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                          @{d.robloxUsername}
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          Rp {d.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          +{d.cashReward.toLocaleString("id-ID")} Cash
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              d.status === "CLAIMED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                                : d.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40"
                            }`}
                          >
                            {d.status === "CLAIMED" ? (
                              <>
                                <CheckCircle2 className="size-3 text-emerald-600" />
                                Claimed
                              </>
                            ) : d.status === "PENDING" ? (
                              <>
                                <Clock className="size-3 text-amber-600" />
                                Pending
                              </>
                            ) : (
                              <>
                                <XCircle className="size-3 text-rose-600" />
                                Failed
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                          {d.timestamp}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {d.status === "PENDING" ? (
                            <button
                              type="button"
                              onClick={() => handleManualClaim(d.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
                              title="Kreditkan secara manual ke DataStore sekarang"
                            >
                              <RefreshCw className="size-3 text-indigo-500" />
                              <span>Kreditkan</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium">
                              Selesai
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
