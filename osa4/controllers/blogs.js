const blogRouter = require('express').Router()
const Blog = require('../models/blog')


/*
const getTokenFrom = request => {
  const authorisation = request.get('authorization')
  if (authorisation && authorisation.startsWith('Bearer ')) {
    //console.log("authorisation", authorisation)
    return authorisation.replace('Bearer ', '')
  }
  return null
}
const getUserFrom = request => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  console.log("decodedToken.id", decodedToken.id)

  return User.findById(decodedToken.id)
}*/


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
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

  //const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  //const user = await getUserFrom(request)

  const user = request.user
  //console.log("blogRouter.post() request.user", user)

  let blog = new Blog(request.body)
  blog.user = user._id
  //console.log("user", user)

  if (!request.body.likes) {
    blog = new Blog({
      _id: request.body._id,
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: 0,
      user: user._id
    })
  }

  const savedBlog = await blog.save()
  //console.log("savedBlog", savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save().catch(error => next(error))

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  //const user = await getUserFrom(request)

  if (!request.user) {
    return response.status(401).send("missing user credentials")
  }

  const userId = request.user._id.toString()
  const blog = await Blog.findById(request.params.id)
  //console.log("blogRouter.delete: user, blog", userId, blog)

  if (blog.user._id.toString() === userId) {
    await Blog.findByIdAndRemove(request.params.id)
      .catch(error => next(error))

    response.status(204).end()
  }
  /*else {
    return response.status(401).json({ error: 'access denied' })
  }*/

})

blogRouter.put('/:id', async (request, response, next) => {
  if (!request.user) {
    return response.status(401).send("missing user credentials")
  }

  const likes = request.body.likes
  const id = request.params.id
  const userId = request.user._id.toString()
  const blog = await Blog.findById(request.params.id)

  //console.log(`Backend trying to update ${id} with likes ${likes}`)

  if (blog.user._id.toString() === userId) {
    const blogs = await Blog.findByIdAndUpdate(id, { likes: likes })
      .catch(error => next(error))

    response.status(204).json(blogs)
  }
  else {
    return response.status(401).json({ error: 'access denied' })
  }
})


module.exports = blogRouter