import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

const errors = {
  requiredFields: 'Required fields',
  doNotMatch: 'Passwords do not match',
  unknownGender: 'Unknown gender'
}

test('validator', () => {
  const item = { username: 'John', password: '', rePassword: '', gender: '' }
  const { result } = renderHook(() =>
    useValidator({
      defaultValidator: val => !!val || errors.requiredFields,
      validators: defaultValidator => ({
        rePassword: [defaultValidator, val => val == 'xxx' || errors.doNotMatch],
        gender: [
          val => !val || ['male', 'female', 'butterfly'].includes(val) || errors.unknownGender
        ]
      })
    })
  )

  // Required fields
  act(() => expect(result.current.test(item)).toBe(false))
  expect(result.current.text('username')).toBeUndefined()
  expect(result.current.text('password')).toBe(errors.requiredFields)
  expect(result.current.text('rePassword')).toBe(errors.requiredFields)
  expect(result.current.text('gender')).toBeUndefined()

  // Passwords do not match
  act(() =>
    expect(result.current.test({ ...item, password: 'xxx', rePassword: 'yyyy' })).toBe(false)
  )
  expect(result.current.text('username')).toBeUndefined()
  expect(result.current.text('password')).toBeUndefined()
  expect(result.current.text('rePassword')).toBe(errors.doNotMatch)
  expect(result.current.text('gender')).toBeUndefined()

  // Unknown gender
  act(() =>
    expect(
      result.current.test({ ...item, password: 'xxx', rePassword: 'xxx', gender: 'beetle' })
    ).toBe(false)
  )
  expect(result.current.text('username')).toBeUndefined()
  expect(result.current.text('password')).toBeUndefined()
  expect(result.current.text('rePassword')).toBeUndefined()
  expect(result.current.text('gender')).toBe(errors.unknownGender)
})
