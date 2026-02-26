import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserRepository } from "../repositories/UserRepository.ts";
import { TokenRepository } from "../repositories/TokenRepository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { CONFIG } from "../config/constants.ts";

export class AuthService {
  static async register(userData: any) {
    const existingUser = UserRepository.findByUsername(userData.username);
    if (existingUser) throw new ApiError(400, "Username already exists");

    const passwordHash = await bcrypt.hash(userData.password, CONFIG.SECURITY.BCRYPT_ROUNDS);
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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    TokenRepository.create(user.id, refreshToken, expiresAt);

    return { user: { id: user.id, username: user.username, role: user.role, uid: user.uid }, accessToken, refreshToken };
  }

  static generateAccessToken(user: any) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role, uid: user.uid },
      CONFIG.JWT.ACCESS_SECRET,
      { expiresIn: CONFIG.JWT.ACCESS_EXPIRY }
    );
  }

  static generateRefreshToken(user: any) {
    return jwt.sign(
      { id: user.id },
      CONFIG.JWT.REFRESH_SECRET,
      { expiresIn: CONFIG.JWT.REFRESH_EXPIRY }
    );
  }

  static async refresh(token: string) {
    const tokenData: any = TokenRepository.findByToken(token);
    
    // REUSE DETECTION: If token is not in DB but is valid, it might have been reused/stolen.
    if (!tokenData) {
      try {
        const decoded: any = jwt.verify(token, CONFIG.JWT.REFRESH_SECRET);
        // Revoke all tokens for this user as a safety measure
        TokenRepository.revokeAllForUser(decoded.id);
        throw new ApiError(401, "Token reuse detected. All sessions revoked.");
      } catch (err) {
        throw new ApiError(401, "Invalid refresh token");
      }
    }

    try {
      const decoded: any = jwt.verify(token, CONFIG.JWT.REFRESH_SECRET);
      const user = UserRepository.findById(decoded.id);
      if (!user) throw new ApiError(401, "User not found");

      // ROTATION: Revoke old token and issue new one
      TokenRepository.revoke(token);
      
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      TokenRepository.create(user.id, newRefreshToken, expiresAt);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new ApiError(401, "Refresh token expired");
    }
  }

  static async logout(token: string) {
    TokenRepository.revoke(token);
  }
}
