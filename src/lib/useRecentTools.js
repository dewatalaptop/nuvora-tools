import { useEffect, useState } from "react";
import { getToolBySlug } from "../data/tools.js";

const STORAGE_KEY = "nuvora-recent-tools";
const MAX_ENTRIES = 8;

// Only ever stores { toolId, timestamp } pairs — never file contents,
// passwords, or other private text a tool might have processed.
function readEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentTool(toolId) {
  try {
    const entries = readEntries().filter((e) => e.toolId !== toolId);
    entries.unshift({ toolId, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // localStorage unavailable (private window, blocked) — recent tools just won't persist
  }
}

export function useRecentTools() {
  const [tools, setTools] = useState([]);
  useEffect(() => {
    const resolved = readEntries()
      .map((e) => {
        const tool = getToolBySlug(e.toolId);
        return tool ? { ...tool, lastUsedAt: e.timestamp } : null;
      })
      .filter(Boolean);
    setTools(resolved);
  }, []);
  return tools;
}
