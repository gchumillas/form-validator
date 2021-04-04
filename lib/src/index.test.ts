import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

const errors = {
  requiredFields: 'Required fields',
  doNotMatch: 'Passwords do not match',
  unknownGender: 'Unknown gender'
}

test('validators', () => {
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

  act(() => expect(result.current.test(item)).toBe(false))
  expect(result.current.text('username')).toBeUndefined()
  expect(result.current.text('password')).toBe(errors.requiredFields)
  expect(result.current.text('rePassword')).toBe(errors.requiredFields)
  expect(result.current.text('gender')).toBeUndefined()

  act(() =>
    expect(result.current.test({ ...item, password: 'xxx', rePassword: 'yyyy' })).toBe(false)
  )
  expect(result.current.text('rePassword')).toBe(errors.doNotMatch)
})
