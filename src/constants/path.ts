const path = {
  home: '/',
  user: '/user',
  login: '/login',
  register: '/register',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  product: '/product',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
