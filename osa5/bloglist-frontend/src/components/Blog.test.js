import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test("renders only title and author", () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "test.com",
    likes: 1,
    user: "Test User"
  }

  render(<Blog blog={blog} />)

  screen.debug()

  const element = screen.getByText("Test Title by Test Author")
  expect(element).toBeDefined()
  const element2 = screen.getByText("test.com", { exact: false })
  expect(element2).not.toBeVisible()
  const element3 = screen.getByText("1 likes", { exact: false })
  expect(element3).not.toBeVisible()
})

test("renders additional elements after button is pressed", async () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "test.com",
    likes: 1
  }
  blog.user = {
    name: "Test User",
    id: "",
    username: "testusername"
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  //screen.debug()

  const element = screen.getByText("test.com", { exact: false })
  expect(element).toBeDefined()
  const element2 = screen.getByText("1 likes", { exact: false })
  expect(element2).toBeDefined()
  const element3 = screen.getByText("Test User", { exact: false })
  expect(element3).toBeDefined()
})

test("clicking like twice calls the function twice", async () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "test.com",
    likes: 1
  }
  blog.user = {
    name: "Test User",
    id: "",
    username: "testusername"
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} addLike={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  //screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(2)
})