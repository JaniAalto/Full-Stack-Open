const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length > 0) {
    const likes = blogs.map(blog => blog.likes)
    return likes.reduce((accumulator, currentValue) => accumulator + currentValue)
  }
  else {
    return 0
  }
}

const favouriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const favBlog = blogs.reduce((accumulator, currentValue) => {
      //console.log("accumulator, currentValue", accumulator, currentValue)
      return accumulator.likes > currentValue.likes ? accumulator : currentValue
    })
    console.log("favBlog", favBlog)
    return {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    }
  }
  else {
    console.log("empty list")
    return { title: "", author: "", likes: 0 }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length > 0) {
    const authorList = blogs.map(blog => blog.author)
    //console.log("authorList", authorList)

    let uniqueAuthors = []  // just the names of authors, no duplicates

    authorList.forEach(author => {
      if (!uniqueAuthors.includes(author))
        uniqueAuthors = uniqueAuthors.concat(author)
    })
    //console.log("uniqueAuthors", uniqueAuthors)

    let highestAuthor = ""
    let highestNumber = 0

    uniqueAuthors.forEach(author => {
      const occurrences = authorList.filter(author2 => author === author2).length

      if (occurrences > highestNumber) {
        highestNumber = occurrences
        highestAuthor = author
      }
    })
    //console.log("highestAuthor, highestNumber", highestAuthor, highestNumber)

    return { author: highestAuthor, blogs: highestNumber }
  }
  else {
    return { author: "", blogs: 0 }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length > 0) {
    const authorList = blogs.map(blog => {
      return { author: blog.author, likes: blog.likes }
    })
    //console.log("authorList", authorList)

    let uniqueAuthors = []
    let uniqueAuthorsLikes = []
    let index = -1

    authorList.forEach(entry => {
      //console.log("author.author", author.author)
      if (!uniqueAuthors.includes(entry.author)) {
        index++
        uniqueAuthorsLikes[index] = 0
        uniqueAuthors = uniqueAuthors.concat(entry.author)
        uniqueAuthorsLikes[index] += entry.likes
      }
      else {
        uniqueAuthorsLikes[index] += entry.likes
      }
    })
    //console.log("uniqueAuthors", uniqueAuthors)
    //console.log("uniqueAuthorsLikes", uniqueAuthorsLikes)

    const highestLikes = uniqueAuthorsLikes.reduce((accumulator, currentValue) => {
      return accumulator > currentValue ? accumulator : currentValue
    })
    const highestLikesIndex = uniqueAuthorsLikes.findIndex((element) => element === highestLikes)

    return { author: uniqueAuthors[highestLikesIndex], likes: highestLikes }
  }
  else {
    return { author: "", likes: 0 }
  }
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}