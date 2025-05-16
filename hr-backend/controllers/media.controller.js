
const express = require('express');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

require('dotenv').config();

// Configure AWS using env variables
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

//upload model/video
router.post('/upload-url', async (req, res) => {
  const { filename, mimeType, mediaType, propertyId } = req.body;

  const key = `${mediaType}/${propertyId}/${uuidv4()}-${filename}`;

  try {
    const uploadUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Expires: 60,
    });

    res.json({ uploadUrl, key });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: 'Failed to generate signed URL' });
  }
});

router.post('/complete', async (req, res) => {
  const { propertyId, key, mediaType, metadata } = req.body;

  const pool = require('../db');

  await pool.query(`
    INSERT INTO property_media
      (property_id, media_type, file_key, filename, mime_type, size_bytes, metadata)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)
  `, [
    propertyId,
    mediaType,
    key,
    key.split('/').pop(),
    '', // Optionally extract MIME type from key or metadata
    0,  // Optionally use S3.headObject to get size
    metadata,
  ]);

  res.json({ success: true });
});


// ✅ Get media files for a specific property
// GET /api/media/property/:propertyId
router.get('/property/:propertyId', async (req, res) => {
  const { propertyId } = req.params;
  const pool = require('../db');

  try {
    const result = await pool.query(`
      SELECT id, filename, file_key, media_type
      FROM property_media
      WHERE property_id = $1
      ORDER BY uploaded_at DESC
    `, [propertyId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});


// ✅ Delete specific media
// DELETE /api/media/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const pool = require('../db');

  try {
    // اگر خواستی فایل رو از S3 هم پاک کنی، می‌تونیم اونم اضافه کنیم.
    await pool.query('DELETE FROM property_media WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});


module.exports = router;