import { renderHook, act } from '@testing-library/react-hooks'
import _ from 'lodash'
import { useValidator } from './index'

const errors = {
  requiredFields: 'Required fields',
  doNotMatch: 'Passwords do not match',
  unknownGender: 'Unknown gender'
}

describe('validator', () => {
  const item = { username: 'John', password: '', rePassword: '', gender: '' }
  const { result } = renderHook(() =>
    useValidator({
      fields: _.keys(item),
      defaultValidator: val => !!val || errors.requiredFields,
      validators: defaultValidator => ({
        rePassword: [
          defaultValidator,
          (val, fields) => val == fields.password || errors.doNotMatch
        ],
        gender: [
          val => !val || ['male', 'female', 'butterfly'].includes(val) || errors.unknownGender
        ]
      })
    })
  )

  test('required fields', () => {
    act(() => expect(result.current.test(item)).toBe(false))
    expect(result.current.text('username')).toBeUndefined()
    expect(result.current.text('password')).toBe(errors.requiredFields)
    expect(result.current.text('rePassword')).toBe(errors.requiredFields)
    expect(result.current.text('gender')).toBeUndefined()
  })

  test('passwords do not match', () => {
    act(() =>
      expect(result.current.test({ ...item, password: 'xxx', rePassword: 'yyyy' })).toBe(false)
    )
    expect(result.current.text('username')).toBeUndefined()
    expect(result.current.text('password')).toBeUndefined()
    expect(result.current.text('rePassword')).toBe(errors.doNotMatch)
    expect(result.current.text('gender')).toBeUndefined()
  })

  test('unknown gender', () => {
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

  test('Ignore extra field', () => {
    act(() =>
      expect(
        result.current.test({
          ...item,
          password: 'xxx',
          rePassword: 'xxx',
          gender: 'male',
          extra: ''
        })
      ).toBe(true)
    )
  })
})
