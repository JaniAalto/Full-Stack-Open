import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'

import { setNotification, setErrorNotification } from './reducers/notificationReducer'
import { initialiseBlogs, createNewBlog, deleteBlogById, voteFor } from './reducers/blogReducer'
import { doLogin, doLogout, setUser, getAllUsers } from './reducers/userReducer'
import blogService from './services/blogs'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'


const Page = styled.div`
  background: Lavender; 
  padding: 1.5em;

  h1 {
    text-align: center;
    font-family: monospace;
    text-shadow: 2px 1px 2px Plum;
  }
  h2 {
    font-weight: bold;
  }
`
const Navigation = styled.div`
  background: MidnightBlue;
  padding: 1.5em;

  span {
    color: white;
    float: right;
    margin-top: -0.3em
  }
`
const Button = styled.button`
  background: "SeaShell";
  padding: 6px 12px;
  border: 2px solid black;
  border-radius: 3px;
`
const List = styled.div`
  line-height: 2.2em;
`

const Menu = ({ userName, handleLogout }) => {
  const linkStyle = {
    padding: 7,
    color: 'white',
    borderStyle: 'dotted',
    borderWidth: 1,
    margin: 5,
    fontSize: '1.2em'
  }
  return (
    <div>
      <Link style={linkStyle} to="/">Blogs</Link>
      <Link style={linkStyle} to="/users">Users</Link>
      <span><i>Logged in as: </i><b>{userName} </b>
        <Button onClick={handleLogout}>Logout</Button></span>
    </div>
  )
}

const BlogForm = ({ togglableRef, createBlog }) => {
  return (
    <div>
      <Togglable buttonLabel='Create new' ref={togglableRef}>
        <CreateBlogForm createBlog={createBlog} Button={Button} />
      </Togglable>
      <br /></div>
  )
}

const BlogList = ({ sortedBlogs, addLike, user, deleteBlog }) => {
  return (
    sortedBlogs.map(blog =>
      <List key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>
          <Blog key={blog.id} blog={blog} addLike={addLike}
            userId={user.id} currentUser={user.username} deleteBlog={deleteBlog} />
        </Link>
      </List>
    )
  )
}


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const togglableRef = useRef()

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  //console.log("user", user)
  const allUsers = useSelector(state => state.allUsers)
  //console.log("allUsers", allUsers)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    //console.log("loggedUserJSON", loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      console.log("set user", user)
      blogService.setToken(user.token)
    }
    dispatch(initialiseBlogs())
    dispatch(getAllUsers())
  }, [dispatch])

  const handleLogin = async (event) => {
    console.log('logging in with', username, password)
    event.preventDefault()

    const user = await dispatch(doLogin({
      username, password
    }))
    if (typeof user === 'object') {
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    }
    if (typeof user === 'string') {
      dispatch(setErrorNotification("Wrong username or password", 5))
    }
  }

  const handleLogout = async () => {
    dispatch(doLogout())
    setUsername('')
    setPassword('')
    window.localStorage.removeItem('loggedInUser')
  }

  const createBlog = async (blogObject) => {
    blogObject.user = user.name
    blogObject.username = user.username
    blogObject.userId = user.id
    console.log("blogObject", blogObject)

    const response = await dispatch(createNewBlog(blogObject))
    console.log("response", response)

    if (typeof response === 'string') {
      dispatch(setErrorNotification(`Error: ${response}`, 5))
    }
    if (typeof response === 'object') {
      dispatch(setNotification(`Added ${response.title} by ${response.author}`, 5))
    }
  }

  const addLike = async (blogId, blogObject) => {
    //console.log("blogId, blogObject", blogId, blogObject)
    dispatch(voteFor(blogId, blogObject))
  }

  const deleteBlog = async (blogId, blogTitle) => {
    if (window.confirm(`Delete ${blogTitle}?`)) {
      dispatch(deleteBlogById(blogId))

      console.log("deleted", blogId)
      dispatch(setNotification(`${blogTitle} deleted`, 5))
    }
  }

  const unsortedBlogs = useSelector(state => state.blogs)
  //console.log("unsortedBlogs", unsortedBlogs)
  const sortedBlogs = unsortedBlogs.toSorted((a, b) => b.likes - a.likes)


  if (!user) {
    return (
      <div>
        <Togglable buttonLabel='Login' >
          <Notification />
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
      <Page>
        <Router>
          <Navigation>
            <Menu userName={user.name} handleLogout={handleLogout} />
          </Navigation>
          <h1>Blog app</h1>
          <Notification />
          <Routes>
            <Route path="/" element={<div>
              <h2>Blogs:</h2>
              <BlogForm togglableRef={togglableRef} createBlog={createBlog} />
              <BlogList sortedBlogs={sortedBlogs}
                addLike={addLike} user={user} deleteBlog={deleteBlog} />
            </div>} />
            <Route path="/users" element={<div>
              <h2>Users:</h2>
              <Users users={allUsers} />
            </div>} />
            <Route path="/users/:id" element={<User users={allUsers} />} />
            <Route path="/blogs/:id" element={<BlogView blogs={sortedBlogs} addLike={addLike} />} />
          </Routes>
        </Router>
      </Page>
    )
  }
}


export default App