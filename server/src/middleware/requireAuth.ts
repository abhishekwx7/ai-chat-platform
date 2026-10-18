import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        res.locals.user = session.user;

        next()
    } catch (error) {
        console.error("Authentication error:", error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
}