export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const phoneNumberPattern = /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/
export const emailPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
export const numberPattern = /^\d+$/
export const passwordPattern = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
const notUrlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/

export const valid_rules = {
  required: (value: string): true | string => !!value || 'Обязательное поле',
  maxPassword: (value: string, max_length: number): boolean | string => {
    if (!value) {
      return true
    }
    if (value.length < max_length) {
      return `Пароль должен содержать больше ${max_length || 6} символов`
    }
    return true
  },
  minPassword: (value: string | null | undefined, min_length: number): boolean | string => {
    if (!value) {
      return true
    }
    if (value.length < min_length) {
      return `Пароль должен содержать не меньше ${min_length || 6} символов`
    }
    return true
  },
  isPhoneNum: (value: string): true | string => phoneNumberPattern.test(value) ? true : 'Введите номер телефона',
  isEmail: (value: string): true | string => emailPattern.test(value) ? true : 'Введите корректный e-mail',
  isNumber: (value: string): true | string => numberPattern.test(value) ? true : 'Неверный формат записи',
  isCorrectPassword: (value: string): true | string => passwordPattern.test(value) ? true : 'Неподходящий пароль, нужно минимум 8 символов, хотя бы одна цифра и один специальный знак (.*?[#?!@$%^&*-)',
  isSamePassword: (value: string | null | undefined, retryValue: string | undefined): true | string => {
    if (!value || !retryValue) {
      return true
    }
    return value === retryValue ? true : 'Пароли не совпадают'
  },
  notUrl: (value: string): true | string => !value || !notUrlPattern.test(value) || 'Ссылка здесь не допускается',
}
