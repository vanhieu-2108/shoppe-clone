import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { sortBy, order as orderConstant } from 'src/constants/product'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  pageSize: number
  queryConfig: QueryConfig
}

export default function SortProductList({ pageSize, queryConfig }: Props) {
  const navigate = useNavigate()
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='px-3 py-4 bg-gray-300/40'>
      <div className='flex flex-wrap items-center justify-between'>
        <div className='flex flex-wrap items-center gap-5 lg:gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 text-sm text-center  capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 text-sm text-center  capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 text-sm text-center  capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8 px-4 text-sm text-left md:mb-0 capitalize outline-none ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='text-black bg-white' value='' disabled>
              Giá
            </option>
            <option className='text-black bg-white' value={orderConstant.asc}>
              Giá: Thấp đến cao
            </option>
            <option className='text-black bg-white' value={orderConstant.desc}>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center mt-5 lg:mt-0'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex ml-2'>
            {page === 1 ? (
              <span className='flex items-center justify-center h-8 px-3 rounded-tl-sm rounded-bl-sm shadow cursor-not-allowed bg-white/60 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center h-8 px-3 bg-white rounded-tl-sm rounded-bl-sm shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex items-center justify-center h-8 px-3 rounded-tl-sm rounded-bl-sm shadow cursor-not-allowed bg-white/60 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center h-8 px-3 bg-white rounded-tl-sm rounded-bl-sm shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
