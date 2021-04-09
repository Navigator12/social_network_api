const { Router } = require('express')

const FriendRequestController = require('../controllers/FriendRequest')
const AttachUser = require('../utils/Authorization')

const router = Router()

router.post('/send', AttachUser, FriendRequestController.send)
router.post('/resolve', AttachUser, FriendRequestController.resolve)
router.post('/cancel', AttachUser, FriendRequestController.cancel)
router.get('/pending/:id', FriendRequestController.pending)
router.get('/sent/:id', FriendRequestController.sent)

module.exports = router
