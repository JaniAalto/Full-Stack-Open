import { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const Input = styled.input`
  margin: 0.25em;
  width: 200px;
`

const CreateBlogForm = ({ createBlog, Button }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const makeBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    //console.log("creating blog:", blogObject)

    createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  CreateBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return (
    <form
      onSubmit={makeBlog}>
      <div>Title: <Input value={newTitle} onChange={handleTitleChange} id='title' /></div>
      <div>Author: <Input value={newAuthor} onChange={handleAuthorChange} id='author' /></div>
      <div>url: <Input value={newUrl} onChange={handleUrlChange} id='url' /></div>
      <div><Button type="submit" id='submit-button'>Create</Button> </div>
    </form>
  )
}


export default CreateBlogForm