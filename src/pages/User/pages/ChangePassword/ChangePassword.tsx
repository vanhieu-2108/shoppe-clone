import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    }
  })
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      reset({
        confirm_password: '',
        new_password: '',
        password: ''
      })
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData] as string,
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='px-2 pb-10 bg-white rounded-sm shadow md:pb-20 md:px-7'>
      <div className='py-6 border-b border-b-gray-200'>
        <h1 className='text-lg font-medium text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
        <form onSubmit={onSubmit} className='max-w-2xl mt-8 mr-auto'>
          <div className='flex-grow mt-6 md:pr-12 md:mt-0'>
            <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
              <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Mật khẩu cũ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  type='password'
                  name='password'
                  placeholder='Mật khẩu cũ'
                  register={register}
                  errorMessage={errors.password?.message}
                  className='relative'
                  classNameInput='!pr-10 w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
            <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
              <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Mật khẩu mới</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  type='password'
                  name='new_password'
                  placeholder='Mật khẩu mới'
                  register={register}
                  errorMessage={errors.new_password?.message}
                  className='relative'
                  classNameInput='!pr-10 w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
            <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
              <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Nhập lại mật khẩu</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  type='password'
                  name='confirm_password'
                  placeholder='Nhập lại mật khẩu'
                  register={register}
                  errorMessage={errors.confirm_password?.message}
                  className='relative'
                  classNameInput='!pr-10 w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                />
              </div>
            </div>
            <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
              <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  type='submit'
                  className='flex items-center px-5 text-sm text-center text-white rounded-sm h-9 bg-orange hover:bg-orange/80'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
