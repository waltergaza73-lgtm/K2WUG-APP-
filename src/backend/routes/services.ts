import { Router, Request, Response } from 'express';
import { getLocalDb, saveLocalDb, isUsingMongo } from '../db';
import { ServiceModel } from '../models';

export const servicesRouter = Router();

// GET ALL SERVICES
servicesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    if (isUsingMongo()) {
      let query: any = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }
      const services = await ServiceModel.find(query).sort({ createdAt: -1 });
      res.json(services.map((s) => ({ ...s.toObject(), id: s._id.toString() })));
    } else {
      const db = getLocalDb();
      let list = [...db.services];

      if (category && category !== 'All') {
        list = list.filter((s) => s.category.toLowerCase() === (category as string).toLowerCase());
      }

      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter((s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags?.some((t: string) => t.toLowerCase().includes(q))
        );
      }

      res.json(list);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

// CREATE SERVICE
servicesRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, description, price, priceUnit, providerId, providerName, providerAvatar, location, tags, imageUrl } = req.body;

    if (!title || !category || !description || price === undefined) {
      res.status(400).json({ error: 'Title, category, description, and price are required.' });
      return;
    }

    if (isUsingMongo()) {
      const newSrv = await ServiceModel.create({
        title,
        category,
        description,
        price: Number(price),
        priceUnit: priceUnit || 'fixed',
        providerId: providerId || 'usr_demo_101',
        providerName: providerName || 'K2WUG Member',
        providerRating: 5.0,
        providerAvatar: providerAvatar || '',
        location: location || 'Nairobi / Remote',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
        available: true
      });

      res.status(201).json({ ...newSrv.toObject(), id: newSrv._id.toString() });
    } else {
      const db = getLocalDb();
      const newSrv = {
        id: 'srv_' + Date.now(),
        title,
        category,
        description,
        price: Number(price),
        priceUnit: priceUnit || 'fixed',
        providerId: providerId || 'usr_demo_101',
        providerName: providerName || 'K2WUG Member',
        providerRating: 5.0,
        providerAvatar: providerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        location: location || 'East Africa Regional',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : ['Service']),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
        available: true,
        createdAt: new Date().toISOString()
      };

      db.services.unshift(newSrv);
      saveLocalDb();
      res.status(201).json(newSrv);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service.' });
  }
});
