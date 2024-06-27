import { Link } from 'react-router-dom'
import path from 'src/constants/path'
export default function NotFound() {
  return (
    <main className='flex flex-col items-center justify-center w-full h-screen'>
      <h1 className='font-extrabold tracking-widest text-gray-900 text-9xl'>404</h1>
      <div className='absolute px-2 text-sm text-white rounded bg-orange rotate-12'>Page Not Found</div>
      <button className='mt-5'>
        <Link
          to={path.home}
          className='relative inline-block text-sm font-medium text-orbg-orange group active:text-orange-500 focus:outline-none focus:ring'
        >
          <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-orange group-hover:translate-y-0 group-hover:translate-x-0' />
          <span className='relative block px-8 py-3 text-white border border-current'>Go Home</span>
        </Link>
      </button>
    </main>
  )
}
