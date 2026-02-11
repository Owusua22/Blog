import React from 'react'
import Navbar from '../Component/Navbar'
import HeroBanner from '../Component/Banners'
import Hero from '../Component/Banners'
import AboutStrip from '../Component/aboutStrip'
import LatestArticles from '../Component/LatestArticles'
import Newsletter from '../Component/Newsletter'
import Footer from '../Component/Footer'

function Home() {
  return (
<div>
    <Navbar/>
   <Hero/>
   <AboutStrip/>
   <LatestArticles/>
   <Newsletter/>
   <Footer/>
</div>
  )
}

export default Home