import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

test('defaultValidator', () => {
  const item = { username: 'John', password: '' }
  const { result } = renderHook(() =>
    useValidator({ defaultValidator: val => !!val || 'Required field' })
  )

  act(() => expect(result.current.test(item)).toBe(false))
  expect(result.current.text('username')).toBe(undefined)
  expect(result.current.text('password')).toBe('Required field')

  act(() => expect(result.current.test({ ...item, password: 'xxx' })).toBe(true))
  expect(result.current.text('username')).toBe(undefined)
  expect(result.current.text('password')).toBe(undefined)
})
