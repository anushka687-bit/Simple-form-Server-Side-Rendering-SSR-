
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');
const jwt       = require('jsonwebtoken');
const Student   = require('./Student');
const Admin     = require('./Admin');
const { protect } = require('./auth');

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
    res.redirect("/home.html");
});
// ── Connect to MongoDB ──
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Auto-create admin if not exists
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await Admin.create({
        email:    process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });
      console.log('✅ Admin created:', process.env.ADMIN_EMAIL);
    }
  })
  .catch(err => console.error('❌ MongoDB error:', err));



// ════════════════════════════════════════
//  PUBLIC ROUTES
// ════════════════════════════════════════

// ── POST /api/students — Register a student ──
app.post('/api/students', async (req, res) => {
  try {
    const {
      firstName, surname, age, gender, collegeName,
      course, branch, startYear, endYear, cgpa,
      email, phone, linkedin, city, state, country, pincode
    } = req.body;

    // Basic validation
    const errors = [];
    if (!firstName || firstName.trim().length < 1) errors.push('First name is required.');
    if (!surname   || surname.trim().length < 1)   errors.push('Surname is required.');
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) errors.push('Age must be 1–100.');
    if (!gender)      errors.push('Gender is required.');
    if (!collegeName) errors.push('College name is required.');
    if (!course)      errors.push('Course is required.');
    if (!branch)      errors.push('Branch is required.');
    if (!startYear)   errors.push('Start year is required.');
    if (!endYear)     errors.push('End year is required.');
    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) errors.push('CGPA must be 0–10.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
    if (!phone || !/^[0-9]{10}$/.test(phone)) errors.push('Valid 10-digit phone is required.');
    if (!city)    errors.push('City is required.');
    if (!state)   errors.push('State is required.');
    if (!country) errors.push('Country is required.');
    if (!pincode || !/^[0-9]{6}$/.test(pincode)) errors.push('Valid 6-digit pincode is required.');

    if (errors.length > 0)
      return res.status(400).json({ success: false, errors });

    // Check duplicate email
    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ success: false, errors: ['Email already registered.'] });

    const student = await Student.create({
      firstName, surname, age: ageNum, gender,
      collegeName, course, branch, startYear, endYear,
      cgpa: cgpaNum, email, phone,
      linkedin: linkedin || '',
      city, state, country, pincode
    });

    res.status(201).json({ success: true, message: 'Student registered!', data: student });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ── POST /api/admin/login — Admin login ──
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    // Sign JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ success: true, message: 'Login successful!', token });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
//  PROTECTED ROUTES (Admin only)
// ════════════════════════════════════════

// ── GET /api/students — Get all students ──
app.get('/api/students', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/students/:id — Get one student ──
app.get('/api/students/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/students/:id — Update student ──
app.put('/api/students/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, message: 'Student updated!', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/students/:id — Delete student ──
app.delete('/api/students/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, message: 'Student deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start server ──
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));