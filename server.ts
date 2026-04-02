import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// Database Mode: MongoDB or Local JSON
let isMongoDBConnected = false;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_FILE = path.join(process.cwd(), 'db.json');

if (MONGODB_URI && MONGODB_URI.startsWith('mongodb') && !MONGODB_URI.includes('<user>')) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      isMongoDBConnected = true;
      console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
      isMongoDBConnected = false;
      console.error('MongoDB connection failed, falling back to Local JSON');
    });
} else {
  console.log('Running in Local JSON mode (db.json)');
}

// Schemas (for MongoDB)
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  live: String,
  code: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  date: String,
  readTime: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);
const BlogModel = mongoose.model('Blog', BlogSchema);
const UserModel = mongoose.model('User', UserSchema);

// Local DB Helpers
async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    const initialData = { projects: [], blog: [], users: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

async function saveLocalDB(data: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    let user;
    if (isMongoDBConnected) {
      user = await UserModel.findOne({ email }).maxTimeMS(2000);
    } else {
      const db = await getLocalDB();
      user = db.users.find((u: any) => u.email === email);
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id || user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email } });
  } catch (err) {
    console.error("Login error, falling back to local", err);
    const db = await getLocalDB();
    const user = db.users.find((u: any) => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { email: user.email } });
    }
    res.status(401).json({ error: 'Invalid credentials or DB error' });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const projects = await ProjectModel.find().sort({ createdAt: -1 }).maxTimeMS(2000);
      return res.json(projects);
    }
  } catch (err) {
    console.error("MongoDB fetch projects failed", err);
  }
  const db = await getLocalDB();
  res.json(db.projects.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.post('/api/projects', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const project = new ProjectModel(req.body);
      await project.save();
      return res.json(project);
    }
  } catch (err) {
    console.error("MongoDB save project failed", err);
  }
  const db = await getLocalDB();
  const newProject = { _id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  db.projects.push(newProject);
  await saveLocalDB(db);
  res.json(newProject);
});

app.delete('/api/projects/:id', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await ProjectModel.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error("MongoDB delete project failed", err);
  }
  const db = await getLocalDB();
  db.projects = db.projects.filter((p: any) => p._id !== req.params.id);
  await saveLocalDB(db);
  res.json({ success: true });
});

// Blog API
app.get('/api/blog', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const posts = await BlogModel.find().sort({ createdAt: -1 }).maxTimeMS(2000);
      return res.json(posts);
    }
  } catch (err) {
    console.error("MongoDB fetch blog failed", err);
  }
  const db = await getLocalDB();
  res.json(db.blog.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.post('/api/blog', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const post = new BlogModel(req.body);
      await post.save();
      return res.json(post);
    }
  } catch (err) {
    console.error("MongoDB save blog failed", err);
  }
  const db = await getLocalDB();
  const newPost = { _id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
  db.blog.push(newPost);
  await saveLocalDB(db);
  res.json(newPost);
});

app.delete('/api/blog/:id', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await BlogModel.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error("MongoDB delete blog failed", err);
  }
  const db = await getLocalDB();
  db.blog = db.blog.filter((p: any) => p._id !== req.params.id);
  await saveLocalDB(db);
  res.json({ success: true });
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Initial Admin Setup
async function setupAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'rashedulhasanhst@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (isMongoDBConnected) {
    try {
      const existing = await UserModel.findOne({ email: adminEmail }).maxTimeMS(2000);
      if (!existing) {
        await new UserModel({ email: adminEmail, password: hashedPassword }).save();
        console.log('Admin user created in MongoDB');
      }
    } catch (err) {
      console.error("Admin setup in MongoDB failed", err);
    }
  }
  
  // Always ensure admin exists in local DB as well
  const db = await getLocalDB();
  const existingLocal = db.users.find((u: any) => u.email === adminEmail);
  if (!existingLocal) {
    db.users.push({ id: '1', email: adminEmail, password: hashedPassword });
    await saveLocalDB(db);
    console.log('Admin user created in Local JSON');
  }
}

setupAdmin();
startServer();
