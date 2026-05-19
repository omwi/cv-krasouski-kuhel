import { useEffect, useState } from "react"

export function useFetchUsers(limit = 20, offset = 0) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/users/get-users?limit=${limit}&offset=${offset}`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        if (!res.ok) throw new Error("Ошибка авторизации или сервера")

        const result = await res.json()
        setData(result.user)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [limit, offset])

  return { data, loading }
}
