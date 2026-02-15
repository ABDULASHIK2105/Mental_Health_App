import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'http://localhost:5000/api/matching/doctors',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(res.data);
    } catch (err) {
      setError('Failed to load doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/appointments/book',
        { doctorId, date, timeSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Doctor Selection */}
        <select
          className="w-full border p-2 rounded"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc.userId._id}>
              {doc.userId.name} — {doc.specialization} — ₹{doc.consultationFee}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Time Slot */}
        <input
          type="text"
          placeholder="Time Slot (e.g. 10:00 AM)"
          className="w-full border p-2 rounded"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required
        />

        <button className="w-full bg-primary text-white py-2 rounded">
          Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
