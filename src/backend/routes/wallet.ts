import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getLocalDb, saveLocalDb, isUsingMongo } from '../db';
import { UserModel, TransactionModel } from '../models';

export const walletRouter = Router();

// GET WALLET BALANCE & TRANSACTIONS
walletRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;
    const uid = (userId as string) || 'usr_demo_101';

    if (isUsingMongo()) {
      let user = null;
      if (mongoose.Types.ObjectId.isValid(uid)) {
        user = await UserModel.findById(uid).exec();
      }
      if (!user) {
        user = await UserModel.findOne().exec();
      }

      if (!user) {
        res.status(404).json({ error: 'User wallet not found.' });
        return;
      }

      const txs = await TransactionModel.find({ userId: user._id.toString() }).sort({ createdAt: -1 }).exec();
      res.json({
        walletBalance: user.walletBalance,
        transactions: txs.map((t) => ({ ...t.toObject(), id: t._id.toString() }))
      });
    } else {
      const db = getLocalDb();
      const user = db.users.find((u) => u.id === uid) || db.users[0];
      if (!user) {
        res.status(404).json({ error: 'User wallet not found.' });
        return;
      }

      const txs = db.transactions.filter((t) => t.userId === user.id);
      res.json({
        walletBalance: user.walletBalance,
        transactions: txs
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wallet info.' });
  }
});

// DEPOSIT FUNDS
walletRouter.post('/deposit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, amount, paymentMethod } = req.body;

    if (!amount || Number(amount) <= 0) {
      res.status(400).json({ error: 'Deposit amount must be greater than 0.' });
      return;
    }

    const numAmount = Number(amount);
    const method = paymentMethod || 'Mobile Money (M-Pesa / MTN)';

    if (isUsingMongo()) {
      let user = null;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        user = await UserModel.findById(userId).exec();
      }
      if (!user) {
        user = await UserModel.findOne().exec();
      }

      if (!user) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      user.walletBalance += numAmount;
      await user.save();

      const tx = await TransactionModel.create({
        userId: user._id.toString(),
        type: 'deposit',
        amount: numAmount,
        title: `Wallet Deposit via ${method}`,
        recipientOrSender: method,
        status: 'completed'
      });

      res.json({
        message: 'Deposit successful!',
        walletBalance: user.walletBalance,
        transaction: { ...tx.toObject(), id: tx._id.toString() }
      });
    } else {
      const db = getLocalDb();
      const uid = userId || 'usr_demo_101';
      const user = db.users.find((u) => u.id === uid) || db.users[0];

      if (!user) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      user.walletBalance += numAmount;

      const tx = {
        id: 'tx_' + Date.now(),
        userId: user.id,
        type: 'deposit' as const,
        amount: numAmount,
        title: `Wallet Deposit via ${method}`,
        recipientOrSender: method,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      };

      db.transactions.unshift(tx);
      saveLocalDb();

      res.json({
        message: 'Deposit successful!',
        walletBalance: user.walletBalance,
        transaction: tx
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error depositing funds.' });
  }
});

// WITHDRAW FUNDS
walletRouter.post('/withdraw', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, amount, destination } = req.body;

    if (!amount || Number(amount) <= 0) {
      res.status(400).json({ error: 'Withdrawal amount must be greater than 0.' });
      return;
    }

    const numAmount = Number(amount);
    const dest = destination || 'M-Pesa / Bank Account';

    if (isUsingMongo()) {
      let user = null;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        user = await UserModel.findById(userId).exec();
      }
      if (!user) {
        user = await UserModel.findOne().exec();
      }

      if (!user) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      if (user.walletBalance < numAmount) {
        res.status(400).json({ error: 'Insufficient wallet balance.' });
        return;
      }

      user.walletBalance -= numAmount;
      await user.save();

      const tx = await TransactionModel.create({
        userId: user._id.toString(),
        type: 'withdrawal',
        amount: -numAmount,
        title: `Cashout to ${dest}`,
        recipientOrSender: dest,
        status: 'completed'
      });

      res.json({
        message: 'Withdrawal successful!',
        walletBalance: user.walletBalance,
        transaction: { ...tx.toObject(), id: tx._id.toString() }
      });
    } else {
      const db = getLocalDb();
      const uid = userId || 'usr_demo_101';
      const user = db.users.find((u) => u.id === uid) || db.users[0];

      if (!user) {
        res.status(404).json({ error: 'User account not found.' });
        return;
      }

      if (user.walletBalance < numAmount) {
        res.status(400).json({ error: 'Insufficient wallet balance.' });
        return;
      }

      user.walletBalance -= numAmount;

      const tx = {
        id: 'tx_' + Date.now(),
        userId: user.id,
        type: 'withdrawal' as const,
        amount: -numAmount,
        title: `Cashout to ${dest}`,
        recipientOrSender: dest,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      };

      db.transactions.unshift(tx);
      saveLocalDb();

      res.json({
        message: 'Withdrawal successful!',
        walletBalance: user.walletBalance,
        transaction: tx
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error withdrawing funds.' });
  }
});

