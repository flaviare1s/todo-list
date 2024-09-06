import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Footer } from './components/Footer'
import { Todos } from './pages/Todos'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Register } from './pages/Register'
import { ResetPassword } from './pages/ResetPassword'

export function App() {
  return (
    <main className='flex flex-col min-h-screen'>
      <BrowserRouter>
        <Header />
          <section className='grow'>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/todos' element={<Todos/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/reset-password' element={<ResetPassword/>} />
              <Route path='*' element={<NotFound/>} />
            </Routes>
          </section>
        <Footer />
      </BrowserRouter>
    </main>
  )
}
