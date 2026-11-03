"use strict";
"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  Boxes,
  Plus,
  Copy,
  Check,
  Gamepad2,
  CheckCircle2,
  X,
  KeyRound,
  Trash2,
} from "lucide-react";
import { initialUniverses, Universe } from "@/lib/data";

export default function WorkspacesPage() {
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [universes, setUniverses] = useState<Universe[]>(initialUniverses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Universe | null>(null);

  // Load from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem("aw_universes");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setUniverses(parsed);
          setCurrentWorkspace((prev) =>
            parsed.some((u: Universe) => u.id === prev)
              ? prev
              : (parsed[0]?.id || "")
          );
        }
      } catch {}
    }
  }, []);

  // New workspace form
  const [newName, setNewName] = useState("");
  const [newUniverseId, setNewUniverseId] = useState("");
  const [newPlaceId, setNewPlaceId] = useState("");

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    setToastMessage("API Token Roblox berhasil disalin!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUniverse = (e: React.FormEvent) => {
    e.preventDefault();
    const newUni: Universe = {
      id: newUniverseId,
      name: newName,
      placeId: newPlaceId,
      status: "ACTIVE",
      totalRevenue: 0,
      totalDonations: 0,
      lastActive: "Baru saja dibuat",
    };
    const updated = [...universes, newUni];
    setUniverses(updated);
    localStorage.setItem("aw_universes", JSON.stringify(updated));
    setCurrentWorkspace(newUni.id);

    setShowAddModal(false);
    setNewName("");
    setNewUniverseId("");
    setNewPlaceId("");
    setToastMessage(`Universe "${newName}" berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDeleteUniverse = () => {
    if (!deleteCandidate) return;
    const updated = universes.filter((u) => u.id !== deleteCandidate.id);
    setUniverses(updated);
    localStorage.setItem("aw_universes", JSON.stringify(updated));
    if (currentWorkspace === deleteCandidate.id) {
      if (updated.length > 0) {
        setCurrentWorkspace(updated[0].id);
      } else {
        setCurrentWorkspace("");
      }
    }
    setToastMessage(`Universe "${deleteCandidate.name}" berhasil dihapus.`);
    setDeleteCandidate(null);
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
                  <Boxes className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Workspaces &amp; Roblox Universes
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Daftarkan dan kelola game Roblox (Universe &amp; Place ID) yang terhubung ke Donation Cash System.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
            >
              <Plus className="size-3.5" />
              <span>Tambah Universe Baru</span>
            </button>
          </div>

          {/* Cards Grid */}
          {universes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center space-y-4">
              <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Gamepad2 className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Belum ada Roblox Universe terdaftar</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Semua workspace bawaan telah dihapus. Klik tombol di bawah untuk mendaftarkan Experience Roblox Anda sendiri.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Plus className="size-3.5" />
                <span>Tambah Universe Baru Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universes.map((uni) => (
                <div key={uni.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Gamepad2 className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {uni.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 border ${
                            uni.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          {uni.status}
                        </span>
                      </div>
                    </div>

                    {/* Delete Workspace Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(uni)}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-xs"
                      title="Hapus Universe ini"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs rounded-xl border border-border/70 bg-slate-50/50 dark:bg-zinc-900/40 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Universe ID:</span>
                      <span className="font-mono font-semibold text-foreground">{uni.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Place ID:</span>
                      <span className="font-mono font-semibold text-foreground">{uni.placeId}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <span className="text-muted-foreground font-medium">Total Revenue:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {uni.totalRevenue.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                        <KeyRound className="size-3 text-indigo-500" /> Script API Key:
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={`rblx_sec_${uni.id}_vault99`}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-muted-foreground"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(uni.id, `rblx_sec_${uni.id}_vault99`)
                        }
                        className="inline-flex items-center justify-center size-8 rounded-lg border border-border bg-card text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 shadow-xs"
                        title="Salin Key"
                      >
                        {copiedKey === uni.id ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                    <Trash2 className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Hapus Workspace?</h4>
                    <p className="text-xs text-muted-foreground">Universe: <b>{deleteCandidate.name}</b></p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menghapus workspace <b>{deleteCandidate.name}</b> (ID: {deleteCandidate.id})? Tindakan ini akan menghilangkannya dari daftar aktif.
                </p>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(null)}
                    className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteUniverse}
                    className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm"
                  >
                    Hapus Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Universe Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-5 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Gamepad2 className="size-4" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">
                      Tambah Roblox Universe Baru
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <form onSubmit={handleAddUniverse} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold block text-foreground">Nama Experience / Game</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. My Anime Roleplay V2"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-foreground">Universe ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10798129102"
                      value={newUniverseId}
                      onChange={(e) => setNewUniverseId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Temukan di Roblox Creator Hub &gt; Dashboard &gt; Experience ID.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold block text-foreground">Start Place ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1892019281"
                      value={newPlaceId}
                      onChange={(e) => setNewPlaceId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
                    >
                      Simpan Universe
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
