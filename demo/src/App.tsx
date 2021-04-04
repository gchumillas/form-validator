import React from 'react'
import { Button } from '@material-ui/core'
import CustomTextField from './components/CustomTextField'
import { useValidator } from '@plastic-ui/form-validator'

export default () => {
  const [message, setMessage] = React.useState('')
  const [item, setItem] = React.useState({
    username: '',
    password: '',
    rePassword: '',
    gender: ''
  })

  const validator = useValidator({
    // Default validator (applied when no validator is specified)
    defaultValidator: val => !!val || 'Required field',
    // Custom validators
    validators: defaultValidator => ({
      // rePassword is required (defaultValidator) and should be equal to password
      rePassword: [defaultValidator, val => val == item.password || 'Passwords do not match'],
      // Gender is not required, but when specified it must be one of the following values:
      gender: [val => !val || ['male', 'female', 'butterfly'].includes(val) || 'Unknown gender']
    })
  })

  const onFieldChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem(item => ({ ...item, [name]: event.target.value }))
  }

  const onSubmit = () => {
    setMessage('')
    if (!validator.test(item)) {
      return
    }

    setMessage('Hooray! you got it!')
  }

  return (
    <>
      <CustomTextField
        required
        label="Username"
        value={item.username}
        onChange={onFieldChange('username')}
        errorText={validator.text('username')}
      />
      <CustomTextField
        required
        type="password"
        label="Password"
        value={item.password}
        onChange={onFieldChange('password')}
        errorText={validator.text('password')}
      />
      <CustomTextField
        required
        type="password"
        label="Repeat password"
        value={item.rePassword}
        onChange={onFieldChange('rePassword')}
        errorText={validator.text('rePassword')}
      />
      <CustomTextField
        label="Gender"
        value={item.gender}
        onChange={onFieldChange('gender')}
        errorText={validator.text('gender')}
      />
      <Button onClick={onSubmit}>Submit</Button>
      <p>{message}</p>
    </>
  )
}
