A React Form Validator.

## Install

This library requires [React](https://www.npmjs.com/package/react). Make sure it's already installed. Then execute the following command:

```bash
npm install @plastic-ui/form-validator

# or

yarn add @plastic-ui/form-validator
```

## Usage

Declare the rules:

```ts
const validator = useValidator({
  // Default validator (applied when no validator is specified)
  defaultValidator: val => !!val || 'Required field',
  // Custom validators
  validators: defaultValidator => ({
    // rePassword is required (defaultValidator) and should be equal to password
    rePassword: [defaultValidator, val => val == item.password || 'Passwords do not match'],
    // Gender is not required, but when specified it must be one of the following values:
    gender: [val => !val || ['male', 'female', 'butterfly'].includes(val) || 'Unknown gender']
  })
})
```

Test the rules on submit:

```ts
const onSubmit = () => {
  setMessage('')
  if (!validator.test(item)) {
    return
  }

  setMessage('Hooray! you got it!')
}
```

Print the errors (if any):

```ts
<CustomTextField
  required
  label="Username"
  value={item.username}
  onChange={onFieldChange('username')}
  errorText={validator.text('username')}
/>
```

You'll find a complete example [here](https://github.com/gchumillas/form-validator/blob/main/demo/src/App.tsx).

## Demo

To start the demo simply:

```bash
# clone this repository
git clone https://github.com/gchumillas/form-validator

# install dependencies
cd validator
yarn

# and run the demo (it takes a while, be patient)
yarn demo
```
