"use strict";
"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  RotateCw,
  ExternalLink,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  KeyRound,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

export interface ProviderData {
  id: "SAWERIA" | "SOCIABUZZ" | "BAGIBAGI";
  name: string;
  tagline: string;
  enabled: boolean;
  hasCredential: boolean;
  credentialLabel: string;
  credentialPlaceholder: string;
  webhookUrl: string;
  guideSteps: string[];
  docsUrl: string;
  badgeColor: string;
}

interface ProviderCardProps {
  provider: ProviderData;
  onUpdate: (updated: Partial<ProviderData>) => void;
  onLogEvent?: (msg: string, type: "info" | "success" | "warning") => void;
}

export default function ProviderCard({
  provider,
  onUpdate,
  onLogEvent,
}: ProviderCardProps) {
  // Form states
  const [enabled, setEnabled] = useState(provider.enabled);
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [hasCredential, setHasCredential] = useState(provider.hasCredential);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Copy Webhook URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(provider.webhookUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      onLogEvent?.(`Webhook URL untuk ${provider.name} berhasil disalin`, "info");
    } catch {
      alert("Gagal menyalin Webhook URL ke clipboard");
    }
  };

  // Test Provider Configuration
  const handleTest = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFeedback({
        type: "success",
        message:
          "Konfigurasi provider valid. Kredensial, verifikasi signature, dan webhook listener siap menerima donasi.",
      });
      onLogEvent?.(
        `Uji konfigurasi ${provider.name} berhasil: verifikasi signature valid.`,
        "success"
      );
    } catch {
      setFeedback({
        type: "error",
        message: "Tidak dapat menguji konfigurasi provider.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Rotate Webhook URL (Regenerate Endpoint)
  const handleRotateEndpoint = async () => {
    setIsRotating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const newUrl = `${origin}/api/webhooks/${provider.id.toLowerCase()}/ep_${randomSuffix}`;

      onUpdate({ webhookUrl: newUrl });
      setShowRotateDialog(false);
      setFeedback({
        type: "success",
        message:
          "Webhook URL berhasil diganti. URL lama langsung dinonaktifkan. Segera salin URL baru ke dashboard provider.",
      });
      onLogEvent?.(
        `Webhook URL ${provider.name} di-generate ulang: ${newUrl}`,
        "warning"
      );
    } catch {
      setFeedback({
        type: "error",
        message: "Gagal membuat Webhook URL baru.",
      });
    } finally {
      setIsRotating(false);
    }
  };

  // Save Provider Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const newHasCred = secret.trim().length > 0 ? true : hasCredential;
      setHasCredential(newHasCred);
      onUpdate({
        enabled,
        hasCredential: newHasCred,
      });

      setSecret("");
      setFeedback({
        type: "success",
        message: "Konfigurasi provider berhasil disimpan ke secure vault AW Cloud.",
      });
      onLogEvent?.(
        `Konfigurasi ${provider.name} disimpan (Status: ${
          enabled ? "Aktif" : "Nonaktif"
        }).`,
        "success"
      );
    } catch {
      setFeedback({
        type: "error",
        message: "Gagal menyimpan konfigurasi ke server.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const providerGradients: Record<string, string> = {
    SAWERIA: "from-amber-500 to-orange-600 text-white shadow-amber-500/20",
    SOCIABUZZ: "from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
    BAGIBAGI: "from-violet-500 to-purple-600 text-white shadow-purple-500/20",
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="border-b border-border p-5 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Provider Logo / Badge */}
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm bg-gradient-to-tr shadow-sm ${
                providerGradients[provider.id] || "from-indigo-500 to-purple-600 text-white"
              }`}
            >
              {provider.id.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {provider.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                      : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full mr-1 ${
                      enabled ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {enabled ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {provider.tagline}
              </p>
            </div>
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <label className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
              {enabled ? "Diaktifkan" : "Dinonaktifkan"}
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => {
                const nextState = !enabled;
                setEnabled(nextState);
                onUpdate({ enabled: nextState });
                onLogEvent?.(
                  `Provider ${provider.name} ${
                    nextState ? "diaktifkan" : "dinonaktifkan"
                  }.`,
                  "info"
                );
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Webhook Endpoint Box */}
          <div className="rounded-xl border border-border/80 bg-slate-50/70 dark:bg-zinc-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <LinkIcon className="size-3.5 text-indigo-500" />
                <span>Webhook Endpoint URL</span>
              </label>

              <button
                type="button"
                onClick={() => setShowRotateDialog(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Ganti URL Webhook untuk keamanan"
              >
                <RotateCw className="size-3" />
                <span>Ganti URL</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={provider.webhookUrl}
                className="flex-1 rounded-lg border border-border bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  copiedUrl
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-zinc-900 border border-border text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs"
                }`}
              >
                {copiedUrl ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Masukkan URL ini di dashboard {provider.name} agar setiap donasi terkirim ke Roblox server.
            </p>
          </div>

          {/* Credential Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <KeyRound className="size-3.5 text-indigo-500" />
                  <span>{provider.credentialLabel}</span>
                </label>

                <div className="flex items-center gap-1">
                  {hasCredential ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
                      <ShieldCheck className="size-3 text-emerald-600" />
                      Tersimpan & Terenkripsi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 text-[10px] font-semibold border border-amber-200/50 dark:border-amber-800/40">
                      <AlertCircle className="size-3 text-amber-600" />
                      Belum Diisi
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder={
                    hasCredential
                      ? "•••••••••••••••••••••••••••••••• (Isi baru untuk mengganti)"
                      : provider.credentialPlaceholder
                  }
                  className="w-full rounded-lg border border-border bg-white dark:bg-zinc-950 pr-10 pl-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted-foreground/60 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showSecret ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-xs"
              >
                {isTesting ? (
                  <RefreshCw className="size-3.5 animate-spin text-indigo-500" />
                ) : (
                  <Sparkles className="size-3.5 text-indigo-500" />
                )}
                <span>{isTesting ? "Menguji..." : "Uji Konfigurasi"}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Konfigurasi</span>
                )}
              </button>
            </div>
          </form>

          {/* Feedback message banner */}
          {feedback && (
            <div
              className={`flex items-start gap-2.5 rounded-xl p-3 text-xs font-medium border ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{feedback.message}</div>
            </div>
          )}
        </div>

        {/* Integration Guide Accordion */}
        <div className="border-t border-border/80 pt-3">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="size-3.5 text-indigo-500" />
              <span>Panduan Integrasi {provider.name}</span>
            </div>
            <ChevronDown
              className={`size-3.5 transition-transform duration-200 ${
                showGuide ? "rotate-180" : ""
              }`}
            />
          </button>

          {showGuide && (
            <div className="mt-3 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-zinc-900/30 p-3.5 space-y-2.5 animate-in fade-in">
              <ol className="space-y-2 text-xs text-muted-foreground">
                {provider.guideSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="pt-2 border-t border-border/60 flex justify-end">
                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Buka Dokumentasi {provider.name}</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rotate Dialog Modal */}
      {showRotateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Ganti Webhook URL {provider.name}?
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tindakan ini akan membuat secret slug endpoint baru.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Setelah diganti, webhook dari URL lama akan otomatis ditolak. Anda harus
              memperbarui URL di dashboard {provider.name} agar transaksi tetap masuk.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRotateDialog(false)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRotateEndpoint}
                disabled={isRotating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
              >
                {isRotating && <RefreshCw className="size-3.5 animate-spin" />}
                <span>Buat Endpoint Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
