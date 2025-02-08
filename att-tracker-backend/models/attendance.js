const mongoose = require("mongoose")

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: String,
    required: true
  },
  status: {
     type: String, 
     enum: ["full", "half", "absent"],
      required: true
  }
});

const attendance = mongoose.model('Attendance', AttendanceSchema)

module.exports = attendance