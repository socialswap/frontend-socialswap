import React from 'react'
import Hero from '../../Component/Hero/Categories'
import Stats from '../../Component/Stats/Stats'
import FeaturedListings from '../../Component/Feature/Feature'
import WhyChannelKart from '../../Component/WhyChannelCart/WhyChannelCard/WhyChannelCart'
import Process from '../../Component/Steps/Buyer/Buyer'
import Categories from '../../Component/Hero/Categories'

const LandingPages = () => {
  return (
    <>
    <Stats />
    <FeaturedListings/>  
    <Categories />
    <WhyChannelKart/>
    <Process/>
    </>
)
}

export default LandingPages