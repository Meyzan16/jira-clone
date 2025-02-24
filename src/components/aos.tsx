'use client'

import AOS from 'aos';
import { useEffect } from 'react'
import "aos/dist/aos.css";

const AosInit = () => {
    useEffect(() => {
        AOS.init({
            offset:  0
        });
    },[])

  return null;
}

export default AosInit