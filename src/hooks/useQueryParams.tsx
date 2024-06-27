import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [seachPrams] = useSearchParams()
  return Object.fromEntries([...seachPrams])
}
