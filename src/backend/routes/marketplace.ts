import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getLocalDb, saveLocalDb, isUsingMongo } from '../db';
import { MarketItemModel, UserModel, TransactionModel } from '../models';

export const marketplaceRouter = Router();

// GET MARKETPLACE ITEMS
marketplaceRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    if (isUsingMongo()) {
      let query: any = { status: 'available' };
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const items = await MarketItemModel.find(query).sort({ createdAt: -1 }).exec();
      res.json(items.map((i) => ({ ...i.toObject(), id: i._id.toString() })));
    } else {
      const db = getLocalDb();
      let list = db.marketplace.filter((m) => m.status === 'available');

      if (category && category !== 'All') {
        list = list.filter((m) => m.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
      }

      res.json(list);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch marketplace items.' });
  }
});

// POST MARKETPLACE ITEM
marketplaceRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, price, condition, description, sellerId, sellerName, sellerLocation, imageUrl } = req.body;

    if (!title || !price || !description) {
      res.status(400).json({ error: 'Title, price, and description are required.' });
      return;
    }

    if (isUsingMongo()) {
      const item = await MarketItemModel.create({
        title,
        category: category || 'General Trade',
        price: Number(price),
        condition: condition || 'Good',
        description,
        sellerId: sellerId || 'usr_demo_101',
        sellerName: sellerName || 'K2WUG Seller',
        sellerLocation: sellerLocation || 'Nairobi, Kenya',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        status: 'available'
      });
      res.status(201).json({ ...item.toObject(), id: item._id.toString() });
    } else {
      const db = getLocalDb();
      const item = {
        id: 'mkt_' + Date.now(),
        title,
        category: category || 'General Trade',
        price: Number(price),
        condition: condition || 'Good',
        description,
        sellerId: sellerId || 'usr_demo_101',
        sellerName: sellerName || 'K2WUG Seller',
        sellerLocation: sellerLocation || 'Nairobi, Kenya',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        status: 'available' as const,
        createdAt: new Date().toISOString()
      };

      db.marketplace.unshift(item);
      saveLocalDb();
      res.status(201).json(item);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to list item.' });
  }
});

// BUY MARKETPLACE ITEM WITH DIGITAL WALLET
marketplaceRouter.post('/:id/buy', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { buyerId } = req.body;

    if (isUsingMongo()) {
      let item = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        item = await MarketItemModel.findById(id).exec();
      }
      if (!item || item.status !== 'available') {
        res.status(404).json({ error: 'Item unavailable or already sold.' });
        return;
      }

      let buyer = null;
      if (mongoose.Types.ObjectId.isValid(buyerId)) {
        buyer = await UserModel.findById(buyerId).exec();
      }
      if (!buyer) {
        res.status(404).json({ error: 'Buyer account not found.' });
        return;
      }

      if (buyer.walletBalance < item.price) {
        res.status(400).json({ error: 'Insufficient wallet funds to complete purchase.' });
        return;
      }

      // Deduct wallet and update status
      buyer.walletBalance -= item.price;
      await buyer.save();

      item.status = 'sold';
      await item.save();

      // Create transaction log
      await TransactionModel.create({
        userId: buyer._id.toString(),
        type: 'payment',
        amount: -item.price,
        title: `Purchased ${item.title}`,
        recipientOrSender: `Seller: ${item.sellerName}`,
        status: 'completed'
      });

      res.json({ message: 'Purchase successful!', item, remainingBalance: buyer.walletBalance });
    } else {
      const db = getLocalDb();
      const item = db.marketplace.find((m) => m.id === id);
      if (!item || item.status !== 'available') {
        res.status(404).json({ error: 'Item unavailable or already sold.' });
        return;
      }

      const buyer = db.users.find((u) => u.id === buyerId || u.id === 'usr_demo_101');
      if (!buyer) {
        res.status(404).json({ error: 'Buyer account not found.' });
        return;
      }

      if (buyer.walletBalance < item.price) {
        res.status(400).json({ error: 'Insufficient wallet funds.' });
        return;
      }

      buyer.walletBalance -= item.price;
      item.status = 'sold';

      db.transactions.unshift({
        id: 'tx_' + Date.now(),
        userId: buyer.id,
        type: 'payment',
        amount: -item.price,
        title: `Purchased ${item.title}`,
        recipientOrSender: `Seller: ${item.sellerName}`,
        status: 'completed',
        createdAt: new Date().toISOString()
      });

      saveLocalDb();
      res.json({ message: 'Purchase successful!', item, remainingBalance: buyer.walletBalance });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error processing purchase.' });
  }
});
