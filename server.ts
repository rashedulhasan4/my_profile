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
let isConnecting = false;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_FILE = path.join(process.cwd(), 'db.json');

async function connectDB() {
  if (MONGODB_URI && MONGODB_URI.startsWith('mongodb') && !MONGODB_URI.includes('<user>')) {
    isConnecting = true;
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      isMongoDBConnected = true;
      console.log('Connected to MongoDB Atlas');
    } catch (err) {
      isMongoDBConnected = false;
      console.error('MongoDB connection failed, falling back to Local JSON');
    } finally {
      isConnecting = false;
    }
  } else {
    console.log('Running in Local JSON mode (db.json)');
  }
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

const HeroSchema = new mongoose.Schema({
  name: String,
  title: String,
  subtitle: String,
  description: String,
  email: String,
});

const AboutSchema = new mongoose.Schema({
  title: String,
  description: [String],
  stats: [{ label: String, value: String, icon: String }]
});

const SkillSchema = new mongoose.Schema({
  category: String,
  icon: String,
  skills: [String]
});

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  companyUrl: String,
  location: String,
  date: String,
  description: [String],
  order: Number
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);
const BlogModel = mongoose.model('Blog', BlogSchema);
const HeroModel = mongoose.model('Hero', HeroSchema);
const AboutModel = mongoose.model('About', AboutSchema);
const SkillModel = mongoose.model('Skill', SkillSchema);
const ExperienceModel = mongoose.model('Experience', ExperienceSchema);
const UserModel = mongoose.model('User', UserSchema);

// Local DB Helpers
async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    const initialData = { 
      projects: [], 
      blog: [], 
      users: [],
      hero: {
        name: 'Rashed',
        title: 'Full Stack Developer',
        subtitle: 'Crafting high-performance digital experiences.',
        description: "I build scalable, user-centric applications using modern web technologies.",
        email: process.env.ADMIN_EMAIL || 'hello@example.com'
      },
      about: {
        title: 'About Me',
        description: [
          "I am a passionate Full Stack Developer with a strong focus on building high-performance, scalable web applications. My journey in tech started with a curiosity for how things work on the internet, which quickly evolved into a career dedicated to crafting seamless digital experiences.",
          "I specialize in modern JavaScript frameworks like React and Next.js, combined with powerful backend technologies like Node.js and PostgreSQL. I believe in writing clean, maintainable code and always staying up-to-date with the latest industry trends.",
          "When I'm not coding, you can find me exploring new design patterns, contributing to open-source projects, or sharing my knowledge through blog posts and community events."
        ],
        stats: [
          { label: 'Years Experience', value: '4+', icon: 'Briefcase' },
          { label: 'Projects Delivered', value: '20+', icon: 'Award' },
          { label: 'Happy Clients', value: '20+', icon: 'Users' },
        ]
      },
      skills: [
        { category: 'Languages', icon: 'Code2', skills: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL', 'HTML/CSS'] },
        { category: 'Frameworks & Libraries', icon: 'Layout', skills: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion'] },
        { category: 'Databases', icon: 'Database', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Prisma', 'Supabase'] },
        { category: 'Tools & Platforms', icon: 'Terminal', skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Netlify', 'Postman'] }
      ],
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Innovations Inc.',
          companyUrl: '#',
          location: 'San Francisco, CA',
          date: '2022 - Present',
          description: [
            'Led the development of a high-traffic e-commerce platform using Next.js and Node.js.',
            'Implemented automated CI/CD pipelines, reducing deployment time by 40%.',
            'Mentored a team of 5 junior developers, fostering a culture of code quality and best practices.',
            'Optimized database queries, resulting in a 30% improvement in application performance.'
          ]
        },
        {
          title: 'Full Stack Developer',
          company: 'Creative Solutions Studio',
          companyUrl: '#',
          location: 'New York, NY',
          date: '2020 - 2022',
          description: [
            'Developed and maintained multiple client projects using React, Express, and MongoDB.',
            'Collaborated with designers to implement pixel-perfect, responsive user interfaces.',
            'Integrated third-party APIs for payment processing, social media, and analytics.',
            'Participated in agile development processes, including daily stand-ups and sprint planning.'
          ]
        },
        {
          title: 'Junior Web Developer',
          company: 'StartUp Hub',
          companyUrl: '#',
          location: 'Austin, TX',
          date: '2018 - 2020',
          description: [
            'Assisted in the development of a real-time collaboration tool using React and Socket.io.',
            'Fixed bugs and implemented new features based on user feedback.',
            'Gained experience in writing clean, modular, and well-documented code.',
            'Learned and applied modern web development tools and workflows.'
          ]
        }
      ]
    };
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
app.get('/api/db-status', (req, res) => {
  res.json({ connected: isMongoDBConnected, connecting: isConnecting, mode: isMongoDBConnected ? 'mongodb' : 'local' });
});

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

// Hero API
app.get('/api/hero', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const hero = await HeroModel.findOne().maxTimeMS(2000);
      if (hero) return res.json(hero);
    }
  } catch (err) {
    console.error("MongoDB fetch hero failed", err);
  }
  const db = await getLocalDB();
  res.json(db.hero);
});

