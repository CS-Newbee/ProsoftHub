// ManageGalleryRoutes.js
// URL-based Gallery Management with Enhanced Error Handling

import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/* =====================================================
   GET: Fetch all gallery images
===================================================== */
router.get('/', (req, res) => {
  const query = 'SELECT * FROM gallery_images ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ GET gallery error:', err);
      return res.status(500).json({ error: 'Failed to fetch gallery' });
    }

    const galleryData = {
      "Upcoming Events": [],
      "Previous Events": [],
      "Community / Member Highlights": [],
      "Workshops": []
    };

    results.forEach(img => {
      if (galleryData[img.category]) {
        galleryData[img.category].push({
          id: img.id,
          url: img.image_url
        });
      }
    });

    console.log('✅ Gallery fetched successfully');
    res.json(galleryData);
  });
});

/* =====================================================
   POST: Add image by URL
===================================================== */
router.post('/add-url', (req, res) => {
  const { category, imageUrl } = req.body;

  if (!category || !imageUrl) {
    return res.status(400).json({ error: 'Category & imageUrl required' });
  }

  const query = 'INSERT INTO gallery_images (category, image_url) VALUES (?, ?)';

  db.query(query, [category, imageUrl], (err, result) => {
    if (err) {
      console.error('❌ Add image error:', err);
      return res.status(500).json({ error: 'Failed to add image' });
    }

    console.log('✅ Image added successfully, ID:', result.insertId);
    res.status(200).json({
      success: true,
      message: 'Image added successfully',
      id: result.insertId
    });
  });
});

/* =====================================================
   DELETE: Delete image by ID (FIXED WITH PROPER ERROR HANDLING)
===================================================== */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validate ID
  if (isNaN(id)) {
    console.error('❌ Invalid ID:', req.params.id);
    return res.status(400).json({ error: 'Invalid image ID' });
  }

  const query = 'DELETE FROM gallery_images WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Delete error for ID', id, ':', err);
      return res.status(500).json({ error: 'Database delete failed' });
    }

    if (result.affectedRows === 0) {
      console.warn('⚠️ Image not found with ID:', id);
      return res.status(404).json({ error: 'Image not found' });
    }

    console.log('✅ Image deleted successfully, ID:', id);
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      deletedId: id
    });
  });
});

/* =====================================================
   DELETE: Clear entire category
===================================================== */
router.delete('/category/:category', (req, res) => {
  const category = decodeURIComponent(req.params.category);

  const query = 'DELETE FROM gallery_images WHERE category = ?';

  db.query(query, [category], (err, result) => {
    if (err) {
      console.error('❌ Clear category error:', err);
      return res.status(500).json({ error: 'Failed to clear category' });
    }

    console.log(`✅ Category "${category}" cleared, deleted ${result.affectedRows} images`);
    res.status(200).json({
      success: true,
      message: `Category "${category}" cleared`,
      deletedCount: result.affectedRows
    });
  });
});

/* =====================================================
   Health Check
===================================================== */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gallery API running',
    timestamp: new Date().toISOString()
  });
});

export default router;