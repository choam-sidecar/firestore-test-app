import { Timestamp } from "firebase-admin/firestore";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { collections } from "../utils/collection-refs";

/**
 * Express middleware that validates request body against a Zod schema.
 */
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
}

export function logApiRequest(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();

  res.on("finish", () => {
    void collections.apiRequestLog.add({
      path: req.path,
      method: req.method,
      status: res.statusCode,
      latency_ms: Date.now() - startedAt,
      logged_at: Timestamp.now(),
    });
  });

  next();
}
