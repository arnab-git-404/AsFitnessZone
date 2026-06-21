'use client';

import { motion } from 'framer-motion';

interface DecorativeOrbsProps {
    count?: number;
    className?: string;
}

export default function DecorativeOrbs({ count = 3, className = '' }: DecorativeOrbsProps) {
    const orbs = [
        { size: 'w-72 h-72', color: 'bg-red-500/5', x: 'top-20 right-20', duration: 6, y: [-30, 30, -30] },
        { size: 'w-96 h-96', color: 'bg-orange-500/5', x: 'bottom-20 left-20', duration: 8, y: [30, -30, 30] },
        { size: 'w-64 h-64', color: 'bg-red-600/5', x: 'top-40 left-1/4', duration: 7, y: [-20, 20, -20] },
        { size: 'w-80 h-80', color: 'bg-orange-600/5', x: 'bottom-40 right-1/4', duration: 9, y: [20, -20, 20] },
    ].slice(0, count);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${orb.x} ${orb.size} ${orb.color} blur-3xl rounded-full`}
                    animate={{ y: orb.y, opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}
