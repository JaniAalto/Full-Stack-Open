import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification[0])
  const error = useSelector(state => state.notification[1])
  //console.log("message", message)
  //console.log("error", error)

  const messageStyle = {
    color: 'green',
    fontStyle: 'bold',
    background: 'white',
    fontSize: 25,
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    fontStyle: 'bold',
    background: 'white',
    fontSize: 25,
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (!message || message === "") {
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