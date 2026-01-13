"use client"
/**
 * Purpose: Lazy YouTube embed with lightweight stats fetched via server-side proxy.
 *
 * API:
 *   <YouTubePlayerWithStats url="https://youtu.be/<id> | <id>" preload={false} className="..." />
 *
 * Behavior & UX:
 *  - Mobile-first, responsive 16:9 player.
 *  - Shows poster with play overlay; only on click injects iframe (lazy-load).
 *  - After first play, fetches statistics from /api/youtube/stats (server-side proxy).
 *  - Caches stats in sessionStorage (TTL 300s).
 *  - Accessible: play button is a <button> with aria-label and keyboard support.
 *  - Secure: API key never exposed to client; proxied through server.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  url: string;
  preload?: boolean;
  className?: string;
};

type Stats = {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
};

const CACHE_PREFIX = "yt-stats-";
const TTL_MS = 300 * 1000; // 300 seconds

export function extractVideoId(input?: string): string {
  if (!input) return "";
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /^([A-Za-z0-9_-]{6,})$/
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m && (m as any)[1]) return (m as any)[1];
  }
  const parts = input.split("/");
  return parts[parts.length - 1];
}

export default function YouTubePlayerWithStats({ url, preload = false, className = "" }: Props) {
  const videoId = useMemo(() => extractVideoId(url), [url]);
  const [playing, setPlaying] = useState<boolean>(preload);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!videoId) return;
    
    const cacheKey = `${CACHE_PREFIX}${videoId}`;
    try {
      // Check cache first
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.fetchedAt < TTL_MS) {
          setStats(parsed.stats);
          setError(null);
          return;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }

    setLoadingStats(true);
    setError(null);
    
    try {
      // Fetch from server-side proxy (secure, no API key exposed)
      const response = await fetch(`/api/youtube/stats?videoId=${encodeURIComponent(videoId)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const s: Stats = {
        viewCount: data.viewCount,
        likeCount: data.likeCount,
        commentCount: data.commentCount
      };

      setStats(s);
      
      // Cache the stats
      try {
        sessionStorage.setItem(
          cacheKey, 
          JSON.stringify({ fetchedAt: Date.now(), stats: s })
        );
      } catch (e) {
        console.debug('YouTube stats cache error:', e);
      }
    } catch (e) {
      console.warn("YouTube stats fetch failed:", e);
      setError("Unable to load stats");
    } finally {
      setLoadingStats(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (playing) {
      fetchStats();
    }
  }, [playing, fetchStats]);

  const poster = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={className}>
      <div style={{ position: "relative", paddingTop: "56.25%" }} className="rounded-lg overflow-hidden">
        {!playing ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Play video"
            onClick={() => setPlaying(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPlaying(true);
              }
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            style={{
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full p-4" style={{ background: "rgba(244,160,36,0.95)" }} aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M8 5v14l11-7z" fill="#fff" />
                </svg>
              </div>
              <div className="text-white text-sm font-medium">Play</div>
            </div>
          </div>
        ) : (
          <iframe
            title={`YouTube video player - Video ${videoId}`}
            src={`https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="mt-3 card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Video stats</div>
            <div className="text-xs text-gray-600 mt-1">Data from YouTube (cached 5 min)</div>
          </div>
          <div className="text-sm text-gray-700">
            {loadingStats ? (
              <span className="text-xs">Loading...</span>
            ) : error ? (
              <span className="text-xs text-red-600">{error}</span>
            ) : stats ? (
              <span>
                {stats.viewCount ? `${Number(stats.viewCount).toLocaleString()} views` : "—"} · {" "}
                {stats.likeCount ? `${Number(stats.likeCount).toLocaleString()} likes` : "—"}
              </span>
            ) : (
              <span className="text-xs text-gray-400">Stats unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

