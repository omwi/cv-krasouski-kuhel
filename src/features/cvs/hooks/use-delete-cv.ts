import { Reference } from "@apollo/client"
import { useMutation } from "@apollo/client/react"

import { DELETE_CV } from "@/graphql/cvs/mutations"
import { usePermissions } from "@/hooks/use-permissions"
import { Cv } from "@/types/graphql-types"
import { removeRefById } from "@/utils/cache"

export function useDeleteCv(cv: Cv) {
  const [deleteCv] = useMutation(DELETE_CV, {
    update(cache) {
      cache.modify({
        fields: {
          cvs: removeRefById(cv.id),
        },
      })

      cache.modify({
        id: cache.identify({
          __typename: "User",
          id: cv.user?.id,
        }),
        fields: {
          cvs: removeRefById(cv.id),
        },
      })

      cache.evict({
        id: cache.identify({
          __typename: "Cv",
          id: cv.id,
        }),
      })
      cache.gc()
    },
  })

  const { canDeleteCv } = usePermissions()

  const handleDelete = async () => {
    if (!canDeleteCv(cv.user?.id)) return
    await deleteCv({ variables: { cv: { cvId: cv.id } } })
  }

  return { handleDelete }
}
