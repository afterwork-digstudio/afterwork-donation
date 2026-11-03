"use strict";
"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Coins,
  CheckCircle2,
} from "lucide-react";
import { WebhookLog } from "./WebhookDeliveryTable";

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (newLog: WebhookLog) => void;
}

export default function WebhookSimulatorModal({
  isOpen,
  onClose,
  onSimulate,
}: WebhookSimulatorModalProps) {
  const [provider, setProvider] = useState<"SAWERIA" | "SOCIABUZZ" | "BAGIBAGI">(
    "SAWERIA"
  );
  const [donator, setDonator] = useState("PlayerSultan_ID");
  const [robloxUsername, setRobloxUsername] = useState("SultanRoblox88");
  const [amount, setAmount] = useState(25000);
  const [message, setMessage] = useState("Bang minta cash buat beli gamepass!");
  const [isSending, setIsSending] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Construct raw payload corresponding to the provider format
    let rawPayload: Record<string, unknown> = {};
    const now = new Date();
    const id = `tx_${Date.now().toString(36)}`;

    if (provider === "SAWERIA") {
      rawPayload = {
        version: "2024.1",
        id: id,
        donator_name: donator,
        amount_raw: amount,
        message: message,
        created_at: now.toISOString(),
        currency: "IDR",
        signature: "hmac_sha256_" + Math.random().toString(16).substring(2, 18),
      };
    } else if (provider === "SOCIABUZZ") {
      rawPayload = {
        event: "donation",
        transaction_id: id,
        supporter_name: donator,
        amount: amount,
        media_message: message,
        target: robloxUsername,
        response_expect: "OK",
        created_at: now.toISOString(),
      };
    } else {
      rawPayload = {
        provider: "BAGIBAGI",
        transaction_id: id,
        donor: donator,
        total: amount,
        note: message,
        recipient_user: robloxUsername,
        timestamp: Math.floor(now.getTime() / 1000),
      };
    }

    const newLog: WebhookLog = {
      id,
      provider,
      donator,
      robloxUsername,
      amount,
      cashReward: amount, // 1 IDR = 1 Cash
      message,
      status: "success",
      statusCode: 200,
      timestamp: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      rawPayload,
    };

    onSimulate(newLog);
    setIsSending(false);
    setSuccessNotice(true);

    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                Simulator Webhook Donasi
              </h4>
              <p className="text-xs text-muted-foreground font-medium">
                Kirim payload simulasi untuk menguji auto-credit Cash in-game
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Provider Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
              Pilih Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["SAWERIA", "SOCIABUZZ", "BAGIBAGI"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    provider === p
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Donator & Roblox User */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">
                Nama Donatur (Tampilan)
              </label>
              <input
                type="text"
                required
                value={donator}
                onChange={(e) => setDonator(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">
                Roblox Username
              </label>
              <input
                type="text"
                required
                value={robloxUsername}
                onChange={(e) => setRobloxUsername(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Amount and In-game Cash */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground">
                Nominal Donasi (IDR)
              </label>
              <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                <Coins className="size-3.5" />
                Reward: +{amount.toLocaleString("id-ID")} Cash
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10000, 25000, 50000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    amount === val
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1000}
              step={1000}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs mt-1"
            />
          </div>

          {/* Message / Catatan */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">
              Pesan Donasi (Muncul di Chat Roblox)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs resize-none"
            />
          </div>

          {/* Success Banner */}
          {successNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/40 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Simulasi donasi berhasil diproses dan dikreditkan!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSending || successNotice}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {isSending ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Kirim Simulasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
