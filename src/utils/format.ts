export function getDomain(url?: string): string {
  if (!url) return "news.ycombinator.com";
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || "news.ycombinator.com";
  } catch {
    return "news.ycombinator.com";
  }
}

export function formatCount(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  return String(value);
}

export function formatRelativeTime(unixSeconds: number, nowMs = Date.now()): string {
  const seconds = Math.max(1, Math.floor((nowMs - unixSeconds * 1000) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}j`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "maintenant";
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
