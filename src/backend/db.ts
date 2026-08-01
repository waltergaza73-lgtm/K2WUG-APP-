import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { initialUsers, initialServices, initialJobs, initialMarketplace, initialTransactions, initialBuyingMachines, initialActiveMachines } from './seedData';

// Storage file path for persistent JSON fallback
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'k2wug_db.json');

export interface LocalDatabase {
  users: any[];
  services: any[];
  jobs: any[];
  marketplace: any[];
  transactions: any[];
  contacts: any[];
  buyingMachines: any[];
  activeMachines: any[];
}

let dbMemory: LocalDatabase = {
  users: [...initialUsers],
  services: [...initialServices],
  jobs: [...initialJobs],
  marketplace: [...initialMarketplace],
  transactions: [...initialTransactions],
  contacts: [],
  buyingMachines: [...initialBuyingMachines],
  activeMachines: [...initialActiveMachines]
};

// Ensure data directory exists and read/write
function loadLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const loaded = JSON.parse(raw);
      dbMemory = {
        users: loaded.users || [...initialUsers],
        services: loaded.services || [...initialServices],
        jobs: loaded.jobs || [...initialJobs],
        marketplace: loaded.marketplace || [...initialMarketplace],
        transactions: loaded.transactions || [...initialTransactions],
        contacts: loaded.contacts || [],
        buyingMachines: loaded.buyingMachines || [...initialBuyingMachines],
        activeMachines: loaded.activeMachines || [...initialActiveMachines]
      };
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.warn('Local file DB load fallback:', err);
  }
}

export function saveLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbMemory, null, 2));
  } catch (err) {
    console.error('Error saving local database:', err);
  }
}

let isMongoConnected = false;

export async function initDatabase() {
  loadLocalDb();
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.startsWith('mongodb')) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isMongoConnected = true;
      console.log('✅ Successfully connected to MongoDB Atlas / Cluster!');
    } catch (err) {
      console.warn('⚠️ MongoDB connection attempt failed, defaulting to local JSON persistent engine:', (err as Error).message);
      isMongoConnected = false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI detected in environment. Using embedded MongoDB-compatible persistent JSON engine.');
  }
}

export function getLocalDb() {
  return dbMemory;
}

export function isUsingMongo() {
  return isMongoConnected;
}
