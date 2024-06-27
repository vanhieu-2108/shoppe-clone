import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { purchasesStatus } from 'src/constants/purchase'
import { getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const queryClient = useQueryClient()
  const { isAuthenticated, profile, setIsAuthenticated, setProfile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='flex justify-end'>
      <Popover
        className='flex items-center py-1 text-white cursor-pointer hover:text-white/70'
        renderPopover={
          <div className='relative p-2 bg-white border border-gray-200 rounded-sm shadow-md '>
            <div className='flex flex-col pl-1 text-black pr-28'>
              <button onClick={() => changeLanguage('vi')} className='px-3 py-2 text-left hover:text-orange'>
                Tiếng Việt
              </button>
              <button onClick={() => changeLanguage('en')} className='px-3 py-2 mt-2 text-left hover:text-orange'>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 ml-6 cursor-pointer hover:text-gray-300'
          renderPopover={
            <div className='relative bg-white border border-gray-200 rounded-sm shadow-md'>
              <div className='flex flex-col gap-3 p-4 text-sm text-black'>
                <Link to={path.profile} className='text-left hover:text-cyan-400'>
                  Tài Khoản Của Tôi
                </Link>
                <Link to={path.historyPurchase} className='text-left hover:text-cyan-400'>
                  Đơn Mua
                </Link>
                <button onClick={handleLogout} className='text-left hover:text-cyan-400'>
                  Đăng Xuất
                </button>
              </div>
            </div>
          }
        >
          <div className='flex-shrink-0 w-6 h-6 mr-2'>
            <img src={getAvatarUrl(profile?.avatar)} alt='' className='object-cover w-full h-full rounded-full' />
          </div>
          <div>{profile?.name || profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center ml-3'>
          <Link to={path.register} className='capitalize hover:text-white/70'>
            Đăng ký
          </Link>
          <div className='mx-3 border-r-[1px] border-r-white/40 h-4 '></div>
          <Link to={path.login} className='capitalize hover:text-white/70'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
