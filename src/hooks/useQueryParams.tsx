import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [queryParams] = useSearchParams()

  return Object.fromEntries([...queryParams])
}