// PEER TO PEER TRANSFER
walletRouter.post('/transfer', async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, recipientEmail, amount, note } = req.body;

    if (!recipientEmail || !amount || Number(amount) <= 0) {
      res.status(400).json({ error: 'Recipient email and valid transfer amount required.' });
      return;
    }

    const numAmount = Number(amount);
    const cleanEmail = recipientEmail.toLowerCase().trim();

    if (isUsingMongo()) {
      let sender = null;
      if (senderId && mongoose.Types.ObjectId.isValid(senderId)) {
        sender = await UserModel.findById(senderId).exec();
      }
      if (!sender) {
        sender = await UserModel.findOne().exec();
      }

      if (!sender) {
        res.status(404).json({ error: 'Sender account not found.' });
        return;
      }

      if (sender.walletBalance < numAmount) {
        res.status(400).json({ error: 'Insufficient wallet balance for transfer.' });
        return;
      }

      const recipient = await UserModel.findOne({ email: cleanEmail }).exec();
      if (!recipient) {
        res.status(404).json({ error: 'Recipient user not found on K2WUG platform.' });
        return;
      }

      // Execute transfer
      sender.walletBalance -= numAmount;
      await sender.save();

      recipient.walletBalance += numAmount;
      await recipient.save();

      // Sender transaction record
      await TransactionModel.create({
        userId: sender._id.toString(),
        type: 'transfer',
        amount: -numAmount,
        title: `Sent to ${recipient.name}`,
        recipientOrSender: recipient.email,
        status: 'completed'
      });

      // Recipient transaction record
      await TransactionModel.create({
        userId: recipient._id.toString(),
        type: 'transfer',
        amount: numAmount,
        title: `Received from ${sender.name}`,
        recipientOrSender: sender.email,
        status: 'completed'
      });

      res.json({
        message: `Successfully transferred $${numAmount.toFixed(2)} to ${recipient.name}!`,
        walletBalance: sender.walletBalance
      });
    } else {
      const db = getLocalDb();
      const uid = senderId || 'usr_demo_101';
      const sender = db.users.find((u) => u.id === uid) || db.users[0];

      if (!sender) {
        res.status(404).json({ error: 'Sender account not found.' });
        return;
      }

      if (sender.walletBalance < numAmount) {
        res.status(400).json({ error: 'Insufficient wallet balance.' });
        return;
      }

      const recipient = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!recipient) {
        res.status(404).json({ error: 'Recipient user not found on K2WUG platform.' });
        return;
      }

      sender.walletBalance -= numAmount;
      recipient.walletBalance += numAmount;

      db.transactions.unshift({
        id: 'tx_' + Date.now() + '_s',
        userId: sender.id,
        type: 'transfer' as const,
        amount: -numAmount,
        title: `Sent to ${recipient.name}`,
        recipientOrSender: recipient.email,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      });

      db.transactions.unshift({
        id: 'tx_' + Date.now() + '_r',
        userId: recipient.id,
        type: 'transfer' as const,
        amount: numAmount,
        title: `Received from ${sender.name}`,
        recipientOrSender: sender.email,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      });

      saveLocalDb();

      res.json({
        message: `Successfully transferred $${numAmount.toFixed(2)} to ${recipient.name}!`,
        walletBalance: sender.walletBalance
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error processing transfer.' });
  }
});
