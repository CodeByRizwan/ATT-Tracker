const Attendance = require("../models/attendance")
const UsEr = require("../models/attendance")

async function handleGetAllAttendance(req,res){
    try {
      const userId = req.params.userId
      const date = req.query.date
      const currentYear = date.substring(0, 4);
      const currentMonth = date.substring(5, 7);
      const attendanceRecords = await Attendance.find({
        date : { $regex: `^${currentYear}-${currentMonth}`, $options: "i" },
        userId : userId,
      });
     
      if (attendanceRecords) {
        return res.status(200).json({ 
          message: "Attendance sent!", 
          attendanceData: attendanceRecords 
        });
      } else {
        return res.status(400).json({ message: "Records not found!" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message }) ;
    }
}


async function handleOneDayAttendance(req,res) {
 const userId = req.params.userId
    const {date , status} = req.body
    try {
      const existingDate =await UsEr.findOne({
        userId : userId,
        date : date
      })       
      let dataCreated;
      if(existingDate){
        existingDate.status = status
        dataCreated = existingDate.save()
      }else{
        dataCreated = await UsEr.create({
          userId , date , status
        })
      }
      return res.status(200).json({message: "attendance created successfully!" , status : "success" , data : dataCreated})
    } catch (error) {
      return res.status(500).json({message : "something went wrong while creating an attendance" , status : "failure"})      
    }
}

module.exports = { handleGetAllAttendance , handleOneDayAttendance }
