import jwt from "jsonwebtoken";

export const verifyRequestOrigin = (allowedOrigins) => (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.get("Origin");
    if (origin && !allowedOrigins.has(origin)) {
      return res.status(403).json({ error: "Request origin is not allowed" });
    }
  }
  return next();
};

export const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ error: "Authentication is not configured" });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (!payload || typeof payload === "string" || !payload.userId) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
};
