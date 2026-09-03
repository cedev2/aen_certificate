import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin';
import Signatory from '../models/Signatory';
import Certificate from '../models/Certificate';
import BrandAsset from '../models/BrandAsset';
import { generateCertificateId, generateQrData } from '../utils/certificate';

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aen-certificates';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Signatory.deleteMany({});
    await Certificate.deleteMany({});
    await BrandAsset.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@AEN2026!', 12);
    const admin = await Admin.create({
      name: 'AEN Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@aen.org',
      passwordHash,
      role: 'admin',
    });
    console.log(`Created admin: ${admin.email}`);

    // Create signatories
    const signatory1 = await Signatory.create({
      name: 'Kwame Asante',
      title: 'Chief Executive Officer',
      signatureUrl: '',
      active: true,
      createdBy: admin._id,
    });

    const signatory2 = await Signatory.create({
      name: 'Amina Osei',
      title: 'Chief Technology Officer',
      signatureUrl: '',
      active: true,
      createdBy: admin._id,
    });

    console.log('Created 2 signatories');

    // Create demo certificates
    const certs = [
      {
        recipientName: 'NIBISHAKA Cedrick',
        certificateType: 'Certificate of Achievement',
        award: '1st Place - Innovation Award',
        eventName: 'AEN Community Hackathon 2026',
        description: 'In recognition of outstanding achievement, creativity, collaboration, and practical innovation in contributing to the African entrepreneurship ecosystem.',
        eventDate: new Date('2026-09-02'),
        signatoryIds: [signatory1._id, signatory2._id],
      },
      {
        recipientName: 'Fatima Al-Rashid',
        certificateType: 'Winner Certificate',
        award: 'Best Startup Pitch',
        eventName: 'AEN Annual Summit 2026',
        description: 'For demonstrating exceptional entrepreneurial vision and presenting the most compelling business pitch at the annual summit.',
        eventDate: new Date('2026-08-15'),
        signatoryIds: [signatory1._id],
      },
      {
        recipientName: 'Emeka Okafor',
        certificateType: 'Certificate of Excellence',
        award: 'Outstanding Leadership',
        eventName: 'AEN Leadership Academy',
        description: 'For showing outstanding leadership qualities and making significant contributions to the African business community.',
        eventDate: new Date('2026-07-20'),
        signatoryIds: [signatory1._id, signatory2._id],
      },
      {
        recipientName: 'Grace Mwangi',
        certificateType: 'Certificate of Recognition',
        award: 'Community Champion',
        eventName: 'AEN Community Impact Awards',
        description: 'In recognition of dedicated service and exceptional impact on the African entrepreneurs community.',
        eventDate: new Date('2026-06-10'),
        signatoryIds: [signatory2._id],
      },
      {
        recipientName: 'Thabo Mokoena',
        certificateType: 'Third Place Award',
        award: '3rd Place - Tech Innovation',
        eventName: 'AEN Community Hackathon 2026',
        description: 'For outstanding technical innovation and creative problem-solving at the AEN Community Hackathon.',
        eventDate: new Date('2026-09-02'),
        signatoryIds: [signatory1._id, signatory2._id],
      },
    ];

    for (const certData of certs) {
      const certificateId = generateCertificateId();
      const qrData = generateQrData({
        certificateId,
        recipientName: certData.recipientName,
        award: certData.award,
        eventName: certData.eventName,
        issueDate: new Date(),
      });

      await Certificate.create({
        certificateId,
        ...certData,
        issueDate: new Date(),
        qrData,
        status: 'generated',
        createdBy: admin._id,
      });
    }

    console.log('Created 5 demo certificates');
    console.log('✅ Seed completed successfully!');
    console.log(`\nAdmin login: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@AEN2026!'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
