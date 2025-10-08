import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";
import { createAccessToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

export async function registerUser(email, password) {
    email = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (existingUser) {
        const error = new Error("Email already exists");
        error.code = "EMAIL_EXISTS";
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        return await prisma.user.create({
            data: { email, passwordHash },
            select: { id: true, email: true, createdAt: true },
        });
    } catch (error) {
        if (error.code === "P2002") {
            const conflict = new Error("Email already exists");
            conflict.code = "EMAIL_EXISTS";
            throw conflict;
        }

        throw error;
    }
}

export async function loginUser(email, password) {
  email = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
  });

  if (!user) {
      const error = new Error("Invalid credentials");
      error.code = "INVALID_CREDENTIALS";
      throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
      const error = new Error("Invalid credentials");
      error.code = "INVALID_CREDENTIALS";
      throw error;
  }

  const accessToken = createAccessToken({ id: user.id, email: user.email });
  return { accessToken };
}