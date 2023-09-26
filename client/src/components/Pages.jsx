import { useContext } from 'react'

import { UserContext } from '../context/UserContext'
import Layout from './Layout'
import Auth from './Auth'
import Admin from './Admin'

export default function Pages() {
  const user = useContext(UserContext)

  if (user.isLoading) return <>Loading...</>

  return user.data ? (
    <Layout>
      <Admin />
    </Layout>
  ) : (
    <Auth />
  )
}
