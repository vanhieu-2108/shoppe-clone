import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
      message: 'Email không hợp lệ'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 đến 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 đến 160 kí tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài tự 5 đến 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài tự 5 đến  160 kí tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirmpassword là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài tự 5 đến 160 kí tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài tự 5 đến  160 kí tự'
    },
    validate:
      typeof getValues === 'function'
        ? (value: string) => value === getValues('password') || 'Nhập lại password không khởp'
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(5, 'Độ dài tự 5 đến 160 kí tự')
    .max(160, 'Độ dài từ 5 đến 160 kí tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

const schema = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài tự 5 đến 160 kí tự')
    .max(160, 'Độ dài tự 5 đến 160 kí tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().required('Tên sản phẩm là bắt buộc').trim()
})
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 kí tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 kí tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 kí tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password')
})
export type UserSchema = yup.InferType<typeof userSchema>
export type Schema = yup.InferType<typeof schema>
export default schema
