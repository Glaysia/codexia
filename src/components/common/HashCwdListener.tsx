import { useEffect } from "react";
import { invoke } from "@/lib/tauri-proxy";
import { useCodexStore } from "@/stores/useCodexStore";
import { useFolderStore } from "@/stores/FolderStore";
import { useLayoutStore } from "@/stores/settings/layoutStore";

function sanitizePath(candidate: string | null): string | null {
  if (!candidate) {
    return null;
  }

  const trimmed = candidate.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function extractHashCwd(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash || "";
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) {
    return null;
  }

  const params = new URLSearchParams(hash.substring(queryIndex + 1));
  return params.get("cwd");
}

function ensureChatRoute() {
  if (typeof window === "undefined") {
    return;
  }

  const hash = window.location.hash || "";
  const [route, query] = hash.split("?");
  if (route === "" || route === "#" || route === "#/") {
    const suffix = query ? `?${query}` : "";
    window.location.hash = `#/chat${suffix}`;
  }
}

async function canonicalize(candidate: string): Promise<string | null> {
  const sanitized = sanitizePath(candidate);
  if (!sanitized) {
    return null;
  }

  try {
    const resolved = await invoke<string>("canonicalize_path", { path: sanitized });
    return sanitizePath(resolved) ?? sanitized;
  } catch (error) {
    console.debug("Failed to canonicalize URL CWD", error);
    return sanitized;
  }
}

export function HashCwdListener() {
  const setCwd = useCodexStore((state) => state.setCwd);

  useEffect(() => {
    let cancelled = false;

    const applyCwd = (path: string) => {
      if (!path) {
        return;
      }

      if (useCodexStore.getState().cwd === path) {
        return;
      }

      setCwd(path);
      ensureChatRoute();
      const layoutStore = useLayoutStore.getState();
      layoutStore.setFileTree(true);
      layoutStore.setChatPane(true);
      useFolderStore.getState().setCurrentFolder(path);
    };

    const resolveAndApply = async () => {
      const hashValue = sanitizePath(extractHashCwd());
      if (!hashValue) {
        return;
      }

      const finalPath = await canonicalize(hashValue);
      if (cancelled) {
        return;
      }

      applyCwd(finalPath ?? hashValue);
    };

    resolveAndApply();

    if (typeof window !== "undefined") {
      const handler = () => {
        resolveAndApply();
      };
      window.addEventListener("hashchange", handler);
      return () => {
        cancelled = true;
        window.removeEventListener("hashchange", handler);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [setCwd]);

  return null;
}
