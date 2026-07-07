import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const HISTORY_FILE = path.join(process.cwd(), "watch_history.json");

// Helper to load history
interface HistoryData {
  videoIds: string[];
  watchedDates: Record<string, string>;
}

function getHistory(): HistoryData {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Old format: array of videoIds
        const watchedDates: Record<string, string> = {};
        parsed.forEach((id, index) => {
          // Generate dates trailing back
          watchedDates[id] = new Date(Date.now() - index * 24 * 3600 * 1000).toISOString();
        });
        return { videoIds: parsed, watchedDates };
      } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.videoIds)) {
        return {
          videoIds: parsed.videoIds,
          watchedDates: parsed.watchedDates || {}
        };
      }
    }
  } catch (err) {
    console.error("Error reading history file:", err);
  }
  // Default fallback matching initialPlaylists in src/data.ts
  return {
    videoIds: ["video_wisdom_1"],
    watchedDates: { "video_wisdom_1": new Date("2026-07-05T09:00:00.000Z").toISOString() }
  };
}

// Helper to save history
function saveHistory(historyData: HistoryData) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing history file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/history", (req, res) => {
    const data = getHistory();
    res.json(data);
  });

  app.post("/api/history", (req, res) => {
    const { videoIds, watchedDates } = req.body;
    if (Array.isArray(videoIds)) {
      saveHistory({ videoIds, watchedDates: watchedDates || {} });
      res.json({ success: true, count: videoIds.length });
    } else {
      res.status(400).json({ error: "videoIds must be an array" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
