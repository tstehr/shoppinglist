import { describe, expect, it } from 'vitest'
import { errorMap, getLiteralKeys } from './validation.js'

describe('errorMap', () => {
  it('Shows error with element index', () => {
    expect(() => {
      errorMap([0, 1, 2, 3, 4], (el) => {
        if (el === 3) {
          throw Error('Ich nehm die Nummer 3')
        }

        return el
      })
    }).toThrow('Error in element 3: Ich nehm die Nummer 3')
  })

  it('Shows error with element index and string if element is string', () => {
    expect(() => {
      errorMap(['zero', 'one', 'two', 'three', 'four'], (el) => {
        if (el === 'three') {
          throw Error('Ich nehm die Nummer 3')
        }

        return el
      })
    }).toThrow('Error in element 3 ("three"): Ich nehm die Nummer 3')
  })

  it('Shows error with element index and idenfification if element is object with field id', () => {
    expect(() => {
      errorMap(
        [
          {
            id: 'zero',
          },
          {
            id: 'one',
          },
          {
            id: 'two',
          },
          {
            id: 'three',
          },
          {
            id: 'four',
          },
        ],
        (el) => {
          if (el.id === 'three') {
            throw Error('Ich nehm die Nummer 3')
          }

          return el
        },
      )
    }).toThrow('Error in element 3 (id="three"): Ich nehm die Nummer 3')
  })
})

describe('getLiteralKeys', () => {
  it('Gets the keys of an object', () => {
    const keys = getLiteralKeys({
      a: 1,
      b: '2',
      c: null,
    })
    expect(keys.length).toBe(3)
    expect(keys).toEqual(expect.arrayContaining(['a', 'b', 'c']))
  })
})
