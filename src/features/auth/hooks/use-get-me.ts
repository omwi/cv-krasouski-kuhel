import { useQuery } from "@apollo/client/react"

import { useAuthContext } from "@/features/auth/components/auth-provider"
import { GET_USER } from "@/graphql/users/queries"
import { User } from "@/types/user"

export function useGetMeQuery() {
  const { userId, role } = useAuthContext()

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { userId: userId! },
    skip: !userId,
  })

  let user: User | null = null

  if (data?.user) {
    user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      avatarSrc: data.user.profile.avatar ?? null,
      fullName: data.user.profile.full_name || "",
      departmentName: data.user.department?.name || "",
      positionName: data.user.position?.name || "",
    }
  }

  return {
    user,
    role: user?.role || role,
    loading: userId ? loading : false,
    error,
    refetch,
  }
}
