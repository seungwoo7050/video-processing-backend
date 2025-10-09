import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const unauthorizedResponse = {
  code: "UNAUTHORIZED",
  message: "인증이 필요합니다"
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);

  if (!match) {
    return res.status(401).json(unauthorizedResponse);
  }

  const token = match[1].trim();
  if (!token) {
    return res.status(401).json(unauthorizedResponse);
  }

  let payload;

  try {
    payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  } catch {
    return res.status(401).json(unauthorizedResponse);
  }

  if (!payload || typeof payload === "string") {
    return res.status(401).json(unauthorizedResponse);
  }

  const rawId = payload.sub ?? payload.id;
  const id = Number.parseInt(String(rawId), 10);
  if (!Number.isSafeInteger(id)) {
    return res.status(401).json(unauthorizedResponse);
  }

  req.user = {
    id,
    role: payload.role ?? "user",
  };

  return next();
}

export default authenticate;