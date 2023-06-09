const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 4,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 12,
    __v: 0
  }
]
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('likes of empty list', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('likes of only one blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('likes of all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(40)
  })
})

describe('highest rated', () => {

  test('highest rated from empty list', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toEqual({ title: "", author: "", likes: 0 })
  })

  test('highest rated from only one blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }
    )
  })

  test('highest rated from all blogs', () => {
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(
      {
        title: "Type wars",
        author: "Robert C. Martin",
        likes: 12
      }
    )
  })
})

describe('most blogs', () => {

  test('most authorships from empty list', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual(
      {
        author: "",
        blogs: 0
      }
    )
  })

  test('most authorships from only one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(
      {
        author: "Edsger W. Dijkstra",
        blogs: 1
      }
    )
  })

  test('most authorships from all blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })
})

describe('most likes', () => {
  test('most likes from empty list', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual(
      {
        author: "",
        likes: 0
      }
    )
  })

  test('most likes from only one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(
      {
        author: "Edsger W. Dijkstra",
        likes: 5
      }
    )
  })

  test('most likes from all blogs', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(
      {
        author: "Edsger W. Dijkstra",
        likes: 17
      }
    )
  })
})