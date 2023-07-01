import { useParams } from 'react-router-dom'
import { useState } from 'react'
import blogService from '../services/blogs.js'
import styled from 'styled-components'


const Button = styled.button`
  background: "SeaShell";
  padding: 6px 12px;
  border: 2px solid black;
  border-radius: 3px;
  margin-left: 0.3em
`
const SecondaryButton = styled(Button)`
  background: "LightGrey";
  padding: 3px 12px;
  border: 2px solid DimGrey;
  margin-left: 0.3em
`
const List = styled.ul`
  padding: 5px 20px;
  line-height: 2em;
`
const Input = styled.input`
  margin: 0.25em;
  width: 300px;
`

const BlogView = ({ blogs, addLike }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)
  //console.log("blog", blog)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    //console.log("comment", comment)
    const commentObject = { comment: comment }

    blogService.postComment(id, commentObject).then(() =>
      setComment("")
    )
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <SecondaryButton onClick={() => addLike(blog.id)}>like</SecondaryButton></p>
      <p>Added by <b>{blog.user.name}</b></p>
      <br />
      <hr />
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <Input value={comment} onChange={({ target }) => setComment(target.value)} />
        <Button type="submit">Add</Button>
      </form>
      <List>
        {blog.comments.map(comment =>
          <li key={comment}> {comment}</li>
        )}
      </List>
    </div>
  )
}

export default BlogView