import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'
type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth'])
// URL.createObjectURL(file)

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <>
      <div className='flex flex-col flex-wrap mt-6 sm:flex-row'>
        <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            name='name'
            placeholder='Tên'
            register={register}
            errorMessage={errors.name?.message}
            classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
          />
        </div>
      </div>
      <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
        <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <InputNumber
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}

export default function Profile() {
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { setProfile } = useContext(AppContext)
  const methods = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    }
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
    setValue
  } = methods
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        address: profile.address,
        avatar: profile.avatar,
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(),
        phone: profile.phone
      })
    }
  }, [profile, reset])
  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }
  const avatar = watch('avatar')
  return (
    <div className='px-2 pb-10 bg-white rounded-sm shadow md:pb-20 md:px7'>
      <div className='py-6 border-b border-b-gray-200'>
        <h1 className='text-lg font-medium text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className='flex flex-col-reverse mt-8 md:flex-row md:items-start'>
            <div className='flex-grow mt-6 md:pr-12 md:mt-0'>
              <div className='flex flex-col flex-wrap sm:flex-row'>
                <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Email</div>
                <div className='sm:w-[80%] sm:pl-5'>
                  <div className='pt-3 text-gray-700'>{profile?.email}</div>
                </div>
              </div>
              <Info />
              <div className='flex flex-col flex-wrap mt-2 sm:flex-row'>
                <div className='sm:w-[20%] line-clamp-1 pt-3 sm:text-right capitalize'>Địa chỉ</div>
                <div className='sm:w-[80%] sm:pl-5'>
                  <Input
                    name='address'
                    placeholder='Địa chỉ'
                    register={register}
                    errorMessage={errors.address?.message}
                    classNameInput='w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                  />
                </div>
              </div>
              <Controller
                control={control}
                name='date_of_birth'
                render={({ field }) => (
                  <DateSelect
                    errorMessage={errors.date_of_birth?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
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
            <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
              <div className='flex flex-col items-center'>
                <div className='w-24 h-24 my-5'>
                  <img
                    src={previewImage || getAvatarUrl(avatar)}
                    alt=''
                    className='object-cover w-full h-full rounded-full'
                  />
                </div>
                <InputFile onchange={handleChangeFile} />
                <div className='mt-3 text-gray-400'>
                  <div>Dụng lượng file tối đa 1 MB</div>
                  <div>Định dạng:.JPEG, .PNG</div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
