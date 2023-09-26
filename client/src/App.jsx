import { useContext } from 'react'
import { UserContext } from './context/UserContext'
import Layout from './components/Layout'
import Auth from './components/Auth'
import Admin from './components/Admin'

function App() {
  const user = useContext(UserContext)
  return user ? (
    <Layout>
      <Admin />
    </Layout>
  ) : (
    <Auth />
  )
}

export default App
