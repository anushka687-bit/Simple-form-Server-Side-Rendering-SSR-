const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch { return []; }
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/',       (req, res) => res.render('index'));
app.get('/users',  (req, res) => res.render('users'));
app.get('/result', (req, res) => res.render('result'));

// GET all
app.get('/api/users', (req, res) => {
  const data = readData();
  res.json({ success: true, count: data.length, data });
});

// GET one
app.get('/api/users/:id', (req, res) => {
  const data = readData();
  const user = data.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: user });
});

// POST create
app.post('/api/users', (req, res) => {
  const {
    firstName, surname, age, gender,
    collegeName, course, branch, startYear, endYear, cgpa,
    email, phone, linkedin, city, pincode, state, country
  } = req.body;

  const errors = [];

  if (!firstName || firstName.trim().length < 1) errors.push('First name is required.');
  if (!surname   || surname.trim().length < 1)   errors.push('Surname is required.');

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) errors.push('Age must be between 1 and 100.');

  if (!gender)      errors.push('Please select a gender.');
  if (!collegeName || collegeName.trim().length < 1) errors.push('College name is required.');
  if (!course)      errors.push('Please select a course.');
  if (!branch)      errors.push('Please select a branch.');
  if (!startYear)   errors.push('Please select start year.');
  if (!endYear)     errors.push('Please select end year.');
  if (parseInt(endYear) < parseInt(startYear)) errors.push('End year cannot be before start year.');

  const cgpaNum = parseFloat(cgpa);
  if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) errors.push('CGPA must be between 0 and 10.');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) errors.push('A valid email is required.');

  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone.trim())) errors.push('A valid 10-digit phone number is required.');

  if (!city    || city.trim().length < 1)         errors.push('City is required.');
  if (!pincode || !/^[0-9]{6}$/.test(pincode.trim())) errors.push('A valid 6-digit pincode is required.');
  if (!state   || state.trim().length < 1)        errors.push('State is required.');
  if (!country) errors.push('Please select a country.');

  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });

  const data   = readData();
  const nextId = data.length > 0 ? Math.max(...data.map(u => u.id)) + 1 : 1;

  const entry = {
    id:          nextId,
    studentId:   'STU' + String(nextId).padStart(4, '0'),
    firstName:   firstName.trim(),
    surname:     surname.trim(),
    fullName:    firstName.trim() + ' ' + surname.trim(),
    age:         ageNum,
    gender,
    collegeName: collegeName.trim(),
    course,
    branch,
    startYear,
    endYear,
    cgpa:        cgpaNum,
    email:       email.trim(),
    phone:       phone.trim(),
    linkedin:    linkedin?.trim() || '',
    city:        city.trim(),
    pincode:     pincode.trim(),
    state:       state.trim(),
    country,
    createdAt:   new Date().toLocaleString()
  };

  data.push(entry);
  writeData(data);
  res.status(201).json({ success: true, message: 'Student registered successfully!', data: entry });
});

// PUT update
app.put('/api/users/:id', (req, res) => {
  const data  = readData();
  const index = data.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ success: false, message: 'Student not found' });

  const f = req.body;
  data[index] = {
    ...data[index],
    firstName:   f.firstName?.trim()   || data[index].firstName,
    surname:     f.surname?.trim()     || data[index].surname,
    fullName:    (f.firstName?.trim() || data[index].firstName) + ' ' + (f.surname?.trim() || data[index].surname),
    age:         parseInt(f.age)       || data[index].age,
    gender:      f.gender              || data[index].gender,
    collegeName: f.collegeName?.trim() || data[index].collegeName,
    course:      f.course              || data[index].course,
    branch:      f.branch              || data[index].branch,
    startYear:   f.startYear           || data[index].startYear,
    endYear:     f.endYear             || data[index].endYear,
    cgpa:        parseFloat(f.cgpa)    || data[index].cgpa,
    email:       f.email?.trim()       || data[index].email,
    phone:       f.phone?.trim()       || data[index].phone,
    linkedin:    f.linkedin?.trim()    || data[index].linkedin,
    city:        f.city?.trim()        || data[index].city,
    pincode:     f.pincode?.trim()     || data[index].pincode,
    state:       f.state?.trim()       || data[index].state,
    country:     f.country             || data[index].country,
    updatedAt:   new Date().toLocaleString()
  };

  writeData(data);
  res.json({ success: true, message: 'Student updated successfully!', data: data[index] });
});

// DELETE
app.delete('/api/users/:id', (req, res) => {
  const data  = readData();
  const index = data.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ success: false, message: 'Student not found' });

  const deleted = data.splice(index, 1)[0];
  writeData(data);
  res.json({ success: true, message: 'Student deleted successfully!', data: deleted });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));