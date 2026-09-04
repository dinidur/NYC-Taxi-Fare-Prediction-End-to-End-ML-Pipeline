import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Predictor from './components/Predictor.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import ModelCard from './components/ModelCard.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Predictor />
        <HowItWorks />
        <ModelCard />
      </main>
      <Footer />
    </>
  )
}
