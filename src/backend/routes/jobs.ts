import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getLocalDb, saveLocalDb, isUsingMongo } from '../db';
import { JobModel } from '../models';

export const jobsRouter = Router();

// GET JOBS
jobsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, type, search } = req.query;

    if (isUsingMongo()) {
      let query: any = {};
      if (category && category !== 'All') query.category = category;
      if (type && type !== 'All') query.type = type;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const jobs = await JobModel.find(query).sort({ createdAt: -1 }).exec();
      res.json(jobs.map((j) => ({ ...j.toObject(), id: j._id.toString() })));
    } else {
      const db = getLocalDb();
      let list = [...db.jobs];

      if (category && category !== 'All') {
        list = list.filter((j) => j.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (type && type !== 'All') {
        list = list.filter((j) => j.type.toLowerCase() === (type as string).toLowerCase());
      }
      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter((j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
        );
      }

      res.json(list);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job opportunities.' });
  }
});

// POST JOB
jobsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, company, category, type, location, salaryRange, description, requirements, employerId } = req.body;

    if (!title || !company || !description) {
      res.status(400).json({ error: 'Title, company, and description are required.' });
      return;
    }

    if (isUsingMongo()) {
      const job = await JobModel.create({
        title,
        company,
        category: category || 'General',
        type: type || 'Full-time',
        location: location || 'Remote / Regional',
        salaryRange: salaryRange || 'Negotiable',
        description,
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map((r: string) => r.trim()) : []),
        employerId: employerId || 'usr_demo_101',
        applicationsCount: 0
      });
      res.status(201).json({ ...job.toObject(), id: job._id.toString() });
    } else {
      const db = getLocalDb();
      const job = {
        id: 'job_' + Date.now(),
        title,
        company,
        category: category || 'General',
        type: type || 'Full-time',
        location: location || 'Remote / Regional',
        salaryRange: salaryRange || 'Negotiable',
        description,
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map((r: string) => r.trim()) : []),
        employerId: employerId || 'usr_demo_101',
        applicationsCount: 0,
        createdAt: new Date().toISOString()
      };

      db.jobs.unshift(job);
      saveLocalDb();
      res.status(201).json(job);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to post job.' });
  }
});

// APPLY FOR JOB
jobsRouter.post('/:id/apply', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isUsingMongo()) {
      let job = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        job = await JobModel.findByIdAndUpdate(id, { $inc: { applicationsCount: 1 } }, { new: true }).exec();
      }
      if (!job) {
        res.status(404).json({ error: 'Job not found.' });
        return;
      }
      res.json({ message: 'Application submitted successfully!', applicationsCount: job.applicationsCount });
    } else {
      const db = getLocalDb();
      const job = db.jobs.find((j) => j.id === id);
      if (!job) {
        res.status(404).json({ error: 'Job not found.' });
        return;
      }

      job.applicationsCount = (job.applicationsCount || 0) + 1;
      saveLocalDb();
      res.json({ message: 'Application submitted successfully!', applicationsCount: job.applicationsCount });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error applying for job.' });
  }
});
