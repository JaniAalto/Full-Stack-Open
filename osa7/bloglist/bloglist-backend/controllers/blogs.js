const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogRouter.post('/', async (request, response, next) => {
  //console.log("request.body", request.body)

  if (!request.body.title) {
    return response.status(400).send("missing title")
  }
  if (!request.body.url) {
    return response.status(400).send("missing url")
  }
  if (!request.user) {
    return response.status(401).send("missing user credentials")
  }

  const user = request.user

  let blog = new Blog(request.body)
  blog.user = user._id
  //console.log("user", user)

  if (!request.body.likes) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()
  //console.log("savedBlog", savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save().catch(error => next(error))

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  if (!request.user) {
    return response.status(401).send("missing user credentials")
  }

  const userId = request.user._id.toString()
  const blog = await Blog.findById(request.params.id)
  console.log("blogRouter.delete: user, blog", userId, blog)

  if (blog.user._id.toString() === userId) {
    await Blog.findByIdAndRemove(request.params.id)
      .catch(error => next(error))

    response.status(204).end()
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  //console.log("request.body", request.body)

  const id = request.params.id

  await Blog.findByIdAndUpdate(id, request.body)
    .catch(error => next(error))

  response.status(204).end()
})

blogRouter.post('/:id/comments', async (request, response) => {
  //console.log("request.body", request.body)

  const blog = await Blog.findById(request.params.id)

  blog.comments.push(request.body.comment)
  await blog.save().catch(error => next(error))

  response.status(201).end()
})


module.exports = blogRouter