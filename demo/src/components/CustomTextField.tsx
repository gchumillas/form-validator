import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

export type CustomTextFieldProps = TextFieldProps & {
  errorText?: React.ReactNode
}

export default ({ errorText, ...rest }: CustomTextFieldProps) => {
  return <TextField error={!!errorText} helperText={errorText} {...rest} />
}
