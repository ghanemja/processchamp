import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import GeoSetAI from './pages/GeoSetAI'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const TITLES = {
  '/': 'ProcessChamp — Autonomous AI-Driven Manufacturing',
  '/about': 'About Us — ProcessChamp',
  '/products': 'Products & Services — ProcessChamp',
  '/geoset-ai': 'GeoSet AI — ProcessChamp',
  '/contact': 'Contact Us — ProcessChamp',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    document.title = TITLES[pathname] ?? 'ProcessChamp'
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <RouteEffects />
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/geoset-ai" element={<GeoSetAI />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
