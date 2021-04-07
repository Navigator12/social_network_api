const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const FriendRelation = require('../models/FriendRelation')

const PostService = {
  news: async (payload) => {
    const id = payload

    const friends = await FriendRelation
      .find({
        from: id,
      })
      .select('to')
      .populate({
        path: 'to',
        select: '_id',
      }).lean()
      .map((relations) => relations.map((rel) => rel.to._id))

    const posts = await Post
      .find({
        author: {
          $in: friends,
        },
      })
      .select('-__v')
      .populate({
        path: 'author',
        select: 'nickname -_id',
      })
      .populate({
        path: 'comments',
        select: '-__v -post',
        populate: {
          path: 'author',
          select: 'nickname -_id',
        },
      })

    return posts
  },

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
