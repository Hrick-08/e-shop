import express from 'express';
import { Router } from 'express';
import Item from '../models/Item.js';
import auth from '../middleware/auth.js';

const router = Router();

// @route   GET /api/items
// @desc    Get all items with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const items = await Item.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

// @route   GET /api/items/categories
// @desc    Get all available categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Item.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reviews.user', 'name');
    
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// @route   POST /api/items
// @desc    Create new item (Admin only - simplified for demo)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const item = new Item({
      name,
      description,
      price,
      category,
      imageUrl,
      stock: stock || 0
    });

    await item.save();

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating item' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock, isActive } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ message: 'Price cannot be negative' });
      }
      item.price = price;
    }
    if (category !== undefined) item.category = category;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({ message: 'Stock cannot be negative' });
      }
      item.stock = stock;
    }
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating item' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Soft delete by setting isActive to false
    item.isActive = false;
    await item.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while deleting item' });
  }
});

// @route   GET /api/items/:id/reviews
// @desc    Get reviews for an item
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reviews.user', 'name');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ reviews: item.reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// @route   POST /api/items/:id/reviews
// @desc    Add a review to an item
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const item = await Item.findById(req.params.id);
    
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user already reviewed this item
    const existingReview = item.reviews.find(review => 
      review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    // Add new review
    const newReview = {
      user: req.user.id,
      rating: Number(rating),
      comment: comment.trim()
    };

    item.reviews.push(newReview);
    await item.save();

    // Populate the new review with user info
    await item.populate('reviews.user', 'name');
    
    const addedReview = item.reviews[item.reviews.length - 1];

    res.status(201).json({
      message: 'Review added successfully',
      review: addedReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while adding review' });
  }
});

export default router;