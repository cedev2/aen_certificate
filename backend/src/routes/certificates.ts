import { Router } from 'express';
import Certificate from '../models/Certificate';
import Signatory from '../models/Signatory';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { generateCertificateId, generateQrData } from '../utils/certificate';
import { generatePdf } from '../utils/pdfGenerator';

const router = Router();

// All routes require auth
router.use(authenticate);

// GET /api/certificates - list certificates with search
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, status, page = '1', limit = '20' } = req.query;
    const query: any = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } },
        { award: { $regex: search, $options: 'i' } },
        { eventName: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('signatoryIds', 'name title signatureUrl'),
      Certificate.countDocuments(query),
    ]);

    res.json({
      certificates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch certificates.' });
  }
});

// GET /api/certificates/stats
router.get('/stats', async (_req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, generatedToday, drafts, currentEvent] = await Promise.all([
      Certificate.countDocuments({ status: { $ne: 'revoked' } }),
      Certificate.countDocuments({ createdAt: { $gte: today }, status: { $ne: 'revoked' } }),
      Certificate.countDocuments({ status: 'draft' }),
      Certificate.countDocuments({ status: { $ne: 'revoked' } }),
    ]);

    res.json({ total, generatedToday, drafts, currentEvent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// GET /api/certificates/:id
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
      .populate('signatoryIds', 'name title signatureUrl');
    if (!cert) return res.status(404).json({ error: 'Certificate not found.' });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificate.' });
  }
});

// POST /api/certificates
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      recipientName,
      certificateType,
      award,
      eventName,
      description,
      eventDate,
      issueDate,
      signatoryIds,
    } = req.body;

    if (!recipientName) return res.status(400).json({ error: 'Recipient name is required.' });
    if (!certificateType) return res.status(400).json({ error: 'Certificate type is required.' });
    if (!award) return res.status(400).json({ error: 'Award is required.' });
    if (!eventName) return res.status(400).json({ error: 'Event name is required.' });

    const certificateId = generateCertificateId();
    const qrData = generateQrData({
      certificateId,
      recipientName,
      award,
      eventName,
      issueDate: issueDate || new Date(),
    });

    const certificate = new Certificate({
      certificateId,
      recipientName,
      certificateType,
      award,
      eventName,
      description: description || '',
      eventDate: eventDate || new Date(),
      issueDate: issueDate || new Date(),
      signatoryIds: signatoryIds || [],
      qrData,
      status: 'generated',
      createdBy: req.userId,
    });

    await certificate.save();

    const populated = await Certificate.findById(certificate._id)
      .populate('signatoryIds', 'name title signatureUrl');

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create certificate.' });
  }
});

// PUT /api/certificates/:id
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('signatoryIds', 'name title signatureUrl');

    if (!cert) return res.status(404).json({ error: 'Certificate not found.' });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update certificate.' });
  }
});

// POST /api/certificates/:id/revoke
router.post('/:id/revoke', async (req: AuthRequest, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'revoked' } },
      { new: true }
    ).populate('signatoryIds', 'name title signatureUrl');

    if (!cert) return res.status(404).json({ error: 'Certificate not found.' });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke certificate.' });
  }
});

// DELETE /api/certificates/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certificate not found.' });
    res.json({ message: 'Certificate deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

// GET /api/certificates/:id/pdf
router.get('/:id/pdf', async (req: AuthRequest, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
      .populate('signatoryIds', 'name title signatureUrl');

    if (!cert) return res.status(404).json({ error: 'Certificate not found.' });

    const pdfBuffer = await generatePdf({
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      certificateType: cert.certificateType,
      award: cert.award,
      eventName: cert.eventName,
      description: cert.description,
      eventDate: cert.eventDate,
      issueDate: cert.issueDate,
      logoUrl: '',
      signatories: (cert.signatoryIds as any[]) || [],
    });

    const safeName = cert.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_${safeName}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

export default router;
