import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import BrandAsset from '../models/BrandAsset';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate);

// Multer setup for logos
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/logos'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `logo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/svg+xml', 'image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, SVG, and JPEG files are allowed.'));
    }
  },
});

// GET /api/brand
router.get('/', async (_req: AuthRequest, res) => {
  try {
    const assets = await BrandAsset.find({ active: true }).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand assets.' });
  }
});

// GET /api/brand/logo - get current active logo
router.get('/logo', async (_req: AuthRequest, res) => {
  try {
    const logo = await BrandAsset.findOne({ type: 'logo', active: true });
    res.json(logo || { url: '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logo.' });
  }
});

// POST /api/brand/logo - upload or replace logo
router.post('/logo', upload.single('logo'), async (req: AuthRequest, res) => {
  try {
    // Deactivate existing logos
    await BrandAsset.updateMany({ type: 'logo' }, { $set: { active: false } });

    let url = '';
    if (req.file) {
      url = `/uploads/logos/${req.file.filename}`;
    } else if (req.body.url) {
      url = req.body.url;
    } else {
      return res.status(400).json({ error: 'Logo file is required.' });
    }

    const asset = new BrandAsset({
      name: 'AEN Logo',
      type: 'logo',
      url,
      active: true,
      createdBy: req.userId,
    });

    await asset.save();
    res.status(201).json(asset);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload logo.' });
  }
});

export default router;
