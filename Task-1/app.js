const express = require('express');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// GET / — show the form
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
  console.log(req.body);  // ADD THIS LINE
  const { name, email, gender, age } = req.body;
  res.render('result', { name, email, gender, age });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});