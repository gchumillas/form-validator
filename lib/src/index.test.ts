import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

test('There is an invalid field', () => {
  const { result } = renderHook(() =>
    useValidator({ defaultValidator: val => !!val || 'Required field' })
  )

  act(() =>
    expect(
      result.current.test({
        username: 'John',
        password: ''
      })
    ).toBe(false)
  )
  expect(result.current.text('username')).toBe(undefined)
  expect(result.current.text('password')).toBe('Required field')
})

test('All fields are OK', () => {
  const { result } = renderHook(() =>
    useValidator({ defaultValidator: val => !!val || 'Required field' })
  )

  act(() =>
    expect(
      result.current.test({
        username: 'John',
        password: 'xxx'
      })
    ).toBe(true)
  )
  expect(result.current.text('username')).toBe(undefined)
  expect(result.current.text('password')).toBe(undefined)
})
