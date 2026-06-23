import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Search, Settings as SettingsIcon } from "lucide-react";
import { useData } from "@/store/DataContext";
import { LANDING_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    message: '"Product Launch — v2" finished sending to 12,400 subscribers',
    time: "2h ago",
    read: false,
  },
  { id: "n2", message: "5 new unsubscribes in the last 24 hours", time: "5h ago", read: false },
  { id: "n3", message: "Your weekly performance summary is ready", time: "1d ago", read: true },
  {
    id: "n4",
    message: '"Re-engagement: Inactive Users" is scheduled for Jun 21',
    time: "2d ago",
    read: true,
  },
];

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const { campaigns, subscribers } = useData();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = useState<"search" | "notifications" | "user" | null>(null);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const matchingCampaigns = query
    ? campaigns.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];
  const matchingSubscribers = query
    ? subscribers
        .filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.email.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 4)
    : [];

  function goToResults(path: string) {
    navigate(`${path}?q=${encodeURIComponent(query)}`);
    setQuery("");
    setOpenMenu(null);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header
      ref={containerRef}
      className="relative flex items-center gap-4 border-b border-border bg-card px-4 py-4 sm:px-6"
    >
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenMenu("search");
            }}
            onFocus={() => setOpenMenu("search")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) goToResults("/campaigns");
            }}
            placeholder="Search campaigns, subscribers..."
            className="w-56 rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />

          {openMenu === "search" && query.trim() && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card py-2 shadow-lg">
              {matchingCampaigns.length === 0 && matchingSubscribers.length === 0 && (
                <p className="px-4 py-2 text-sm text-muted-foreground">No results for "{query}"</p>
              )}
              {matchingCampaigns.length > 0 && (
                <div className="mb-1">
                  <p className="px-4 py-1 text-xs font-semibold text-muted-foreground">Campaigns</p>
                  {matchingCampaigns.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => goToResults("/campaigns")}
                      className="block w-full truncate px-4 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {matchingSubscribers.length > 0 && (
                <div>
                  <p className="px-4 py-1 text-xs font-semibold text-muted-foreground">Subscribers</p>
                  {matchingSubscribers.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => goToResults("/subscribers")}
                      className="block w-full truncate px-4 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      {s.name} <span className="text-muted-foreground">· {s.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "notifications" ? null : "notifications"))}
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
            )}
          </button>

          {openMenu === "notifications" && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium text-accent hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                      )
                    }
                    className="flex w-full items-start gap-2 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-muted"
                  >
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                    <span className={cn("text-sm", n.read ? "pl-3.5 text-muted-foreground" : "text-foreground")}>
                      {n.message}
                      <span className="mt-0.5 block text-xs text-muted-foreground">{n.time}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "user" ? null : "user"))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
            aria-label="Account menu"
          >
            M
          </button>

          {openMenu === "user" && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-border bg-card py-1.5 shadow-lg">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-sm font-medium text-foreground">Mubashar</p>
                <p className="truncate text-xs text-muted-foreground">hello@pulse-analytics.com</p>
              </div>
              <button
                onClick={() => {
                  navigate("/settings");
                  setOpenMenu(null);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
              >
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <a
                href={LANDING_URL}
                className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-muted"
              >
                <LogOut className="h-4 w-4" /> Log out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
