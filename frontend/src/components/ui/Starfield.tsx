import React, { useEffect, useState } from 'react';

export const Starfield = () => {
    const [stars, setStars] = useState<{ x: number, y: number, size: number, delay: number, duration: number }[]>([]);

    useEffect(() => {
        const starCount = 100;
        const newStars = Array.from({ length: starCount }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none -z-20">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-0 animate-twinkle"
                    style={{
                        top: `${star.y}%`,
                        left: `${star.x}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                        // Using CSS variables to match the class logic or inline styles
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};
