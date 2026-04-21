import { Request, Response, NextFunction } from "express";
import { z } from "zod";

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
