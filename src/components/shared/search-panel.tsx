import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function SearchPanel() {
  return (
    <>
      <InputGroup>
        <InputGroupInput type="search" placeholder="Search" className="" />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </>
  )
}
