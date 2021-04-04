import React from 'react'
import _ from 'lodash'

export type Validator = (val: any) => string | true

export const useValidator = ({
  defaultValidator = () => true,
  validators
}: {
  defaultValidator?: Validator
  validators?:
    | { [name: string]: Validator[] }
    | ((defaultValidator: Validator) => { [name: string]: Validator[] })
}) => {
  const [texts, setTexts] = React.useState<{ [name: string]: string | true }>({})

  return {
    test: (values: { [name: string]: any }, options?: { debug: boolean }) => {
      const texts = _.mapValues(values, (value, name) => {
        const v = _.isFunction(validators) ? validators(defaultValidator) : validators
        const fieldValidators = v?.[name] || [defaultValidator]

        for (const validator of fieldValidators) {
          const result = validator(value)
          if (typeof result == 'string') {
            options?.debug && console.info(`validator: ${name} is not valid`)
            return result
          }
        }

        return true
      })
      setTexts(texts)
      return _.every(texts, x => _.isEmpty(x))
    },
    text: (name: string) => {
      const text = texts[name]
      return typeof text == 'string' ? text : undefined
    }
  }
}
