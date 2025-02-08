const { Router } = require('express')
const { handleLogin , handleSignup , handleLogout} = require('../controllers/user')
const router = Router()

router.post('/login',handleLogin)
router.post('/signup',handleSignup)
router.post('/logout',handleLogout)

module.exports = router