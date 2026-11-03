"use strict";
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDollarSign,
  Radio,
  FlaskConical,
  Activity,
  Database,
  Boxes,
  Settings,
  UserRound,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Check,
  Zap,
} from "lucide-react";

interface SidebarProps {
  currentWorkspace: string;
  onWorkspaceChange: (ws: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/donations", label: "Donations", icon: CircleDollarSign },
  { href: "/dashboard/providers", label: "Providers", icon: Radio, highlight: true },
  { href: "/dashboard/fake-donation", label: "Fake Donation", icon: FlaskConical },
  { href: "/dashboard/diagnostics", label: "Diagnostics", icon: Activity },
  { href: "/dashboard/datastore", label: "DataStore", icon: Database },
  { href: "/dashboard/workspaces", label: "Workspaces", icon: Boxes },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
];

const workspaces = [
  { id: "10765129159", name: "NEW VERFECT SPACE", universeId: "10765129159" },
  { id: "10771421228", name: "RBLX WITH EXT DB", universeId: "10771421228" },
  { id: "10770703228", name: "DEV SANDBOX LAB", universeId: "10770703228" },
];

export default function DashboardSidebar({
  currentWorkspace,
  onWorkspaceChange,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = React.useState(false);
  const [workspacesList, setWorkspacesList] = React.useState(workspaces);

  React.useEffect(() => {
    const saved = localStorage.getItem("aw_universes");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWorkspacesList(
            parsed.map((u: { id: string; name: string }) => ({
              id: u.id,
              name: u.name,
              universeId: u.id,
            }))
          );
        }
      } catch {}
    }
  }, []);

  const selectedWs =
    workspacesList.find((w) => w.id === currentWorkspace) || workspacesList[0] || {
      id: "none",
      name: "Belum Ada Workspace",
      universeId: "-",
    };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-4 border-b border-border bg-sidebar">
          <Link
            href="/dashboard/providers"
            className="flex items-center gap-3 p-2 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 transition-all"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold text-sm shadow-sm shadow-indigo-500/25 tracking-tight shrink-0">
              AW
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-sm font-bold tracking-tight text-foreground">
                  AW Donation Cash
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  v2.4
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                <Zap className="size-3 text-indigo-500 inline shrink-0" />
                <span>AW Studio Cloud</span>
              </p>
            </div>
          </Link>

          {/* Universe / Workspace Switcher */}
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-xs"
            >
              <div className="truncate text-left">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Active Universe
                </span>
                <span className="truncate text-foreground block font-bold text-xs mt-0.5">
                  {selectedWs.name}
                </span>
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  workspaceMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1.5 rounded-xl border border-border bg-popover p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                {workspacesList.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Belum ada workspace</p>
                    <Link
                      href="/dashboard/workspaces"
                      onClick={() => setWorkspaceMenuOpen(false)}
                      className="mt-1.5 inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      + Tambah Sekarang
                    </Link>
                  </div>
                ) : (
                  workspacesList.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        onWorkspaceChange(ws.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left font-medium transition-colors ${
                        ws.id === selectedWs.id
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{ws.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          Universe ID: {ws.universeId}
                        </p>
                      </div>
                      {ws.id === selectedWs.id && (
                        <Check className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Navigasi
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50/80 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300 shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`size-4 transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                    }`}
                  >
                    Active
                  </span>
                )}
              </Link>
            );
          })}

          {/* Admin link */}
          <div className="pt-2">
            <Link
              href="/admin"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-all shadow-xs"
            >
              <ShieldAlert className="size-4 text-amber-500" />
              <span>Admin Console</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="border-t border-border bg-sidebar p-3 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-2.5 shadow-xs">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60 font-bold text-indigo-700 dark:text-indigo-300 text-xs">
              RD
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-bold text-foreground">
                  Ryan Dev
                </p>
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                  Owner
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground font-mono">
                ryan@awstudio.local
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Simulasi logout berhasil.")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
