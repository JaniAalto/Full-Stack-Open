import PropTypes from 'prop-types'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <div>
          username
          <input
            type="text" value={username} name="Username" id='username'
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password" value={password} name="Password" id='password'
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </div>
  )
}

export default LoginForm