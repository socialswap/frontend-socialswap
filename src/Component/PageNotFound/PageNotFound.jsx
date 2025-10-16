import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="max-w-md w-full bg-white rounded-lg overflow-hidden">
                <div className="p-8">
                    <h1 className="text-9xl font-bold text-red-500 text-center mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">Page Not Found</h2>
                    <p className="text-xl text-gray-600 text-center mb-8">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <div className="flex justify-center">
                        <div
                            onClick={() => navigate('/')}
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium text-lg leading-tight rounded-md hover:bg-black-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500 transition duration-150 ease-in-out"
                        >
                            Go to Home
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;