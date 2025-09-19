import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { log } from "./logger";

let appInstance: express.Express | null = null;

async function getApp() {
  if (!appInstance) {
    appInstance = express();
    appInstance.set("env", (process.env.NODE_ENV || "production").trim());
    appInstance.use(express.json());
    appInstance.use(express.urlencoded({ extended: false }));

    appInstance.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
      });

      next();
    });

    try {
      const { registerRoutes } = await import("./routes");
      await registerRoutes(appInstance);
    } catch (err) {
      console.error(err);
      throw err;
    }

    appInstance.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
        console.error(err);
      }
    );
  }
  return appInstance;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await getApp();

    (app as any)(req, res, (err: any) => {
      if (err) {
        console.error("Express error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
