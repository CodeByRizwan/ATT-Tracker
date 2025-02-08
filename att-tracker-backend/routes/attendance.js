const { Router } = require('express')
const { handleGetAllAttendance , handleOneDayAttendance} = require('../controllers/attendance')
const router = Router()

router.get('/:userId/all',handleGetAllAttendance)
router.post('/:userId', handleOneDayAttendance)

module.exports = router