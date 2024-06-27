import { useMatch } from 'react-router-dom'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  const matchRegister = useMatch('/register')
  return (
    <div>
      <RegisterHeader title={matchRegister ? 'Đăng ký' : 'Đăng nhập'} />
      {children}
      <Footer />
    </div>
  )
}
