// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [staffId, setStaffId] = useState('');
    const [className, setClassName] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('http://localhost:5000/login', { staffId, className, pin });
            // If login is successful, navigate to the dashboard with state
            navigate('/dashboard', { state: { staff: response.data.staff, class: response.data.class } });
        } catch (err) {
            console.error("Error:", err);
            // Handle error gracefully
            const errorMessage = err.response?.data?.error || 'Login Failed. Please try again.';
            setError(errorMessage); // Display the error
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Staff ID:</label>
                        <input 
                            type="text" 
                            value={staffId} 
                            onChange={(e) => setStaffId(e.target.value)} 
                            className="w-full border p-2" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block">Class Name:</label>
                        <input 
                            type="text" 
                            value={className} 
                            onChange={(e) => setClassName(e.target.value)} 
                            className="w-full border p-2" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block">Pin:</label>
                        <input 
                            type="password" 
                            value={pin} 
                            onChange={(e) => setPin(e.target.value)} 
                            className="w-full border p-2" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/signup" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
                        Go to Signup
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
