import React from 'react'
import _ from 'lodash'

export type Validator = (val: any, fields: { [name: string]: any }) => string | true

export const useValidator = ({
  fields,
  defaultValidator = () => true,
  validators
}: {
  fields?: string[]
  defaultValidator?: Validator
  validators?:
    | { [name: string]: Validator[] }
    | ((defaultValidator: Validator) => { [name: string]: Validator[] })
}) => {
  const [texts, setTexts] = React.useState<{ [name: string]: string | true }>({})

  return {
    test: (values: { [name: string]: any }) => {
      const texts = _.mapValues(values, (value, name) => {
        // ignores not listed fields
        if (fields && !fields.includes(name)) {
          return true
        }

        const v = _.isFunction(validators) ? validators(defaultValidator) : validators
        const fieldValidators = v?.[name] || [defaultValidator]

        for (const validator of fieldValidators) {
          const result = validator(value, values)
          if (typeof result == 'string') {
            console.info(`validator: ${name} is not valid`)
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
