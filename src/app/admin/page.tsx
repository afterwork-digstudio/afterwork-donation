"use strict";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Server,
  Users,
  AlertTriangle,
  Flame,
  Ban,
  RefreshCw,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Clock,
  Lock,
  Unlock,
  Sliders,
  Download,
  Terminal,
  Trash2,
  Edit,
  Cpu,
  HardDrive,
  Radio,
  Gamepad2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MODERATOR";
  status: "ACTIVE" | "SUSPENDED";
  lastLogin: string;
  avatar: string;
}

interface BlacklistedUser {
  id: string;
  robloxUsername: string;
  userId: string;
  reason: string;
  addedBy: string;
  addedAt: string;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  status: "SUCCESS" | "WARNING" | "DANGER";
}

const initialStaff: StaffMember[] = [
  {
    id: "staff_1",
    name: "Ryan Dev",
    email: "ryan@awstudio.local",
    role: "OWNER",
    status: "ACTIVE",
    lastLogin: "Baru saja",
    avatar: "RD",
  },
  {
    id: "staff_2",
    name: "Alex Pratama",
    email: "alex@awstudio.local",
    role: "ADMIN",
    status: "ACTIVE",
    lastLogin: "2 jam yang lalu",
    avatar: "AP",
  },
  {
    id: "staff_3",
    name: "Sarah GameOps",
    email: "sarah@awstudio.local",
    role: "MODERATOR",
    status: "ACTIVE",
    lastLogin: "Kemarin",
    avatar: "SG",
  },
];

