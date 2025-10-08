import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createAccessToken({ id, email }) {
  return jwt.sign(
    {
      sub: String(id),
      email,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}