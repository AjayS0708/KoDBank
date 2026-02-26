import db from "../config/db.ts";

export class TokenRepository {
  static create(userId: number, token: string, expiresAt: string) {
    return db.prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);
  }

  static findByToken(token: string) {
    return db.prepare("SELECT * FROM refresh_tokens WHERE token = ? AND revoked_at IS NULL").get(token);
  }

  static revoke(token: string) {
    return db.prepare("UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE token = ?").run(token);
  }

  static revokeAllForUser(userId: number) {
    return db.prepare("UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ?").run(userId);
  }
}
