const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const FriendRelation = require('../models/FriendRelation')

const PostService = {
  news: async (payload) => {
    const { userId, limit, offset } = payload

    const friends = await FriendRelation
      .find({
        from: userId,
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
          $in: [...friends, userId],
        },
      }, null, { sort: '-date' })
      .select('-__v')
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'author',
        select: 'nickname',
      })
      .populate({
        path: 'comments',
        select: '_id text author date',
        populate: {
          path: 'author',
          select: 'nickname',
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

    const user = await User
      .findById(author)

    user.posts.push(post._id)

    await post.save()
    await user.save()

    await post
      .populate({
        path: 'author',
        select: 'nickname',
      })
      .execPopulate()

    return post
  },

  delete: async (payload) => {
    const { postId, userId } = payload

    const post = await Post.findOneAndDelete({
      _id: postId,
      author: userId,
    })

    if (!post) {
      throw new Error('Post does not exist')
    }

    await Comment.deleteMany({
      _id: {
        $in: post.comments,
      },
    })
  },

  comment: async (payload) => {
    const { postId, text, author } = payload

    const post = await Post
      .findById(postId)

    if (!post) throw new Error('Post does not exist')

    const comment = new Comment({
      text,
      author,
      post: postId,
    })

    post.comments.push(comment._id)

    await comment.save()
    await post.save()

    await post
      .populate({
        path: 'author',
        select: 'nickname',
      })
      .populate({
        path: 'comments',
        select: '_id text author date',
        populate: {
          path: 'author',
          select: 'nickname',
        },
      })
      .execPopulate()

    return post
  },
}

module.exports = PostService
