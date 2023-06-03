import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'


test("renders additional elements after button is pressed", async () => {
  const blogObject = {
    title: "Test Title",
    author: "Test Author",
    url: "test.com"
  }

  const mockHandler = jest.fn()

  render(<CreateBlogForm createBlog={mockHandler} />)

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], "Test Title")
  await user.type(inputs[1], "Test Author")
  await user.type(inputs[2], "test.com")
  const button = screen.getByText('Create')
  await user.click(button)

  //screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls).toContainEqual([blogObject])
})