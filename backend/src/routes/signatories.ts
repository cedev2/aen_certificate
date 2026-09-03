import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import Signatory from '../models/Signatory';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
router.use(authenticate);

// Multer setup for signatures
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/signatures'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `sig-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and SVG files are allowed.'));
    }
  },
});

// GET /api/signatories
router.get('/', async (_req: AuthRequest, res) => {
  try {
    const signatories = await Signatory.find({ active: true }).sort({ createdAt: -1 });
    res.json(signatories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signatories.' });
  }
});

// POST /api/signatories
router.post('/', upload.single('signature'), async (req: AuthRequest, res) => {
  try {
    const { name, title } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required.' });
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    let signatureUrl = '';
    if (req.file) {
      signatureUrl = `/uploads/signatures/${req.file.filename}`;
    } else if (req.body.signatureUrl) {
      signatureUrl = req.body.signatureUrl;
    } else {
      return res.status(400).json({ error: 'Signature image is required.' });
    }

    const signatory = new Signatory({
      name,
      title,
      signatureUrl,
      createdBy: req.userId,
    });

    await signatory.save();
    res.status(201).json(signatory);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create signatory.' });
  }
});

// PUT /api/signatories/:id
router.put('/:id', upload.single('signature'), async (req: AuthRequest, res) => {
  try {
    const updateData: any = { name: req.body.name, title: req.body.title };
    if (req.file) {
      updateData.signatureUrl = `/uploads/signatures/${req.file.filename}`;
    }

    const signatory = await Signatory.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!signatory) return res.status(404).json({ error: 'Signatory not found.' });
    res.json(signatory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update signatory.' });
  }
});

// DELETE /api/signatories/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const signatory = await Signatory.findByIdAndUpdate(
      req.params.id,
      { $set: { active: false } },
      { new: true }
    );
    if (!signatory) return res.status(404).json({ error: 'Signatory not found.' });
    res.json({ message: 'Signatory deactivated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete signatory.' });
  }
});

export default router;
