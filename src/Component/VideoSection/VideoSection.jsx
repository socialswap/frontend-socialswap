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
    // Array of YouTube video IDs and titles
    const videos = [
        {
            id: 'vg7Y4ougucU',
            title: 'Tutorial'
        },
        // You can add more videos here
        // {
        //     id: 'anotherVideoId',
        //     title: 'Another Tutorial'
        // },
    ];

    // Function to convert YouTube URL to embed format
    const getEmbedUrl = (videoId) => {
        return `https://www.youtube.com/embed/${videoId}`;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 bg-gray-50">
            <NeumorphicHeading text="Video Tutorials" color="red" />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map((video, index) => (
                    <div key={index} className="flex flex-col">
                        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
                            {video.title}
                        </h2>
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={getEmbedUrl(video.id)}
                                title={`YouTube video: ${video.title}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <a 
                    href="https://www.youtube.com/@yourchannelname" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Visit our YouTube channel
                </a>
            </div>
        </div>
    );
};

export default VideoSection;
