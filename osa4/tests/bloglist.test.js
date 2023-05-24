const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: '64694b13526f5a615654e903',
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: '64694b13526f5a615654e903',
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: '64694b13526f5a615654e903',
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 4,
    user: '64694b13526f5a615654e903',
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: '64694b13526f5a615654e903',
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 12,
    user: '64694b13526f5a615654e903',
    __v: 0
  }
]

let token = ""


beforeAll(async () => {
  const user = await User.find({})
  //console.log("user", user)

  if (!user) {
    const newUser =
    {
      username: "test",
      name: "Test User",
      passwordHash: "$2b$10$9wMlZuxGYuiDi8xoRceEpuqFQkNW39.DynfktdsgRgloL5ZQYOtRm"
    }
    await User.create(newUser)
  }

  const credentials = {
    username: "test",
    password: "secretpassword"
  }

  response = await api.post('/api/login')
    .set('Accept', 'application/json')
    .send(credentials)

  token = response.body.token

  //console.log("login token", token)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


describe('GET requests', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    //console.log("titles", titles)

    expect(titles).toContain('React patterns')
  })

  test('the blogs have the parameter id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})


describe('POST requests', () => {

  test('a new blog can be added', async () => {
    const newBlog =
    {
      title: "Test",
      author: "John Doe",
      url: "https://test.blog.com",
      likes: 9
    }

    await api.post('/api/blogs')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    //console.log("response.body", response.body)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(response.body[initialBlogs.length].url).toEqual(newBlog.url)
  })

  test('the default value for likes is 0', async () => {
    const newBlog =
    {
      title: "Test",
      author: "John Doe",
      url: "https://test.blog.com"
    }

    await api.post('/api/blogs').send(newBlog)
      .set('Authorization', 'Bearer ' + token)

    const response = await api.get('/api/blogs')
    //console.log("response.body", response.body)

    expect(response.body[initialBlogs.length].likes).toEqual(0)
  })

  test('a new blog has to contain a title', async () => {
    const newBlog =
    {
      author: "John Doe",
      url: "https://test.blog.com",
      likes: 9
    }

    await api.post('/api/blogs').send(newBlog)
      .set('Authorization', 'Bearer ' + token).expect(400)
  })

  test('a new blog has to contain a url', async () => {
    const newBlog =
    {
      title: "Test",
      author: "John Doe",
      likes: 9
    }

    await api.post('/api/blogs').send(newBlog)
      .set('Authorization', 'Bearer ' + token).expect(400)
  })

  test("a new blog can't be added without a token", async () => {
    const newBlog =
    {
      title: "Test",
      author: "John Doe",
      url: "https://test.blog.com",
      likes: 9
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test("a new blog can't be added with a wrong token", async () => {
    const newBlog =
    {
      title: "Test",
      author: "John Doe",
      url: "https://test.blog.com",
      likes: 9
    }

    await api.post('/api/blogs')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0NjE3YTdjOTNjOWI1YTRlOTk1NGE4NCIsImlhdCI6MTY4NDY1NTA0NH0.aw2A4GOGyQ9RPnoXPJP_OxYO16RPtkI46NNelLxjvG4')
      .send(newBlog)
      .expect(401)
  })
})



describe('requests to individual resources', () => {

  test('a blog can be deleted', async () => {
    const firstId = initialBlogs[0]._id
    await api.delete(`/api/blogs/${firstId}`)
    .set('Authorization', 'Bearer ' + token).expect(204)

    const response = await api.get('/api/blogs')
    //console.log("response.body", response.body)

    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })

  test('a blog can be modified', async () => {
    const firstId = initialBlogs[0]._id
    const newBlog =
    {
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: 20
    }

    await api.put(`/api/blogs/${firstId}`)
    .set('Authorization', 'Bearer ' + token)
    .send(newBlog).expect(204)

    const response = await api.get('/api/blogs')
    //console.log("response.body", response.body)

    expect(response.body[0].likes).toEqual(newBlog.likes)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test("a blog can't be deleted without authorisation", async () => {
    const firstId = initialBlogs[0]._id
    await api.delete(`/api/blogs/${firstId}`).expect(401)
  })

  test("a blog can't be modified without authorisation", async () => {
    const firstId = initialBlogs[0]._id
    const newBlog =
    {
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: 20
    }

    await api.put(`/api/blogs/${firstId}`).send(newBlog).expect(401)
  })
})



afterAll(async () => {
  await mongoose.connection.close()
})

//npm test -- tests/bloglist.test.js