const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const submissions = [];

app.get('/', (req, res) => {
  res.render('index', { errors: [], formData: {} });
});

app.get('/users', (req, res) => {
  res.render('users', { allEntries: submissions });
});

app.post('/submit', (req, res) => {
  console.log('BODY:', req.body);

  const { name, email, phone, password, confirmPassword, gender, age, state, skills, country } = req.body;
  const errors = [];

  // Name
  if (!name || name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim()))
    errors.push('A valid email address is required.');

  // Phone
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone.trim()))
    errors.push('A valid 10-digit phone number is required.');

  // Password — each rule separately
  if (!password) {
    errors.push('Password is required.');
  } else {
    if (password.length < 8)
      errors.push('Password must be at least 8 characters.');
    if (!/[A-Z]/.test(password))
      errors.push('Password must contain an uppercase letter.');
    if (!/[a-z]/.test(password))
      errors.push('Password must contain a lowercase letter.');
    if (!/\d/.test(password))
      errors.push('Password must contain a number.');
    if (!/[@$!%*?&]/.test(password))
      errors.push('Password must contain a special character (@$!%*?&).');
  }

  // Confirm password
  if (!confirmPassword || password !== confirmPassword)
    errors.push('Passwords do not match.');

  // Gender
  if (!gender)
    errors.push('Please select a gender.');

  // Age
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
    errors.push('Age must be between 1 and 120.');

  // State
  if (!state || state.trim().length < 2)
    errors.push('Please enter your state.');

  // Country
  if (!country)
    errors.push('Please select a country.');

  // If errors, re-render form
  if (errors.length > 0) {
    return res.render('index', {
      errors,
      formData: { name, email, phone, gender, age, state, country, skills }
    });
  }

  // Build and store entry
  const entry = {
    name:        name.trim(),
    email:       email.trim(),
    phone:       phone.trim(),
    gender,
    age:         ageNum,
    state:       state.trim(),
    country,
    skills:      Array.isArray(skills) ? skills : (skills ? [skills] : []),
    submittedAt: new Date().toLocaleString()
  };

  submissions.push(entry);
  console.log('Stored entry:', entry);
  console.log('Total submissions:', submissions.length);

  res.render('result', { entry });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});