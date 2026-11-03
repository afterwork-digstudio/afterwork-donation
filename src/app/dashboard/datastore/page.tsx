"use strict";
"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  Database,
  Search,
  Coins,
  CheckCircle2,
  Edit,
  Download,
  Plus,
  Minus,
  X,
  User,
} from "lucide-react";
import { initialPlayers, PlayerDataStore } from "@/lib/data";

export default function DataStorePage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [players, setPlayers] = useState<PlayerDataStore[]>(initialPlayers);
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDataStore | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(10000);
  const [adjustType, setAdjustType] = useState<"ADD" | "SUBTRACT">("ADD");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPlayers = players.filter(
    (p) =>
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.userId.includes(search)
  );

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    const diff = adjustType === "ADD" ? adjustAmount : -adjustAmount;
    setPlayers((prev) =>
      prev.map((p) =>
        p.userId === selectedPlayer.userId
          ? { ...p, cashBalance: Math.max(0, p.cashBalance + diff) }
          : p
      )
    );

    setToastMessage(
      `Saldo ${selectedPlayer.username} berhasil ${
        adjustType === "ADD" ? "ditambahkan" : "dikurangi"
      } ${adjustAmount.toLocaleString("id-ID")} Cash!`
    );
    setSelectedPlayer(null);
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
                  <Database className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  DataStore Explorer &amp; Player Balances
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Pemeriksaan dan penyesuaian saldo in-game Cash player Roblox secara langsung ke DataStore.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setToastMessage("Snapshot backup DataStore berhasil diunduh!");
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Download Backup DataStore</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari berdasarkan Roblox Username atau UserId..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Player Roblox</th>
                    <th className="px-4 py-3.5">User ID</th>
                    <th className="px-4 py-3.5">Saldo Cash Saat Ini</th>
                    <th className="px-4 py-3.5">Akumulasi Donasi</th>
                    <th className="px-4 py-3.5">Rank / Tier</th>
                    <th className="px-4 py-3.5">Terakhir Online</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-muted-foreground">
                        Player tidak ditemukan di DataStore.
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map((player) => (
                      <tr key={player.userId} className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                            <User className="size-4" />
                          </div>
                          <span>{player.username}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {player.userId}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {player.cashBalance.toLocaleString("id-ID")} Cash
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          Rp {player.totalDonated.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 px-2.5 py-0.5 text-[10px] font-semibold">
                            {player.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-[11px] font-mono">
                          {player.lastSeen}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedPlayer(player)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
                          >
                            <Edit className="size-3 text-indigo-500" />
                            <span>Edit Saldo</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Saldo Modal */}
          {selectedPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="size-4 text-indigo-500" />
                    <h4 className="text-sm font-bold text-foreground">
                      Edit Saldo DataStore
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlayer(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form onSubmit={handleAdjustBalance} className="space-y-4 text-xs">
                  <div className="rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40 p-3.5 space-y-0.5">
                    <span className="text-muted-foreground font-medium text-[11px]">Target Player:</span>
                    <p className="font-bold text-foreground text-sm">
                      {selectedPlayer.username} ({selectedPlayer.userId})
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Saldo saat ini: {selectedPlayer.cashBalance.toLocaleString("id-ID")} Cash
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-[11px] uppercase tracking-wider text-muted-foreground">
                      Tipe Penyesuaian
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdjustType("ADD")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                          adjustType === "ADD"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Plus className="size-3.5" /> Tambah Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjustType("SUBTRACT")}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                          adjustType === "SUBTRACT"
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Minus className="size-3.5" /> Kurangi Cash
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-foreground">Jumlah Cash</label>
                    <input
                      type="number"
                      min={100}
                      step={500}
                      required
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setSelectedPlayer(null)}
                      className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
                    >
                      Simpan ke DataStore
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
