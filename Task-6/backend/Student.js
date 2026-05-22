const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  surname:      { type: String, required: true, trim: true },
  age:          { type: Number, required: true },
  gender:       { type: String, required: true, enum: ['Male','Female','Other'] },
  collegeName:  { type: String, required: true, trim: true },
  course:       { type: String, required: true },
  branch:       { type: String, required: true },
  startYear:    { type: String, required: true },
  endYear:      { type: String, required: true },
  cgpa:         { type: Number, required: true, min: 0, max: 10 },
  email:        { type: String, required: true, trim: true, lowercase: true },
  phone:        { type: String, required: true },
  linkedin:     { type: String, default: '' },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  country:      { type: String, required: true },
  pincode:      { type: String, required: true },
  studentId:    { type: String, unique: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-generate studentId — no next() needed in newer Mongoose
studentSchema.pre('save', async function () {
  if (!this.studentId) {
    const count   = await mongoose.model('Student').countDocuments();
    this.studentId = 'STU' + String(count + 1).padStart(4, '0');
  }
});

module.exports = mongoose.model('Student', studentSchema);