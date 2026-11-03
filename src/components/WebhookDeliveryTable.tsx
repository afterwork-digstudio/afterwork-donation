"use strict";
"use client";

import React, { useState } from "react";
import {
  Table as TableIcon,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileCode,
  X,
  Copy,
  Check,
} from "lucide-react";

export interface WebhookLog {
  id: string;
  provider: "SAWERIA" | "SOCIABUZZ" | "BAGIBAGI";
  donator: string;
  robloxUsername: string;
  amount: number;
  cashReward: number;
  message: string;
  status: "success" | "failed";
  statusCode: number;
  timestamp: string;
  rawPayload: Record<string, unknown>;
}

interface WebhookDeliveryTableProps {
  logs: WebhookLog[];
}

export default function WebhookDeliveryTable({ logs }: WebhookDeliveryTableProps) {
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [filterProvider, setFilterProvider] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchProvider =
      filterProvider === "ALL" || log.provider === filterProvider;
    const matchSearch =
      log.donator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.robloxUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProvider && matchSearch;
  });

  const handleCopyPayload = async (json: string) => {
    await navigator.clipboard.writeText(json);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
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
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="border-b border-border p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="size-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-foreground">
                Log Pengiriman Webhook Real-Time
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Daftar payload transaksi donasi yang masuk dari provider ke server Roblox
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari donatur / ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>

            {/* Provider Filter Tabs */}
            <div className="flex rounded-lg border border-border bg-slate-100/70 dark:bg-zinc-900 p-0.5 text-xs font-medium">
              {["ALL", "SAWERIA", "SOCIABUZZ", "BAGIBAGI"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterProvider(p)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    filterProvider === p
                      ? "bg-white dark:bg-zinc-800 text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p === "ALL" ? "Semua" : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-slate-50/60 dark:bg-zinc-900/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Provider</th>
              <th className="py-3 px-4">Donatur</th>
              <th className="py-3 px-4">Target Roblox</th>
              <th className="py-3 px-4">Nominal</th>
              <th className="py-3 px-4">Reward Cash</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4 text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted-foreground">
                  Tidak ada event webhook yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-muted-foreground font-medium">
                    {log.id}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getProviderBadge(
                        log.provider
                      )}`}
                    >
                      {log.provider}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    <div>{log.donator}</div>
                    {log.message && (
                      <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                        &quot;{log.message}&quot;
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    @{log.robloxUsername}
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    Rp {log.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    +{log.cashReward.toLocaleString("id-ID")} Cash
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        log.status === "success"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40"
                      }`}
                    >
                      {log.status === "success" ? (
                        <CheckCircle2 className="size-3 text-emerald-600" />
                      ) : (
                        <XCircle className="size-3 text-rose-600" />
                      )}
                      <span>
                        {log.status === "success" ? "Terkredit" : "Gagal"} (
                        {log.statusCode})
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
                    >
                      <Eye className="size-3 text-indigo-500" />
                      <span>Lihat JSON</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="size-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-foreground">
                  Payload Webhook Event: {selectedLog.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Provider: <b className="text-foreground">{selectedLog.provider}</b></span>
              <span>Waktu Ingress: <b className="text-foreground">{selectedLog.timestamp}</b></span>
              <span>Status HTTP: <b className="text-foreground">{selectedLog.statusCode} OK</b></span>
            </div>

            <div className="relative">
              <pre className="max-h-80 overflow-y-auto rounded-xl border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400">
                {JSON.stringify(selectedLog.rawPayload, null, 2)}
              </pre>

              <button
                type="button"
                onClick={() =>
                  handleCopyPayload(
                    JSON.stringify(selectedLog.rawPayload, null, 2)
                  )
                }
                className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/90 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                {copiedPayload ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin Raw JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
