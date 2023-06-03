const Notification = ({ message, error }) => {
  const messageStyle = {
    color: 'green',
    fontStyle: 'bold',
    background: 'lightgrey',
    fontSize: 20,
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    fontStyle: 'bold',
    background: 'lightgrey',
    fontSize: 20,
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div className="error" style={errorStyle}>
        {message}
      </div>
    )
  }
  return (
    <div className="message" style={messageStyle}>
      {message}
    </div>
  )
}

export default Notification