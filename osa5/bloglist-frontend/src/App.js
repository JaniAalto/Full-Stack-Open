import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messageText, setMessageText] = useState(null)
  const [isError, setIsError] = useState(false)
  const togglableRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log('set user', user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    console.log('logging in with', username, password)
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
    } catch (exception) {
      setMessageText('wrong username or password')
      setIsError(true)
      setTimeout(() => {
        setMessageText(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.removeItem('loggedInUser')
  }

  const createBlog = async (blogObject) => {
    const response = await blogService.create(blogObject)
      .catch(error => {
        console.log(error.response.data)

        setIsError(true)
        setMessageText(`Error: ${error.response.data}`)
        setTimeout(() => {
          setMessageText(null)
        }, 5000)
      })

    if (response) {
      //console.log("response", response)

      const newBlog = await blogService.getOne(response.id).catch(error =>
        console.log(error.response.data)
      )
      setBlogs(blogs.concat(newBlog))
      console.log("added", newBlog)

      setIsError(false)
      setMessageText(`Added ${response.title} by ${response.author}`)
      setTimeout(() => {
        setMessageText(null)
      }, 5000)

      togglableRef.current.toggleVisibility()
    }
  }

  const addLike = async (blogId, blogObject) => {
    console.log("blogObject", blogObject)
    await blogService.update(blogId, blogObject).catch(error =>
      console.log(error.response.data)
    )
    setBlogs(await blogService.getAll())
  }

  const deleteBlog = async (blogId, blogTitle) => {
    if (window.confirm(`Delete ${blogTitle}?`)) {
      await blogService.remove(blogId).catch(error =>
        console.log(error.response.data)
      )
      console.log("deleted", blogId)

      setIsError(false)
      setMessageText(`${blogTitle} deleted`)
      setTimeout(() => {
        setMessageText(null)
      }, 5000)

      setBlogs(await blogService.getAll())
    }
  }


  blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <Togglable buttonLabel='Login' >
          <Notification message={messageText} error={isError} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        </Togglable>
      </div>
    )
  }
  else {
    return (
      <div>
        <Notification message={messageText} error={isError} />
        <p>Current user: {user.name} <button onClick={handleLogout}>Logout</button> </p>
        <h2>Blogs</h2>
        <Togglable buttonLabel='Create new' ref={togglableRef}>
          <CreateBlogForm createBlog={createBlog} />
        </Togglable>
        <br></br>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} userId={user.id} currentUser={user.username}
            deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }
}


export default App