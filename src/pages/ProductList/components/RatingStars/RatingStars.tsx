import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

/**
 * index 0: Có 5 cái màu vàng tương úng từ indexStar 0 -> 4 đều màu vàng
 * index 1: Có 4 cái màu vàng tương ứng từ indexStar 0 -> 3
 * index 2: Có 3 cái màu vàng tương ứng từ indexStar 0 -> 2
 * index 3: có 2 cáo màu vàng tương ứng từ indexStar 0 > 1
 * index 4: Có 1 cái màu vàng tương ứng từ indexStar 0
 *
 * Chúng ta nhận ra là indexStar < 5 - index => màu vàng
 */

interface Props {
  queryConfig: QueryConfig
}

export default function RatingStars({ queryConfig }: Props) {
  const navigate = useNavigate()
  const hanldeFilterStar = (ratingFilter: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: ratingFilter.toString()
      }).toString()
    })
  }
  return (
    <ul className='my-3'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li className='py-1 pl-2' key={index}>
            <div
              className='flex items-center w-full text-sm cursor-pointer max-w-max'
              onClick={() => hanldeFilterStar(5 - index)}
              tabIndex={0}
              role='button'
              aria-hidden={true}
            >
              {Array(5)
                .fill(0)
                .map((_, indexStar) => {
                  if (indexStar < 5 - index) {
                    return (
                      <svg
                        key={indexStar}
                        enableBackground='new 0 0 15 15'
                        viewBox='0 0 15 15'
                        x={0}
                        y={0}
                        className='w-4 h-4 mr-1 text-yellow-400 fill-yellow-400'
                      >
                        <polygon
                          points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                      </svg>
                    )
                  }
                  return (
                    <svg key={indexStar} viewBox='0 0 30 30' className='w-4 h-4 mr-1 text-gray-400 fill-gray-400'>
                      <defs>
                        <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                          <stop offset='0%' stopColor='#FFD211' />
                          <stop offset='100%' stopColor='#FFAD27' />
                        </linearGradient>
                      </defs>
                      <path
                        fill='none'
                        fillRule='evenodd'
                        stroke='url(#star__hollow)'
                        strokeWidth={2}
                        d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                      />
                    </svg>
                  )
                })}
              {index !== 0 && <span>Trở lên</span>}
            </div>
          </li>
        ))}
    </ul>
  )
}
