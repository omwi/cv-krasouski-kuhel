import { makeVar } from "@apollo/client"

import { User } from "@/types/user"

export const authUserVar = makeVar<User | null>(null)
