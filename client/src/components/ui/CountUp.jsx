import { animate } from "framer-motion";
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import React from 'react';

const CountUp = ({ from = 0, to, duration = 2.5, suffix = "", prefix = "", delay = 0, decimals = 0, className = "" }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0, rootMargin: "-10px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        if (!inView) return;

        const element = ref.current;
        if (!element) return;

        const target = Number(to);
        if (isNaN(target)) return;

        const startValue = Number(from) || 0;

        // Start with the initial text
        element.textContent = `${prefix}${startValue.toFixed(decimals)}${suffix}`;

        const controls = animate(startValue, target, {
            duration,
            delay,
            ease: [0.2, 0.65, 0.3, 0.9],
            onUpdate: (value) => {
                element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
            },
        });

        return () => controls.stop();
    }, [inView, from, to, duration, suffix, prefix, delay, decimals]);

    return <span ref={ref} className={className} />;
};

export default CountUp;
