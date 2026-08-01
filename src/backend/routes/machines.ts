import { Router } from 'express';
import { getLocalDb, saveLocalDb } from '../db';

export const machinesRouter = Router();

// GET /api/machines - List catalog of SK Buying Machines
machinesRouter.get('/', (req, res) => {
  try {
    const db = getLocalDb();
    res.json({ machines: db.buyingMachines || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch machines catalog' });
  }
});

// GET /api/machines/active - Get user's active machines
machinesRouter.get('/active', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    const db = getLocalDb();
    const active = (db.activeMachines || []).filter((m) => m.userId === userId);
    res.json({ activeMachines: active });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active machines' });
  }
});

// POST /api/machines/buy - Rent / Purchase a machine plan
machinesRouter.post('/buy', (req, res) => {
  try {
    const { userId, machineId } = req.body;
    if (!userId || !machineId) {
      return res.status(400).json({ error: 'userId and machineId are required' });
    }

    const db = getLocalDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const machine = db.buyingMachines.find((m) => m.id === machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine plan not found' });
    }

    if (user.walletBalance < machine.price) {
      return res.status(400).json({
        error: `Insufficient wallet balance. You need $${machine.price.toFixed(2)}, but your current balance is $${user.walletBalance.toFixed(2)}. Please recharge your wallet first.`
      });
    }

    // Deduct wallet balance
    user.walletBalance = Number((user.walletBalance - machine.price).toFixed(2));

    // Create new active machine instance
    const newActiveMachine = {
      id: 'act_m_' + Date.now(),
      userId,
      machineId: machine.id,
      machineName: `${machine.name} ($${machine.price} / ${machine.durationDays} Days)`,
      purchasePrice: machine.price,
      dailyIncome: machine.dailyIncome,
      durationDays: machine.durationDays,
      daysCompleted: 0,
      totalEarnedSoFar: 0,
      purchaseDate: new Date().toISOString(),
      lastClaimDate: null,
      canClaimToday: true,
      status: 'active'
    };

    if (!db.activeMachines) db.activeMachines = [];
    db.activeMachines.push(newActiveMachine);

    // Record purchase transaction
    const newTransaction = {
      id: 'tx_mach_' + Date.now(),
      userId,
      type: 'payment',
      amount: -machine.price,
      title: `SK Machine Purchase - ${machine.name} ($${machine.price})`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTransaction);
    saveLocalDb();

    res.json({
      message: `Successfully activated ${machine.name}! $${machine.price} debited from wallet.`,
      activeMachine: newActiveMachine,
      walletBalance: user.walletBalance
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process machine purchase' });
  }
});

// POST /api/machines/claim - Claim daily profit yield
machinesRouter.post('/claim', (req, res) => {
  try {
    const { userId, activeMachineId } = req.body;
    if (!userId || !activeMachineId) {
      return res.status(400).json({ error: 'userId and activeMachineId are required' });
    }

    const db = getLocalDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const machine = (db.activeMachines || []).find((m) => m.id === activeMachineId && m.userId === userId);
    if (!machine) {
      return res.status(404).json({ error: 'Active machine not found' });
    }

    if (machine.status === 'completed') {
      return res.status(400).json({ error: 'This SK Machine plan has already completed its full duration.' });
    }

    if (!machine.canClaimToday && machine.lastClaimDate) {
      const last = new Date(machine.lastClaimDate).getTime();
      const now = Date.now();
      const hoursSince = (now - last) / (1000 * 3600);
      if (hoursSince < 24) {
        return res.status(400).json({
          error: `Daily profit already claimed for today! Next yield available in ${Math.ceil(24 - hoursSince)} hours.`
        });
      }
    }

    // Add daily income
    const claimAmount = machine.dailyIncome;
    user.walletBalance = Number((user.walletBalance + claimAmount).toFixed(2));

    machine.daysCompleted += 1;
    machine.totalEarnedSoFar = Number((machine.totalEarnedSoFar + claimAmount).toFixed(2));
    machine.lastClaimDate = new Date().toISOString();
    machine.canClaimToday = false;

    if (machine.daysCompleted >= machine.durationDays) {
      machine.status = 'completed';
    }

    // Record yield transaction
    const newTransaction = {
      id: 'tx_yield_' + Date.now(),
      userId,
      type: 'earned',
      amount: claimAmount,
      title: `Daily Profit Claim - ${machine.machineName}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTransaction);
    saveLocalDb();

    res.json({
      message: `Successfully collected $${claimAmount.toFixed(2)} daily profit into your wallet!`,
      walletBalance: user.walletBalance,
      updatedMachine: machine
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to claim daily machine profit' });
  }
});
