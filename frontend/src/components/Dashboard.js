import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { class: currentClass } = location.state;
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    // Fetch students on class change or component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/students/${currentClass.class_id}`);
                setStudents(response.data);
                const initialAttendance = {};
                response.data.forEach(student => {
                    initialAttendance[student.student_id] = true;
                });
                setAttendance(initialAttendance);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch students');
            }
        };

        fetchStudents();
    }, [currentClass.class_id]); // Dependency on class_id to fetch data

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleAddStudentsFromFile = async () => {
        if (!file) {
            setError('Please upload a valid file');
            return;
        }
        
        // Parse the Excel file
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const binaryStr = reader.result;
                const workBook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workBook.SheetNames[0];
                const sheet = workBook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                
                const studentsToAdd = jsonData.map(item => ({
                    name: item['Student Name'],
                    registration_number: item['Registration Number'],
                    class_id: currentClass.class_id,
                }));

                // Post students data to the server
                await axios.post('http://localhost:5000/students/bulk', studentsToAdd);
                setError('Students added successfully');

                // Refresh the students list
                const response = await axios.get(`http://localhost:5000/students/${currentClass.class_id}`);
                setStudents(response.data);
            } catch (err) {
                setError('Failed to upload file or process students');
            }
        };
        reader.readAsBinaryString(file);
    };

    const toggleAttendance = (studentId) => {
        setAttendance({ ...attendance, [studentId]: !attendance[studentId] });
    };

    const saveAttendance = async () => {
        try {
            const attendanceData = Object.keys(attendance).map(studentId => ({
                student_id: parseInt(studentId),
                class_id: currentClass.class_id,
                present: attendance[studentId],
                date: selectedDate,
            }));
            await axios.post('http://localhost:5000/attendance', { attendance: attendanceData });
            setError('Attendance saved successfully');
        } catch (err) {
            setError('Failed to save attendance');
        }
    };

    const exportToExcel = () => {
        const presentCount = Object.values(attendance).filter(present => present).length;
        const absentCount = students.length - presentCount;
        const data = [
            ...students.map(student => ({
                'Registration Number': student.registration_number,
                'Student Name': student.name,
                'Attendance': attendance[student.student_id] ? 1 : 0, // Replace 'Present'/'Absent' with 1/0
            })),
            {},
            { 'Registration Number': 'Total Students', 'Student Name': students.length, 'Attendance': '' },
            { 'Registration Number': 'Present Students', 'Student Name': presentCount, 'Attendance': '' },
            { 'Registration Number': 'Absent Students', 'Student Name': absentCount, 'Attendance': '' },
        ];
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        XLSX.writeFile(workbook, 'attendance.xlsx');
    };

    // New function to handle student deletion
    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`http://localhost:5000/students/${studentId}`);
            setStudents(students.filter(student => student.student_id !== studentId));
            setError('Student deleted successfully');
        } catch (err) {
            setError('Failed to delete student');
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                >
                    Back
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Sign Out
                </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Dashboard - {currentClass.class_name}</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* File upload section */}
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls"
                    className="border p-2"
                />
                <button
                    onClick={handleAddStudentsFromFile}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                    Add Students from File
                </button>
            </div>

            {/* Attendance Date picker */}
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />

            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Registration Number
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Student Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Attendance
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.student_id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {student.registration_number}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {student.name}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                    onClick={() => toggleAttendance(student.student_id)}
                                    className={`px-4 py-2 rounded ${attendance[student.student_id] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                >
                                    {attendance[student.student_id] ? 'Present' : 'Absent'}
                                </button>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                    onClick={() => handleDeleteStudent(student.student_id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Attendance Action buttons */}
            <div className="mt-4">
                <button onClick={saveAttendance} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Save Attendance
                </button>
                <button onClick={exportToExcel} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Export Excel
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
