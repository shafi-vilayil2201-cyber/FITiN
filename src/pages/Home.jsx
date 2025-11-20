import React from "react";
import HeroBanner from '../components/Home/HeroBanner'
import Categories from "../components/Home/Categories";
import FeaturedProducts from "../components/Home/FeaturedProducts";

const Home = () => {
  return (
    <div>
      <HeroBanner/>
      <Categories/>
      <FeaturedProducts/>
    </div>
  );
};

export default Home;