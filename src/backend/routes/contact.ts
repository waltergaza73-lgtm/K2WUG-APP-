import { Router, Request, Response } from 'express';
import { getLocalDb, saveLocalDb, isUsingMongo } from '../db';
import { ContactModel } from '../models';

export const contactRouter = Router();

contactRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    if (isUsingMongo()) {
      const msg = await ContactModel.create({ name, email, subject: subject || 'General Inquiry', message });
      res.status(201).json({ message: 'Thank you for reaching out! Our team will respond shortly.', contactId: msg._id.toString() });
    } else {
      const db = getLocalDb();
      const newContact = {
        id: 'msg_' + Date.now(),
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        createdAt: new Date().toISOString()
      };

      db.contacts.unshift(newContact);
      saveLocalDb();
      res.status(201).json({ message: 'Thank you for reaching out! Our regional support team will get back to you shortly.', contactId: newContact.id });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact inquiry.' });
  }
});

contactRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (isUsingMongo()) {
      const list = await ContactModel.find().sort({ createdAt: -1 });
      res.json(list.map((c) => ({ ...c.toObject(), id: c._id.toString() })));
    } else {
      const db = getLocalDb();
      res.json(db.contacts);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});
