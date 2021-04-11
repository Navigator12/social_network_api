const { Router } = require('express')

const UserController = require('../controllers/User')
const AttachUser = require('../utils/Authorization')

const router = Router()

router.get('/', UserController.index)
router.get('/me', AttachUser, UserController.me)
router.get('/:id', UserController.show)
router.get('/friends/:id', UserController.friends)
router.get('/friends/status/:from/:to', UserController.friendStatus)
router.delete('/friends/:otherUserId', AttachUser, UserController.removeFriendRelation)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

module.exports = router
