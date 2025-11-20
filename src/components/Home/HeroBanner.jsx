import React from "react";
import { Link } from "react-router-dom";
import herovid from "/assets/herovid.mp4";
import goToPage from '../../utils'
import { useNavigate } from "react-router-dom";


const HeroBanner = () => {
    const navigate =useNavigate()
    return (
        <>
            <section className="relative h-[50vh] md:h-[76vh] flex items-center justify-center">
                <video
                    src={herovid}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onClick={()=>goToPage(navigate,'/products')}
                    className="absolute top-5 pl-6 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-full h-auto object-contain  cursor-pointer"
                />
                <div className="absolute inset-0  pointer-events-none"></div>

                <div className="absolute  sm:bottom-3 md:hidden text-center w-full text-white px-4 z-10">
                    <p className="text-base sm:text-lg mt-24 font-light mb-5  text-black">
                        Discover powerful gear for every sport. Anytime. Anywhere.
                    </p>
                    <Link
                        to="/products"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-base sm:text-lg font-semibold shadow-lg transition"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>


            <div className="hidden md:block relative z-10 text-center px-4 mt-0 md:mt-0 font-mono">
                <p className="text-lg md:text-xl font-light mb-6  drop-shadow-neutral-800 ">
                    Discover powerful gear for every sport. Anytime. Anywhere.
                </p>
                
                <Link
                    to="/products"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-lg transition"
                >
                    Shop Now
                </Link>
            </div>
        </>
    );
};

export default HeroBanner;