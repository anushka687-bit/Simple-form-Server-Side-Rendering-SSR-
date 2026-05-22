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
  const { name, email, phone, gender, age } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim()))
    errors.push('A valid email address is required.');

  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone.trim()))
    errors.push('A valid 10-digit phone number is required.');

  if (!gender)
    errors.push('Please select a gender.');

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
    errors.push('Age must be a number between 1 and 120.');

  if (errors.length > 0) {
    return res.render('index', { errors, formData: { name, email, phone, gender, age } });
  }

  const entry = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    gender,
    age: ageNum,
    submittedAt: new Date().toLocaleString()
  };

  submissions.push(entry);
  res.render('result', { entry });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});