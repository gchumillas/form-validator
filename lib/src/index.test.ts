import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

test('should test', () => {
  const item = {
    username: 'john',
    password: 'xxx',
    rePassword: 'xxx',
    gender: 'male'
  }
  const { result } = renderHook(() =>
    useValidator({
      defaultValidator: val => !!val || 'Required field',
      validators: defaultValidator => ({
        rePassword: [defaultValidator, val => val == 'yyy' || 'Passwords do not match'],
        gender: [val => !val || ['male', 'female', 'butterfly'].includes(val) || 'Unknown gender']
      })
    })
  )

  act(() => {
    result.current.test(item)
  })

  expect(result.current.text('rePassword')).toBe('Passwords do not match')
})
