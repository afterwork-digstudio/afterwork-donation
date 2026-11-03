"use strict";
"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ProviderCard, { ProviderData } from "@/components/ProviderCard";
import WebhookDeliveryTable, { WebhookLog } from "@/components/WebhookDeliveryTable";
import WebhookSimulatorModal from "@/components/WebhookSimulatorModal";
import {
  ShieldCheck,
  CheckCircle2,
  Radio,
  Gamepad2,
  Coins,
  Sparkles,
} from "lucide-react";

const initialProviders: ProviderData[] = [
  {
    id: "SAWERIA",
    name: "Saweria",
    tagline: "QRIS, GoPay, OVO, Dana, LinkAja via Saweria Webhook",
    enabled: true,
    hasCredential: true,
    credentialLabel: "Stream Key / Webhook Secret",
    credentialPlaceholder: "e.g. 9b9809298fe40d2c... (Stream Key Saweria)",
    webhookUrl:
      "http://localhost:3000/api/webhooks/saweria/ep_sw_9f81a7d6",
    docsUrl: "https://saweria.co",
    badgeColor: "bg-amber-400 text-amber-950",
    guideSteps: [
      "Buka akun Saweria di saweria.co lalu buka menu 'Integrasi' / 'Webhook'.",
      "Salin Webhook Endpoint URL di atas dan masukkan ke kolom Webhook URL di Saweria.",
      "Salin 'Stream Key' dari Saweria dan tempel ke kolom input kredensial di atas.",
      "Aktifkan switch provider lalu klik 'Simpan Konfigurasi'.",
      "Gunakan tombol 'Uji Konfigurasi' untuk memverifikasi validitas HMAC token.",
    ],
  },
  {
    id: "SOCIABUZZ",
    name: "SociaBuzz (TRIBE)",
    tagline: "E-Wallet, QRIS, Virtual Account via SociaBuzz Tribe",
    enabled: true,
    hasCredential: true,
    credentialLabel: "Webhook Secret / API Token",
    credentialPlaceholder: "e.g. sb_sec_519a820b... (Secret SociaBuzz)",
    webhookUrl:
      "http://localhost:3000/api/webhooks/sociabuzz/ep_sb_44c10e82",
    docsUrl: "https://sociabuzz.com",
    badgeColor: "bg-emerald-400 text-emerald-950",
    guideSteps: [
      "Buka dashboard SociaBuzz > Fitur TRIBE > pilih menu 'Webhook'.",
      "Masukkan Webhook URL di atas ke kolom URL Webhook SociaBuzz.",
      "Pada pengaturan response SociaBuzz, pastikan nilai response yang diharapkan adalah 'OK'.",
      "Masukkan Secret Key ke form di atas dan simpan konfigurasi.",
      "Kirim test donasi melalui fitur uji webhook SociaBuzz.",
    ],
  },
  {
    id: "BAGIBAGI",
    name: "BagiBagi",
    tagline: "Platform Donasi & Tip Kreator BagiBagi.id",
    enabled: false,
    hasCredential: false,
    credentialLabel: "Secret Key / API Token",
    credentialPlaceholder: "e.g. bb_live_key_991823... (BagiBagi API Key)",
    webhookUrl:
      "http://localhost:3000/api/webhooks/bagibagi/ep_bb_2701f5aa",
    docsUrl: "https://bagibagi.id",
    badgeColor: "bg-purple-300 text-purple-950",
    guideSteps: [
      "Buka akun BagiBagi di bagibagi.id > menu 'Developer' / 'API & Webhook'.",
      "Tambahkan Webhook Endpoint baru menggunakan URL di atas.",
      "Salin Secret Token yang diberikan dan masukkan ke kolom kredensial.",
      "Nyalakan tombol 'Aktifkan provider' lalu simpan konfigurasi.",
    ],
  },
];

