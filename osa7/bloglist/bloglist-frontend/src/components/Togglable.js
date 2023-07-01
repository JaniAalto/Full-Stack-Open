import {  useState, useImperativeHandle, forwardRef  } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'


const Button = styled.button`
background: "SeaShell";
padding: 6px 12px;
border: 2px solid black;
border-radius: 3px;
margin-top: 0.15em;
`
const SecondaryButton = styled(Button)`
background: "LightGrey";
padding: 3px 12px;
border: 2px solid DimGrey;
`

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <SecondaryButton onClick={toggleVisibility}>cancel</SecondaryButton>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable