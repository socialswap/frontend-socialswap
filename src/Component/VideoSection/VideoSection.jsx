import React from 'react';

export const NeumorphicHeading = ({ text, className, color = 'blue' }) => {
    const glowColors = {
        blue: 'from-blue-400 to-blue-500 shadow-blue-500',
        green: 'from-green-400 to-green-500 shadow-green-500',
        red: 'from-red-400 to-red-500 shadow-red-500',
        purple: 'from-purple-400 to-purple-500 shadow-purple-500',
    };

    const colorClasses = glowColors[color] || glowColors.blue;

    return (
        <h1
            className={`text-4xl md:text-5xl font-bold text-center
            bg-gradient-to-r ${colorClasses} text-transparent bg-clip-text
            animate-pulse
            drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]
            filter blur-[0.5px]
            transition-all duration-300`}
        >
            {text}
        </h1>
    );
};

const VideoSection = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
                Tutorial
            </h2>
            <div className="relative w-full aspect-video">
                <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default VideoSection;