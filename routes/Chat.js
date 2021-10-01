const { Router } = require('express')

const ChatController = require('../controllers/Chat')
const AttachUser = require('../utils/Authorization')

const router = Router()

router.get('/', AttachUser, ChatController.getUserChats)
router.post('/create', AttachUser, ChatController.create)
router.get('/find/:otherId', AttachUser, ChatController.find)
router.post('/write', AttachUser, ChatController.write)
router.get('/:otherId', AttachUser, ChatController.getChatWithMessages)

module.exports = router