const initialLogs: WebhookLog[] = [
  {
    id: "tx_sw_88129",
    provider: "SAWERIA",
    donator: "Rian_Sultan",
    robloxUsername: "RianRobloxID",
    amount: 50000,
    cashReward: 50000,
    message: "Semangat bang update gamenya terus!",
    status: "success",
    statusCode: 200,
    timestamp: "20:34:12",
    rawPayload: {
      version: "2024.1",
      id: "tx_sw_88129",
      donator_name: "Rian_Sultan",
      amount_raw: 50000,
      currency: "IDR",
      message: "Semangat bang update gamenya terus!",
      signature_valid: true,
    },
  },
  {
    id: "tx_sb_44102",
    provider: "SOCIABUZZ",
    donator: "GamerSejati99",
    robloxUsername: "GamerPro_99",
    amount: 25000,
    cashReward: 25000,
    message: "Top up cash buat VIP gamepass",
    status: "success",
    statusCode: 200,
    timestamp: "20:28:45",
    rawPayload: {
      event: "donation",
      transaction_id: "tx_sb_44102",
      supporter_name: "GamerSejati99",
      amount: 25000,
      response_expect: "OK",
    },
  },
  {
    id: "tx_bb_10924",
    provider: "BAGIBAGI",
    donator: "AnonymousFan",
    robloxUsername: "BloxHero77",
    amount: 10000,
    cashReward: 10000,
    message: "Salam dari fans AW Studio!",
    status: "success",
    statusCode: 200,
    timestamp: "20:15:02",
    rawPayload: {
      provider: "BAGIBAGI",
      transaction_id: "tx_bb_10924",
      donor: "AnonymousFan",
      total: 10000,
    },
  },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderData[]>(initialProviders);
  const [logs, setLogs] = useState<WebhookLog[]>(initialLogs);
  const [currentWorkspace, setCurrentWorkspace] = useState("10765129159");
  const [selectedTab, setSelectedTab] = useState<string>("ALL");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCount = providers.filter((p) => p.enabled).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from localStorage and normalize URL origin
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://afterwork-donation.vercel.app";

    const saved = localStorage.getItem("aw_providers");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((p: ProviderData) => ({
            ...p,
            webhookUrl: p.webhookUrl.replace(/^http:\/\/localhost:\d+/, origin),
          }));
          setProviders(normalized);
          return;
        }
      } catch {}
    }

    // Default: normalize initialProviders with actual domain
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        webhookUrl: p.webhookUrl.replace(/^http:\/\/localhost:\d+/, origin),
      }))
    );
  }, []);

  const handleUpdateProvider = (
    id: string,
    updated: Partial<ProviderData>
  ) => {
    setProviders((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated } : p));
      localStorage.setItem("aw_providers", JSON.stringify(next));
      return next;
    });
  };

  const handleLogEvent = (msg: string) => {
    showToast(msg);
  };

  const handleSimulateWebhook = (newLog: WebhookLog) => {
    setLogs((prev) => [newLog, ...prev]);
    handleLogEvent(
      `Webhook donasi ${newLog.provider} (Rp ${newLog.amount.toLocaleString(
        "id-ID"
      )}) diterima dan dikreditkan!`
    );
  };

  const displayedProviders =
    selectedTab === "ALL"
      ? providers
      : providers.filter((p) => p.id === selectedTab);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-xs font-semibold text-foreground shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simulator Modal */}
      <WebhookSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSimulate={handleSimulateWebhook}
      />

      {/* Sidebar */}
      <DashboardSidebar
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={setCurrentWorkspace}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Radio className="size-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Donation Providers
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                Kelola endpoint webhook dan credential API Key untuk Saweria,
                SociaBuzz, dan BagiBagi pada Roblox Donation Cash System.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]"
              >
                <Sparkles className="size-3.5" />
                <span>Simulasi Webhook Donasi</span>
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status Provider
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Radio className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {activeCount} / 3 Aktif
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Saweria &amp; SociaBuzz siap terima event
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Roblox Universe
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Gamepad2 className="size-4" />
                </div>
              </div>
              <div className="text-lg font-bold truncate text-foreground">
                {currentWorkspace === "10765129159"
                  ? "NEW VERFECT SPACE"
                  : currentWorkspace === "10771421228"
                  ? "RBLX WITH EXT DB"
                  : "DEV SANDBOX"}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                ID: {currentWorkspace}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Keamanan Endpoint
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="size-4" />
                </div>
              </div>
              <div className="text-lg font-bold text-foreground">
                AES-256 GCM
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                HMAC SHA256 Signature verification
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Konversi Cash
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Coins className="size-4" />
                </div>
              </div>
              <div className="text-lg font-bold text-foreground">
                1 IDR = 1 Cash
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Auto-credit via DataStore / MessagingService
              </p>
            </div>
          </div>

          {/* Provider Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-100/70 dark:bg-zinc-900 p-1 text-xs font-medium">
              {[
                { id: "ALL", label: "Semua Provider (3)" },
                { id: "SAWERIA", label: "Saweria" },
                { id: "SOCIABUZZ", label: "SociaBuzz" },
                { id: "BAGIBAGI", label: "BagiBagi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedTab === tab.id
                      ? "bg-white dark:bg-zinc-800 text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-medium text-muted-foreground">
              Menampilkan {displayedProviders.length} konfigurasi provider
            </span>
          </div>

          {/* Provider Cards Grid */}
          <div className="grid grid-cols-1 gap-6">
            {displayedProviders.map((prov) => (
              <ProviderCard
                key={prov.id}
                provider={prov}
                onUpdate={(updated) => handleUpdateProvider(prov.id, updated)}
                onLogEvent={handleLogEvent}
              />
            ))}
          </div>

          {/* Real-time Webhook Logs Table */}
          <div className="pt-2">
            <WebhookDeliveryTable logs={logs} />
          </div>
        </main>
      </div>
    </div>
  );
}
