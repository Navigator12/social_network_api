const { Router } = require('express')

const PostController = require('../controllers/Post')
const AttachUser = require('../utils/Authorization')

const router = Router()

router.post('/create', AttachUser, PostController.create)
router.post('/comment', AttachUser, PostController.comment)

module.exports = router
