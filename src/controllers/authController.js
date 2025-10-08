import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    let { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "이메일과 비밀번호는 필수입니다" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "이메일과 비밀번호는 필수입니다" });
    }

    // (선택) 최소 길이
    if (password.length < 8) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "비밀번호는 8자 이상이어야 합니다" });
    }

    const user = await authService.registerUser(email, password);
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "EMAIL_EXISTS") {
      return res.status(409).json({ code: "EMAIL_EXISTS", message: "이미 등록된 이메일입니다" });
    }
    return next(error);
  }
}