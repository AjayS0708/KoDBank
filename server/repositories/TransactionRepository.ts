import db from "../config/db.ts";

export class TransactionRepository {
  static create(tx: any) {
    const stmt = db.prepare(`
      INSERT INTO transactions (reference_id, sender_id, receiver_id, amount, type, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(tx.reference_id, tx.sender_id, tx.receiver_id, tx.amount, tx.type, tx.status, tx.description);
  }

  static getByUserId(userId: number, limit = 10, offset = 0) {
    return db.prepare(`
      SELECT t.*, 
             s.username as sender_name, 
             r.username as receiver_name 
      FROM transactions t
      LEFT JOIN users s ON t.sender_id = s.id
      LEFT JOIN users r ON t.receiver_id = r.id
      WHERE t.sender_id = ? OR t.receiver_id = ?
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, userId, limit, offset);
  }

  static getCountByUserId(userId: number) {
    const res: any = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE sender_id = ? OR receiver_id = ?").get(userId, userId);
    return res.count;
  }
}
