// frontend/src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [classes, setClasses] = useState(['']);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [staffId, setStaffId] = useState('');

    const navigate = useNavigate(); // ✅ Correctly initialize useNavigate

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
        setClasses(newClasses);
    };

    const handleAddClass = () => {
        setClasses([...classes, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (pin !== confirmPin) {
            setError('Pins do not match');
            return;
        }
        if (classes.length === 0 || classes.some(c => c.trim() === '')) {
            setError('At least one class is required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', { name, subject, classes, pin });
            setStaffId(response.data.staffId);
            alert(`Signup successful. Your Staff ID is: ${response.data.staffId}`);
            navigate('/login'); // ✅ Correct usage of navigate
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.error || 'Signup Failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Signup</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2" required />
                    </div>
                    <div>
                        <label className="block">Subject:</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border p-2" required />
                    </div>
                    <div>
                        <label className="block">Classes:</label>
                        {classes.map((className, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(e) => handleClassChange(index, e.target.value)}
                                    className="w-full border p-2"
                                    required
                                />
                                {index === classes.length - 1 && (
                                    <button type="button" onClick={handleAddClass} className="bg-blue-500 text-white p-2 rounded">+</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block">Pin:</label>
                        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full border p-2" required />
                    </div>
                    <div>
                        <label className="block">Confirm Pin:</label>
                        <input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} className="w-full border p-2" required />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Signup</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
