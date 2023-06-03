import { useState } from 'react'
import PropTypes from 'prop-types'


const CreateBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    //console.log(event.target.value)
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    //console.log(event.target.value)
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    //console.log(event.target.value)
    setNewUrl(event.target.value)
  }

  const makeBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    console.log("creating", blogObject)

    createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  CreateBlogForm.propTypes = {
    makeBlog: PropTypes.func.isRequired
  }

  return (
    <form
      onSubmit={makeBlog}>
      <div>Title: <input value={newTitle} onChange={handleTitleChange} id='title' /></div>
      <div>Author: <input value={newAuthor} onChange={handleAuthorChange} id='author' /></div>
      <div>url: <input value={newUrl} onChange={handleUrlChange} id='url' /></div>
      <div><button type="submit" id='submit-button'>Create</button> </div>
    </form>
  )
}


export default CreateBlogForm