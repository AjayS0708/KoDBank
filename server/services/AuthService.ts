import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../repositories/UserRepository.ts";
import { TokenRepository } from "../repositories/TokenRepository.ts";
import { ApiError } from "../utils/ApiError.ts";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access-secret-123";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret-456";

export class AuthService {
  static async register(userData: any) {
    const existingUser = UserRepository.findByUsername(userData.username);
    if (existingUser) throw new ApiError(400, "Username already exists");

    const passwordHash = await bcrypt.hash(userData.password, 12);
    const uid = uuidv4();

    UserRepository.create({
      ...userData,
      uid,
      password_hash: passwordHash,
      role: userData.role || 'customer'
    });

    return { uid, username: userData.username };
  }

  static async login(username: string, password: string) {
    const user: any = UserRepository.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token with 7 days expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    TokenRepository.create(user.id, refreshToken, expiresAt);

    return { user: { id: user.id, username: user.username, role: user.role, uid: user.uid }, accessToken, refreshToken };
  }

  static generateAccessToken(user: any) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role, uid: user.uid },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  }

  static generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }

  static async refresh(token: string) {
    const tokenData: any = TokenRepository.findByToken(token);
    if (!tokenData) throw new ApiError(401, "Invalid refresh token");

    try {
      const decoded: any = jwt.verify(token, REFRESH_TOKEN_SECRET);
      const user = UserRepository.findById(decoded.id);
      if (!user) throw new ApiError(401, "User not found");

      const newAccessToken = this.generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch (err) {
      throw new ApiError(401, "Refresh token expired");
    }
  }

  static async logout(token: string) {
    TokenRepository.revoke(token);
  }
}