app.post('/api/hero', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await HeroModel.findOneAndUpdate({}, req.body, { upsert: true, new: true });
      return res.json(req.body);
    }
  } catch (err) {
    console.error("MongoDB save hero failed", err);
  }
  const db = await getLocalDB();
  db.hero = req.body;
  await saveLocalDB(db);
  res.json(db.hero);
});

// About API
app.get('/api/about', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const about = await AboutModel.findOne().maxTimeMS(2000);
      if (about) return res.json(about);
    }
  } catch (err) {
    console.error("MongoDB fetch about failed", err);
  }
  const db = await getLocalDB();
  res.json(db.about);
});

app.post('/api/about', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await AboutModel.findOneAndUpdate({}, req.body, { upsert: true, new: true });
      return res.json(req.body);
    }
  } catch (err) {
    console.error("MongoDB save about failed", err);
  }
  const db = await getLocalDB();
  db.about = req.body;
  await saveLocalDB(db);
  res.json(db.about);
});

// Skills API
app.get('/api/skills', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const skills = await SkillModel.find().maxTimeMS(2000);
      return res.json(skills);
    }
  } catch (err) {
    console.error("MongoDB fetch skills failed", err);
  }
  const db = await getLocalDB();
  res.json(db.skills);
});

app.post('/api/skills', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await SkillModel.deleteMany({});
      const skills = await SkillModel.insertMany(req.body);
      return res.json(skills);
    }
  } catch (err) {
    console.error("MongoDB save skills failed", err);
  }
  const db = await getLocalDB();
  db.skills = req.body;
  await saveLocalDB(db);
  res.json(db.skills);
});

// Experience API
app.get('/api/experience', async (req, res) => {
  try {
    if (isMongoDBConnected) {
      const exp = await ExperienceModel.find().sort({ order: 1 }).maxTimeMS(2000);
      return res.json(exp);
    }
  } catch (err) {
    console.error("MongoDB fetch experience failed", err);
  }
  const db = await getLocalDB();
  res.json(db.experience);
});

app.post('/api/experience', authenticate, async (req, res) => {
  try {
    if (isMongoDBConnected) {
      await ExperienceModel.deleteMany({});
      const exp = await ExperienceModel.insertMany(req.body);
      return res.json(exp);
    }
  } catch (err) {
    console.error("MongoDB save experience failed", err);
  }
  const db = await getLocalDB();
  db.experience = req.body;
  await saveLocalDB(db);
  res.json(db.experience);
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

async function init() {
  await connectDB();
  await setupAdmin();
  await startServer();
}

init();
