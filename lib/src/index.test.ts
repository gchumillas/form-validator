import { renderHook, act } from '@testing-library/react-hooks'
import { useValidator } from './index'

test('testing useValidator', () => {
  const { result } = renderHook(() =>
    useValidator({ defaultValidator: val => !!val || 'Required field' })
  )

  describe('testing defaultValidator', () => {
    const item = {
      username: 'John',
      password: ''
    }

    // test('invalid field')
    act(() => expect(result.current.test(item)).toBe(false))
    expect(result.current.text('password')).toBe('Required field')

    // test('all fields are OK')
    act(() => expect(result.current.test({ ...item, password: 'xxx' })).toBe(true))
    expect(result.current.text('username')).toBe(undefined)
    expect(result.current.text('password')).toBe(undefined)
  })
})
