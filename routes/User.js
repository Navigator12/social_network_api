const { Router } = require('express')

const UserController = require('../controllers/User')

const router = Router()

router.get('/', UserController.index)
router.get('/:id', UserController.show)
router.get('/friends/:id', UserController.friends)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router
