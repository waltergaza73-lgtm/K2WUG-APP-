import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'individual' | 'provider' | 'employer';
  phone: string;
  location: string;
  avatar: string;
  bio: string;
  skills: string[];
  walletBalance: number;
  createdAt: Date;
}

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  price: number;
  priceUnit: 'hr' | 'fixed' | 'day';
  providerId: string;
  providerName: string;
  providerRating: number;
  providerAvatar: string;
  location: string;
  tags: string[];
  imageUrl: string;
  available: boolean;
  createdAt: Date;
}

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  category: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  employerId: string;
  applicationsCount: number;
  createdAt: Date;
}

export interface IMarketItem extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  imageUrl: string;
  status: 'available' | 'sold';
  createdAt: Date;
}

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'transfer' | 'earned';
  amount: number;
  title: string;
  recipientOrSender?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['individual', 'provider', 'employer'], default: 'individual' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceUnit: { type: String, enum: ['hr', 'fixed', 'day'], default: 'fixed' },
  providerId: { type: String, required: true },
  providerName: { type: String, required: true },
  providerRating: { type: Number, default: 5.0 },
  providerAvatar: { type: String, default: '' },
  location: { type: String, default: '' },
  tags: [{ type: String }],
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], default: 'Full-time' },
  location: { type: String, default: '' },
  salaryRange: { type: String, default: '' },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  employerId: { type: String, required: true },
  applicationsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MarketItemSchema = new Schema<IMarketItem>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], default: 'Good' },
  description: { type: String, required: true },
  sellerId: { type: String, required: true },
  sellerName: { type: String, required: true },
  sellerLocation: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'payment', 'transfer', 'earned'], required: true },
  amount: { type: Number, required: true },
  title: { type: String, required: true },
  recipientOrSender: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>('User', UserSchema);
export const ServiceModel: Model<IService> = mongoose.models.Service as Model<IService> || mongoose.model<IService>('Service', ServiceSchema);
export const JobModel: Model<IJob> = mongoose.models.Job as Model<IJob> || mongoose.model<IJob>('Job', JobSchema);
export const MarketItemModel: Model<IMarketItem> = mongoose.models.MarketItem as Model<IMarketItem> || mongoose.model<IMarketItem>('MarketItem', MarketItemSchema);
export const TransactionModel: Model<ITransaction> = mongoose.models.Transaction as Model<ITransaction> || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const ContactModel: Model<IContact> = mongoose.models.Contact as Model<IContact> || mongoose.model<IContact>('Contact', ContactSchema);
