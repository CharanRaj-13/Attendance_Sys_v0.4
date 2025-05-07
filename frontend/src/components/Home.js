// frontend/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center relative overflow-hidden">
            {/* Background Design (Abstract Shapes) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-300 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-300 rounded-full blur-2xl opacity-50 animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Content Container */}
            <div className="bg-white p-12 rounded-xl shadow-2xl z-10 text-center">
                <h2 className="text-4xl font-extrabold text-indigo-800 mb-8">
                    Attendance System
                </h2>
                <div className="flex space-x-4 justify-center"> {/* Changed to flex and space-x-4 */}
                    <Link
                        to="/login"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
                    >
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;