import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoodTracker from './MoodTracker';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch appointments and matched doctor together
      const [appointmentsRes, doctorRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments/my', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/matching/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAppointments(appointmentsRes.data);
      setDoctor(doctorRes.data); // ✅ doctor is an OBJECT, not array

    } catch (err) {
      // ✅ SAFE & PROFESSIONAL ERROR HANDLING
      if (err.response?.status === 404) {
        // No doctor available (expected case)
        setDoctor(null);
      } else {
        console.error('Dashboard error:', err);
      }
    }
  };

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Patient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Doctor Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Doctor</h2>
          {doctor ? (
            <div>
              <p><strong>Name:</strong> {doctor.userId.name}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Fee:</strong> ₹{doctor.consultationFee}</p>
            </div>
          ) : (
            <p>No doctor assigned yet.</p>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Appointments</h2>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map(apt => (
                <li key={apt._id} className="mb-2 p-2 border rounded">
                  <p><strong>Doctor:</strong> {apt.doctorId?.name}</p>
                  <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {apt.timeSlot}</p>
                  <p><strong>Status:</strong> {apt.status}</p>
                  {apt.status === 'confirmed' && apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Join Call
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments yet.</p>
          )}

          <button
            onClick={handleBookAppointment}
            className="mt-4 bg-primary text-white px-4 py-2 rounded"
          >
            Book New Appointment
          </button>
        </div>

        {/* Mood Tracker */}
        <MoodTracker />
      </div>
    </div>
  );
};

export default Dashboard;
