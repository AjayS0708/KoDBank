import { v4 as uuidv4 } from "uuid";
import db from "../config/db.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { TransactionRepository } from "../repositories/TransactionRepository.ts";
import { ApiError } from "../utils/ApiError.ts";

export class BankingService {
  static async transfer(senderId: number, receiverUsername: string, amount: number, description: string) {
    if (amount <= 0) throw new ApiError(400, "Amount must be positive");

    const sender: any = UserRepository.findById(senderId);
    if (sender.balance < amount) throw new ApiError(400, "Insufficient balance");

    const receiver: any = UserRepository.findByUsername(receiverUsername);
    if (!receiver) throw new ApiError(404, "Receiver not found");
    if (sender.id === receiver.id) throw new ApiError(400, "Cannot transfer to yourself");

    const referenceId = uuidv4();

    // Use a transaction for atomicity
    const transaction = db.transaction(() => {
      UserRepository.updateBalance(sender.id, -amount);
      UserRepository.updateBalance(receiver.id, amount);
      
      TransactionRepository.create({
        reference_id: referenceId,
        sender_id: sender.id,
        receiver_id: receiver.id,
        amount,
        type: 'TRANSFER',
        status: 'COMPLETED',
        description
      });
    });

    transaction();
    return { referenceId };
  }

  static async getHistory(userId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const transactions = TransactionRepository.getByUserId(userId, limit, offset);
    const total = TransactionRepository.getCountByUserId(userId);
    
    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getBalance(userId: number) {
    const user: any = UserRepository.findById(userId);
    return user.balance;
  }
}
