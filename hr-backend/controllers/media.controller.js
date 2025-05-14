// controllers/media.controller.js
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// (1) Configure AWS
const s3 = new AWS.S3({
  region: 'your-region',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  signatureVersion: 'v4',
});

// (2) Generate S3 upload URL
router.post('/upload-url', async (req, res) => {
  const { filename, mimeType, mediaType, propertyId } = req.body;

  const key = `${mediaType}/${propertyId}/${uuidv4()}-${filename}`;

  const uploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: 'your-bucket-name',
    Key: key,
    ContentType: mimeType,
    Expires: 60,
  });

  res.json({ uploadUrl, key });
});

// (3) Complete upload: save info to DB
router.post('/complete', async (req, res) => {
  const { propertyId, key, mediaType, metadata } = req.body;

  // Save media details to DB (PostgreSQL)
  const db = require('../db');
  await db.query(`
    INSERT INTO property_media
      (property_id, media_type, file_key, filename, mime_type, size_bytes, metadata)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)
  `, [
    propertyId,
    mediaType,
    key,
    key.split('/').pop(),
    '',      // Optionally fetch this from S3
    0,       // Optionally fetch file size
    metadata,
  ]);

  res.json({ success: true });
});

module.exports = router;