const initialBlacklist: BlacklistedUser[] = [
  {
    id: "bl_1",
    robloxUsername: "ExploiterRoblox_99",
    userId: "882910291",
    reason: "Penyalahgunaan replay webhook palsu",
    addedBy: "Ryan Dev",
    addedAt: "2026-11-01 14:22",
  },
  {
    id: "bl_2",
    robloxUsername: "ChargebackBot_X",
    userId: "772102910",
    reason: "Melakukan chargeback di Saweria berulang kali",
    addedBy: "Alex Pratama",
    addedAt: "2026-11-02 09:15",
  },
];

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "aud_901",
    actor: "Ryan Dev",
    action: "Ubah Global Cash Multiplier",
    target: "1.0x -> 2.0x (Double Cash Event)",
    ip: "127.0.0.1",
    timestamp: "20:30:12",
    status: "SUCCESS",
  },
  {
    id: "aud_900",
    actor: "Alex Pratama",
    action: "Tambah Blacklist User",
    target: "@ChargebackBot_X (772102910)",
    ip: "192.168.1.45",
    timestamp: "09:15:20",
    status: "WARNING",
  },
  {
    id: "aud_899",
    actor: "System Engine",
    action: "Rotasi Webhook Slug",
    target: "Saweria Endpoint ep_sw_9f81a7d6",
    ip: "localhost",
    timestamp: "04:00:00",
    status: "SUCCESS",
  },
  {
    id: "aud_898",
    actor: "Ryan Dev",
    action: "Regenerasi Master API Token",
    target: "aw_live_8921a9fb201bce47",
    ip: "127.0.0.1",
    timestamp: "Kemarin 19:40",
    status: "DANGER",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "STAFF" | "CONTROLS" | "BLACKLIST" | "AUDIT"
  >("OVERVIEW");

  // Emergency Controls States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceReason, setMaintenanceReason] = useState(
    "Server donasi sedang dalam pemeliharaan terjadwal. Cash akan dikreditkan otomatis setelah maintenance selesai."
  );
  const [cashMultiplier, setCashMultiplier] = useState(1.0);
  const [multiplierEventName, setMultiplierEventName] = useState("Weekend Double Cash Event");
  const [isMultiplierActive, setIsMultiplierActive] = useState(false);

  // Blacklist state
  const [blacklist, setBlacklist] = useState<BlacklistedUser[]>(initialBlacklist);
  const [newBlUsername, setNewBlUsername] = useState("");
  const [newBlUserId, setNewBlUserId] = useState("");
  const [newBlReason, setNewBlReason] = useState("");
  const [showAddBlModal, setShowAddBlModal] = useState(false);

  // Staff state
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"ADMIN" | "MODERATOR">("MODERATOR");

  // Edit & Delete Staff Candidate
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteStaffCandidate, setDeleteStaffCandidate] = useState<StaffMember | null>(null);

  // Clawback State
  const [clawbackTxId, setClawbackTxId] = useState("");
  const [clawbackReason, setClawbackReason] = useState("");
  const [isClawbacking, setIsClawbacking] = useState(false);

  // Replay Webhook State
  const [replayPayload, setReplayPayload] = useState(
    JSON.stringify(
      {
        provider: "SAWERIA",
        donator: "TestSultan",
        roblox_target: "RyanDev_Roblox",
        amount: 25000,
      },
      null,
      2
    )
  );
  const [isReplaying, setIsReplaying] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load staff and blacklist from localStorage
  useEffect(() => {
    const savedStaff = localStorage.getItem("aw_staff_list");
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffList(parsed);
        }
      } catch {}
    }

    const savedBl = localStorage.getItem("aw_blacklist");
    if (savedBl) {
      try {
        const parsed = JSON.parse(savedBl);
        if (Array.isArray(parsed)) {
          setBlacklist(parsed);
        }
      } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlUsername || !newBlUserId) return;

    const entry: BlacklistedUser = {
      id: `bl_${Date.now()}`,
      robloxUsername: newBlUsername,
      userId: newBlUserId,
      reason: newBlReason || "Pelanggaran aturan donasi",
      addedBy: "Ryan Dev",
      addedAt: new Date().toISOString().substring(0, 16).replace("T", " "),
    };

    const updated = [entry, ...blacklist];
    setBlacklist(updated);
    localStorage.setItem("aw_blacklist", JSON.stringify(updated));
    setShowAddBlModal(false);
    setNewBlUsername("");
    setNewBlUserId("");
    setNewBlReason("");
    showToast(`User @${newBlUsername} berhasil dimasukkan ke daftar blacklist.`);
  };

  const handleRemoveBlacklist = (id: string, name: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    localStorage.setItem("aw_blacklist", JSON.stringify(updated));
    showToast(`User @${name} dihapus dari daftar blacklist.`);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const initials = newStaffName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: "ACTIVE",
      lastLogin: "Belum pernah login",
      avatar: initials,
    };

    const updated = [...staffList, newMember];
    setStaffList(updated);
    localStorage.setItem("aw_staff_list", JSON.stringify(updated));

    setShowAddStaffModal(false);
    setNewStaffName("");
    setNewStaffEmail("");
    showToast(`Akun staff ${newStaffName} (${newStaffRole}) berhasil dibuat.`);
  };

  const handleToggleStaffStatus = (id: string) => {
    const updated: StaffMember[] = staffList.map((s) => {
      if (s.id === id && s.role !== "OWNER") {
        const next: "ACTIVE" | "SUSPENDED" = s.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        showToast(`Status ${s.name} diubah menjadi ${next}.`);
        return { ...s, status: next };
      }
      return s;
    });
    setStaffList(updated);
    localStorage.setItem("aw_staff_list", JSON.stringify(updated));
  };

  const confirmDeleteStaff = () => {
    if (!deleteStaffCandidate) return;
    if (deleteStaffCandidate.role === "OWNER") {
      showToast("Akun Owner tidak dapat dihapus. Anda dapat mengedit nama dan emailnya.");
      setDeleteStaffCandidate(null);
      return;
    }
    const updated = staffList.filter((s) => s.id !== deleteStaffCandidate.id);
    setStaffList(updated);
    localStorage.setItem("aw_staff_list", JSON.stringify(updated));
    showToast(`Akun staff ${deleteStaffCandidate.name} berhasil dihapus.`);
    setDeleteStaffCandidate(null);
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const initials = editingStaff.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const updated = staffList.map((s) =>
      s.id === editingStaff.id
        ? { ...editingStaff, avatar: initials }
        : s
    );
    setStaffList(updated);
    localStorage.setItem("aw_staff_list", JSON.stringify(updated));
    showToast(`Informasi akun ${editingStaff.name} berhasil diperbarui.`);
    setEditingStaff(null);
  };

  const handleExecuteClawback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clawbackTxId) return;
    setIsClawbacking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsClawbacking(false);
    showToast(`Clawback transaksi ${clawbackTxId} berhasil diproses ke DataStore.`);
    setClawbackTxId("");
    setClawbackReason("");
  };

  const handleReplayWebhook = async () => {
    setIsReplaying(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsReplaying(false);
    showToast("Replay event webhook berhasil ditembakkan ke endpoint parser!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/providers"
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
              title="Kembali ke Dashboard Utama"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white font-bold shadow-sm shadow-amber-500/20">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    AW Studio Admin Console
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Root control panel untuk konfigurasi global, audit keamanan, dan emergency controls.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cluster JKT-01 Online</span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <span>Buka Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Global Warning Banner if Maintenance is Active */}
        {maintenanceMode && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/40 p-4 text-xs font-medium text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm animate-in fade-in">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold">MODE MAINTENANCE AKTIF</h4>
              <p className="mt-0.5">{maintenanceReason}</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                Webhook donasi dari Saweria, SociaBuzz, dan BagiBagi saat ini ditampung di antrean sementara dan tidak langsung diteruskan ke Roblox server.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMaintenanceMode(false);
                showToast("Mode Maintenance dinonaktifkan. Sistem kembali normal.");
              }}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-xs"
            >
              Matikan
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-slate-100/70 dark:bg-zinc-900 p-1 text-xs font-medium">
          {[
            { id: "OVERVIEW", label: "Server Telemetry", icon: Server },
            { id: "STAFF", label: "Staff & RBAC", icon: Users },
            { id: "CONTROLS", label: "Emergency & Multiplier", icon: Sliders },
            { id: "BLACKLIST", label: "Fraud & Blacklist", icon: Ban },
            { id: "AUDIT", label: "Audit Logs", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-white dark:bg-zinc-800 text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SERVER TELEMETRY & OVERVIEW */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">CPU Ingress Load</span>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                    <Cpu className="size-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">14.2%</div>
                <p className="text-xs text-muted-foreground font-medium">4 Core vCPU &bull; Load Avg 0.28</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">RAM Usage</span>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                    <HardDrive className="size-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">384 MB / 2 GB</div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Sehat (19.2% digunakan)</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Universes</span>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600">
                    <Gamepad2 className="size-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">3 Experience</div>
                <p className="text-xs text-muted-foreground font-medium">Polling rate: 5 detik</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Security State</span>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                    <ShieldAlert className="size-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">ENCRYPTED</div>
                <p className="text-xs text-muted-foreground font-medium">AES-256 GCM + HMAC SHA256</p>
              </div>
            </div>

            {/* Ingress Architecture & Raw Console */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Radio className="size-4 text-indigo-500" />
                  Arsitektur Ingress Provider AW Studio
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div>
                      <p className="font-bold text-foreground">Saweria Webhook Ingress</p>
                      <p className="text-[11px] text-muted-foreground font-mono">/api/webhooks/saweria</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      HMAC Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div>
                      <p className="font-bold text-foreground">SociaBuzz Tribe Ingress</p>
                      <p className="text-[11px] text-muted-foreground font-mono">/api/webhooks/sociabuzz</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Response: OK
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div>
                      <p className="font-bold text-foreground">BagiBagi Webhook Ingress</p>
                      <p className="text-[11px] text-muted-foreground font-mono">/api/webhooks/bagibagi</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Standby
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div>
                      <p className="font-bold text-foreground">Roblox Polling Claim Gateway</p>
                      <p className="text-[11px] text-muted-foreground font-mono">/api/roblox/claim</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      HttpService OK
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Daemon Log Console */}
              <div className="rounded-2xl border border-border bg-slate-950 p-5 shadow-sm space-y-3 font-mono text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="size-4 text-emerald-400" />
                      <span className="font-bold text-white">AW Studio Daemon Console</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Live Stream</span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-zinc-300 max-h-60 overflow-y-auto">
                    <p className="text-zinc-500">[04:00:01] Ingress router cluster initialized on port 3000.</p>
                    <p className="text-emerald-400">[04:00:02] [OK] AES-256 encryption engine initialized.</p>
                    <p className="text-zinc-400">[04:01:10] Provider Saweria signature verifier ready.</p>
                    <p className="text-zinc-400">[04:01:11] Provider SociaBuzz plain-text responder ready.</p>
                    <p className="text-zinc-400">[04:02:44] Roblox Server (Universe 10765129159) connected.</p>
                    <p className="text-sky-400">[04:15:20] Handshake: Leaderstats Cash binding confirmed.</p>
                    <p className="text-emerald-400">[04:22:05] Webhook event received &amp; normalized (tx_sw_88129).</p>
                    <p className="text-emerald-400">[04:22:06] Claim dispatched to @RianRobloxID (+50,000 Cash).</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Roblox Open Cloud: Online (82ms)</span>
                  <button
                    type="button"
                    onClick={() => showToast("Log sistem diekspor ke konsol.")}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Download className="size-3" /> Salin Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF & RBAC MANAGEMENT */}
        {activeTab === "STAFF" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Manajemen Akun Staff &amp; Akses Otorisasi (RBAC)
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Atur hak akses anggota tim AW Studio untuk mengelola donasi, provider, dan emergency controls.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Plus className="size-3.5" />
                <span>Tambah Akun Staff</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Nama Anggota</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role Otorisasi</th>
                    <th className="px-4 py-3.5">Status Akun</th>
                    <th className="px-4 py-3.5">Login Terakhir</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-foreground flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/70 font-bold text-xs text-indigo-700 dark:text-indigo-300">
                          {staff.avatar}
                        </div>
                        <span>{staff.name}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{staff.email}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            staff.role === "OWNER"
                              ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40"
                              : staff.role === "ADMIN"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/40"
                              : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            staff.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              staff.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{staff.lastLogin}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => setEditingStaff(staff)}
                            className="p-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
                            title="Edit Akun"
                          >
                            <Edit className="size-3.5" />
                          </button>

                          {staff.role !== "OWNER" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleStaffStatus(staff.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
                              >
                                {staff.status === "ACTIVE" ? (
                                  <>
                                    <Lock className="size-3 text-amber-500" />
                                    <span>Suspend</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="size-3 text-emerald-500" />
                                    <span>Aktifkan</span>
                                  </>
                                )}
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => setDeleteStaffCandidate(staff)}
                                className="p-1 rounded-lg border border-border text-muted-foreground hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-xs"
                                title="Hapus Akun Staff"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-semibold px-1.5">Owner</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EMERGENCY CONTROLS & MULTIPLIER */}
        {activeTab === "CONTROLS" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Maintenance Mode & Kill Switch */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Emergency Maintenance Mode (Kill Switch)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tangguhkan sementara semua auto-credit donasi ke server Roblox.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {maintenanceMode ? "STATUS: AKTIF" : "STATUS: NONAKTIF"}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={maintenanceMode}
                    onClick={() => {
                      const next = !maintenanceMode;
                      setMaintenanceMode(next);
                      showToast(
                        next
                          ? "PERINGATAN: Maintenance Mode diaktifkan!"
                          : "Maintenance Mode telah dinonaktifkan."
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                      maintenanceMode ? "bg-amber-600" : "bg-slate-200 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-foreground block">
                  Pesan Pemeliharaan (Ditampilkan kepada Pemain & Webhook Provider)
                </label>
                <input
                  type="text"
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Global Cash Multiplier Event */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                    <Flame className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Global Cash Multiplier Event (2x / 3x Cash Boost)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Berikan reward Cash ekstra untuk semua pemain yang donasi selama event berlangsung.
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isMultiplierActive
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {isMultiplierActive ? `EVENT AKTIF (${cashMultiplier}x)` : "EVENT TIDAK AKTIF"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">Nama Event</label>
                  <input
                    type="text"
                    value={multiplierEventName}
                    onChange={(e) => setMultiplierEventName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">Pilih Multiplier</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1.0, 1.5, 2.0, 3.0].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setCashMultiplier(m);
                          setIsMultiplierActive(m > 1.0);
                        }}
                        className={`py-2 rounded-lg border font-bold text-xs transition-all ${
                          cashMultiplier === m
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {m}x {m === 2.0 ? "(Double)" : m === 3.0 ? "(Triple)" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Event "${multiplierEventName}" disiarkan ke game! Multiplier: ${cashMultiplier}x.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Sparkles className="size-3.5" />
                  <span>Terapkan Multiplier ke In-Game</span>
                </button>
              </div>
            </div>

            {/* Transaction Clawback Tool */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <div className="size-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <RotateCcw className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Emergency Transaction Clawback / Rollback
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tarik kembali saldo Cash yang dikreditkan karena fraud atau chargeback donor.
                  </p>
                </div>
              </div>

              <form onSubmit={handleExecuteClawback} className="space-y-3 text-xs max-w-xl">
                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">ID Transaksi / Webhook ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tx_sw_88129 atau ep_sw_..."
                    value={clawbackTxId}
                    onChange={(e) => setClawbackTxId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 font-mono text-xs focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold block text-foreground">Alasan Clawback (Audit Trail)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pembayaran dibatalkan oleh bank donatur (Chargeback)"
                    value={clawbackReason}
                    onChange={(e) => setClawbackReason(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isClawbacking}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {isClawbacking ? (
                    <RefreshCw className="size-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="size-3.5" />
                  )}
                  <span>Eksekusi Clawback Saldo Player</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: BLACKLIST & FRAUD PREVENTION */}
        {activeTab === "BLACKLIST" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Daftar Blacklist Pemain &amp; Pencegahan Fraud
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Roblox UserID yang ada di daftar ini akan otomatis diblokir dari menerima saldo donasi in-game.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddBlModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-all shadow-sm"
              >
                <Plus className="size-3.5" />
                <span>Tambah Blacklist User</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Roblox Username</th>
                    <th className="px-4 py-3.5">Roblox User ID</th>
                    <th className="px-4 py-3.5">Alasan Pemblokiran</th>
                    <th className="px-4 py-3.5">Diblacklist Oleh</th>
                    <th className="px-4 py-3.5">Tanggal</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {blacklist.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-muted-foreground">
                        Belum ada pemain di daftar blacklist.
                      </td>
                    </tr>
                  ) : (
                    blacklist.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                          @{item.robloxUsername}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground">{item.userId}</td>
                        <td className="px-4 py-3.5 text-foreground">{item.reason}</td>
                        <td className="px-4 py-3.5 font-semibold text-muted-foreground">{item.addedBy}</td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground text-[11px]">{item.addedAt}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveBlacklist(item.id, item.robloxUsername)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-xs"
                          >
                            <Trash2 className="size-3" />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Webhook Manual Replay Box */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <RefreshCw className="size-4 text-indigo-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Webhook Payload Manual Replay Tool
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Gunakan alat ini jika provider sempat mengalami downtime dan ada transaksi donor yang perlu diproses ulang.
              </p>

              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={replayPayload}
                  onChange={(e) => setReplayPayload(e.target.value)}
                  className="w-full rounded-xl border border-border bg-slate-950 p-3 font-mono text-xs text-emerald-400 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isReplaying}
                    onClick={handleReplayWebhook}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    {isReplaying ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="size-3.5" />
                    )}
                    <span>Replay Payload Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL LOGS */}
        {activeTab === "AUDIT" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Security &amp; Administrative Audit Trail
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Catatan immutable setiap tindakan administratif, rotasi key, dan event kontrol darurat.
                </p>
              </div>

              <button
                type="button"
                onClick={() => showToast("Export audit log CSV berhasil diunduh!")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <Download className="size-3.5 text-muted-foreground" />
                <span>Download Audit CSV</span>
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Log ID</th>
                    <th className="px-4 py-3.5">Aktor / Admin</th>
                    <th className="px-4 py-3.5">Aksi Tindakan</th>
                    <th className="px-4 py-3.5">Target / Parameter</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5">Waktu</th>
                    <th className="px-4 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {initialAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{log.id}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{log.actor}</td>
                      <td className="px-4 py-3.5 text-foreground">{log.action}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                        {log.target}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">{log.ip}</td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono text-[11px]">{log.timestamp}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            log.status === "SUCCESS"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : log.status === "WARNING"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Tambah Blacklist User */}
      {showAddBlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Ban className="size-4 text-rose-600" />
                <h4 className="text-sm font-bold text-foreground">Blacklist Pemain Roblox</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBlModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlacklist} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Roblox Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exploiter99"
                  value={newBlUsername}
                  onChange={(e) => setNewBlUsername(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Roblox User ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 88129012"
                  value={newBlUserId}
                  onChange={(e) => setNewBlUserId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Alasan Pemblokiran</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chargeback atau eksploitasi webhook"
                  value={newBlReason}
                  onChange={(e) => setNewBlReason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddBlModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Tambahkan ke Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Staff Baru */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-foreground">Tambah Anggota Staff</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dimas Studio Ops"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dimas@awstudio.local"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Role Otorisasi</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as "ADMIN" | "MODERATOR")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs cursor-pointer"
                >
                  <option value="MODERATOR">Moderator (Lihat data &amp; kredit manual)</option>
                  <option value="ADMIN">Admin (Akses penuh kecuali master token)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Buat Akun Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Staff / Owner */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Edit className="size-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-foreground">Edit Profil Staff: {editingStaff.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Nama</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono"
                />
              </div>

              {editingStaff.role !== "OWNER" && (
                <div className="space-y-1">
                  <label className="font-semibold block text-foreground">Role</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        role: e.target.value as "ADMIN" | "MODERATOR",
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs cursor-pointer"
                  >
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Staff Confirmation */}
      {deleteStaffCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Hapus Akun Staff?</h4>
                <p className="text-xs text-muted-foreground">{deleteStaffCandidate.name}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus akun staff <b>{deleteStaffCandidate.name}</b> ({deleteStaffCandidate.email})? Anggota ini tidak akan bisa login lagi ke Admin Console.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteStaffCandidate(null)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteStaff}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm"
              >
                Hapus Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/80 p-4 text-center text-xs text-muted-foreground">
        AW Donation Cash System &bull; Root Admin Console &bull; Protected by AW Studio Security Guard
      </footer>
    </div>
  );
}
