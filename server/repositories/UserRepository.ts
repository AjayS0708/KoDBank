import db from "../config/db.ts";

export class UserRepository {
  static findByUsername(username: string) {
    return db.prepare("SELECT * FROM users WHERE username = ? AND deleted_at IS NULL").get(username);
  }

  static findByEmail(email: string) {
    return db.prepare("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL").get(email);
  }

  static findById(id: number) {
    return db.prepare("SELECT * FROM users WHERE id = ? AND deleted_at IS NULL").get(id);
  }

  static findByUid(uid: string) {
    return db.prepare("SELECT * FROM users WHERE uid = ? AND deleted_at IS NULL").get(uid);
  }

  static create(user: any) {
    const stmt = db.prepare(`
      INSERT INTO users (uid, username, email, password_hash, phone, role, balance)
      VALUES (@uid, @username, @email, @password_hash, @phone, @role, @balance)
    `);
    
    return stmt.run({
      uid: user.uid,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      phone: user.phone || null,
      role: user.role || 'customer',
      balance: user.balance || 100000.0
    });
  }

  static updateBalance(id: number, amount: number) {
    return db.prepare("UPDATE users SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(amount, id);
  }

  static getAll(limit = 10, offset = 0) {
    return db.prepare("SELECT id, uid, username, email, balance, role, status, created_at FROM users WHERE deleted_at IS NULL LIMIT ? OFFSET ?").all(limit, offset);
  }
}
