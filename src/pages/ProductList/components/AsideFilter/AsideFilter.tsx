import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import shema, { Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefiendField } from 'src/types/utils.type'
import RatingStars from '../RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'
interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

// type ExcludeNonable<T> = {
//   [k in keyof T]-?: ''
// }

type FormData = NoUndefiendField<Pick<Schema, 'price_min' | 'price_max'>>
/**
 * Rule validate
 * Nếu có price_min và price_max thì giá price_max > or = price_min
 * Còn không thì có price_min thì không có price max và ngược lại
 */
const priceSchema = shema.pick(['price_min', 'price_max'])
export default function AsideFilter({ categories, queryConfig }: Props) {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver<any>(priceSchema)
  })
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max || '',
        price_min: data.price_min || ''
      }).toString()
    })
  })
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'rating_filter', 'price_min', 'price_max']
        )
      ).toString()
    })
    reset({
      price_max: '',
      price_min: ''
    })
  }
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside filter.all categories')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <ul>
        {categories.map((categoryItem) => (
          <li key={categoryItem._id} className='py-2 pl-2'>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('relative px-2', {
                'text-orange font-semibold': category === categoryItem._id,
                'text-black ': category !== categoryItem._id
              })}
            >
              {category === categoryItem._id && (
                <svg viewBox='0 0 4 7' className='fill-orange h-2 w-2 absolute top-1 left-[-10px]'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {categoryItem.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={path.home} className='flex items-center mt-4 font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-3 h-4 mr-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.filter search')}
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div className='my-5'>
        <div>Khoản giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => (
                <InputNumber
                  classNameError='hidden'
                  type='text'
                  className='grow'
                  classNameInput='w-full p-1 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='₫ TỪ'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                />
              )}
            />
            {/* <InputV2
              control={control}
              name='price_min'
              classNameError='hidden'
              type='number'
              className='grow'
              classNameInput='w-full p-1 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
              placeholder='₫ TỪ'
              onChange={(event) => {
                trigger('price_max')
              }}
            /> */}
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              name='price_max'
              control={control}
              render={({ field }) => (
                <InputNumber
                  classNameError='hidden'
                  type='text'
                  className='grow'
                  classNameInput='w-full p-1 border border-gray-300 rounded-sm outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='₫ ĐẾN'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>
          <Button className='flex items-center justify-center w-full p-2 text-sm text-white bg-orange hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <Button
        onClick={handleRemoveAll}
        className='flex items-center justify-center w-full p-2 text-sm text-white bg-orange hover:bg-orange/80'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
