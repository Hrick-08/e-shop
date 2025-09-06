import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const sampleItems = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with Pro camera system and A16 Bionic chip',
    price: 999,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=iPhone+14+Pro',
    stock: 25
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Flagship Android phone with excellent camera and performance',
    price: 899,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+S23',
    stock: 30
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 150,
    category: 'clothing',
    imageUrl: 'https://via.placeholder.com/300x300?text=Nike+Air+Max',
    stock: 50
  },
  {
    name: 'MacBook Air M2',
    description: 'Lightweight laptop with M2 chip and all-day battery life',
    price: 1199,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=MacBook+Air',
    stock: 15
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12.99,
    category: 'books',
    imageUrl: 'https://via.placeholder.com/300x300?text=Great+Gatsby',
    stock: 100
  },
  {
    name: 'Coffee Table',
    description: 'Modern wooden coffee table for living room',
    price: 299,
    category: 'home',
    imageUrl: 'https://via.placeholder.com/300x300?text=Coffee+Table',
    stock: 12
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise and meditation',
    price: 29.99,
    category: 'sports',
    imageUrl: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
    stock: 75
  },
  {
    name: 'LEGO Star Wars Set',
    description: 'Build your own Millennium Falcon with this LEGO set',
    price: 159.99,
    category: 'toys',
    imageUrl: 'https://via.placeholder.com/300x300?text=LEGO+Set',
    stock: 20
  },
  {
    name: 'Bluetooth Headphones',
    description: 'Wireless noise-cancelling headphones with premium sound',
    price: 249,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 40
  },
  {
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket, perfect for casual wear',
    price: 79.99,
    category: 'clothing',
    imageUrl: 'https://via.placeholder.com/300x300?text=Denim+Jacket',
    stock: 35
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Sample items inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();