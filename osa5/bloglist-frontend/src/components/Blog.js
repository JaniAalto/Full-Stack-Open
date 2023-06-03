import { useState } from 'react'


const Blog = ({ blog, addLike, currentUser, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)
  let authorised = false

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  let usersName = ""
  let userId = ""
  let userUserName = ""

  if (blog.user) {
    usersName = blog.user.name
    userId = blog.user.id
    userUserName = blog.user.username
  }
  else
    usersName = "no user"

  if (userUserName === currentUser)
    authorised = true
  const showWhenAuthorised = { display: authorised ? '' : 'none' }

  //console.log("userUserName, currentUser", userUserName, currentUser)


  const blogObject = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
    user: userId
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenExpanded}>
        {blog.title} by {blog.author} <button onClick={toggleExpanded}>view</button>
      </div>
      <div style={showWhenExpanded}>
        {blog.title} by {blog.author} <button onClick={toggleExpanded}>cancel</button><br></br>
        {blog.url}<br></br>
        {blog.likes} likes <button onClick={() => addLike(blog.id, blogObject)}>like</button><br></br>
        {usersName}<br></br>
        <div style={showWhenAuthorised}>
          <button onClick={() => deleteBlog(blog.id, blog.title)}>delete</button>
        </div>
      </div>
    </div>
  )
}


export default Blog