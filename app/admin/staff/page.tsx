import { getAllUsers } from "@/features/staff/queries"
import { StaffClient } from "./StaffClient"

export default async function AdminStaffPage() {
  const users = await getAllUsers()
  return <StaffClient users={users} />
}
