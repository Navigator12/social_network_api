const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

const PostService = {
  create: async (payload) => {
    const { text, author } = payload

    const post = new Post({
      text,
      author,
    })

    const user = await User.findById(author)

    user.posts.push(post._id)

    await post.save()
    await user.save()
  },

  comment: async (payload) => {
    const { postId, text, author } = payload

    const post = await Post.findById(postId)

    if (!post) throw new Error('Post does not exist')

    const comment = new Comment({
      text,
      author,
      post: postId,
    })

    post.comments.push(comment)

    await comment.save()
    await post.save()
  },
}

module.exports = PostService
