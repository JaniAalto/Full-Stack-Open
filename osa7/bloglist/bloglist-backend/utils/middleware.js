const jwt = require('jsonwebtoken')
const User = require('../models/user')


const tokenExtractor = (request, response, next) => {
  const authorisation = request.get('authorization')
  if (authorisation && authorisation.startsWith('Bearer ')) {
    //console.log("authorisation", authorisation)
    request.token = authorisation.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    //console.log("decodedToken.id", decodedToken.id)

    const user = await User.findById(decodedToken.id).catch(error => next(error))
    if (!user) {
      return response.status(401).json({ error: 'user invalid' })
    }
    //console.log("user", user)

    request.user = user
  }

  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: 'invalid signature' })
  }
  if (error.name === 'ValidationError') {
    return response.status(401).send({ error: 'validation failed' })
  }

  next(error)
}


module.exports = { tokenExtractor, userExtractor, errorHandler }