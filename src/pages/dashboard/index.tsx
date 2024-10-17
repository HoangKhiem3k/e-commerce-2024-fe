// ** Next
import { NextPage } from 'next'
// ** Permission
import { PERMISSIONS } from 'src/configs/permission'
// ** Views
import DashboardPage from 'src/views/pages/dashboard'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <DashboardPage />
}

Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
