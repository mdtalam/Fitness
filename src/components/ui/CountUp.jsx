import { animate, useInView, useIsomorphicLayoutEffect } from "framer-motion";
import { useRef } from "react";
import React from 'react';

const CountUp = ({ from = 0, to, duration = 2.5, suffix = "", prefix = "", delay = 0, decimals = 0, className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-10px" });

    useIsomorphicLayoutEffect(() => {
        if (!inView) return;

        const element = ref.current;
        if (!element) return;

        // Start with the initial text
        element.textContent = `${prefix}${from.toFixed(decimals)}${suffix}`;

        // Add a small delay if needed
        const controls = animate(from, to, {
            duration,
            delay,
            ease: [0.2, 0.65, 0.3, 0.9], // Custom easing for a nice "pop"
            onUpdate: (value) => {
                element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
            },
        });

        return () => controls.stop();
    }, [inView, from, to, duration, suffix, prefix, delay, decimals]);

    return <span ref={ref} className={className} />;
};

export default CountUp;
