import { makeVar } from "@apollo/client"

import { User } from "@/types/auth"

export const authUserVar = makeVar<User | null>(null)
