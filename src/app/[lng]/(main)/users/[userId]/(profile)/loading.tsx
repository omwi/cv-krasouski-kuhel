import { ProfileSkeleton } from "@/features/users/components/profile/profile-skeleton"

export default function UserProfileLoading() {
  return (
    <div className="flex flex-col items-center gap-6 pt-8 md:gap-12">
      <ProfileSkeleton />
    </div>
  )
}
