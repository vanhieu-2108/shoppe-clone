import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  pageSize: number
  queryConfig: QueryConfig
}
const RANGE = 2
export default function Pagination({ pageSize, queryConfig }: Props) {
  const page = Number(queryConfig.page)
  const renderPaginattion = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='px-3 py-2 mx-2 bg-white rounded shadow-sm cursor-pointer'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='px-3 py-2 mx-2 bg-white rounded shadow-sm cursor-pointer'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('px-3 py-2 mx-2 bg-white rounded shadow-sm cursor-pointer border', {
              'border border-cyan-500': pageNumber === page,
              'border-transparent border': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap justify-center mt-6'>
      {page === 1 ? (
        <span className='px-3 py-2 mx-2 rounded shadow-sm cursor-not-allowed bg-white/60'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: String(page - 1)
            }).toString()
          }}
          className='px-3 py-2 mx-2 bg-white rounded shadow-sm cursor-pointer'
        >
          Prev
        </Link>
      )}
      {renderPaginattion()}
      {page === pageSize ? (
        <span className='px-3 py-2 mx-2 rounded shadow-sm cursor-not-allowed bg-white/60'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: String(page + 1)
            }).toString()
          }}
          className='px-3 py-2 mx-2 bg-white rounded shadow-sm cursor-pointer'
        >
          Next
        </Link>
      )}
    </div>
  )
}
