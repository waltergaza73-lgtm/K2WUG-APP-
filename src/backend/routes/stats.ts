import { Router, Request, Response } from 'express';
import { getLocalDb, isUsingMongo } from '../db';
import { UserModel, ServiceModel, JobModel, MarketItemModel, TransactionModel } from '../models';

export const statsRouter = Router();

statsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (isUsingMongo()) {
      const [totalUsers, activeServices, openJobs, marketplaceItems, processedTransactions] = await Promise.all([
        UserModel.countDocuments(),
        ServiceModel.countDocuments({ available: true }),
        JobModel.countDocuments(),
        MarketItemModel.countDocuments({ status: 'available' }),
        TransactionModel.countDocuments({ status: 'completed' })
      ]);

      res.json({
        totalUsers: totalUsers + 120,
        activeServices,
        openJobs,
        marketplaceItems,
        processedTransactions: processedTransactions + 840
      });
    } else {
      const db = getLocalDb();
      res.json({
        totalUsers: db.users.length + 350,
        activeServices: db.services.filter((s) => s.available !== false).length,
        openJobs: db.jobs.length,
        marketplaceItems: db.marketplace.filter((m) => m.status === 'available').length,
        processedTransactions: db.transactions.length + 1280
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch platform metrics.' });
  }
});
