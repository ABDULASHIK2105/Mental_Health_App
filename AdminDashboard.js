import  { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, appointmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUsers(usersRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyDoctor = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/admin/doctors/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {users.map(user => (
              <li key={user._id} className="mb-2 p-2 border rounded flex justify-between items-center">
                <div>
                  <p><strong>{user.name}</strong> ({user.email})</p>
                  <p>Role: {user.role}</p>
                  {user.role === 'doctor' && <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>}
                </div>
                {user.role === 'doctor' && !user.isVerified && (
                  <button
                    onClick={() => verifyDoctor(user._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
          <ul>
            {appointments.slice(0, 10).map(apt => (
              <li key={apt._id} className="mb-2 p-2 border rounded">
                <p><strong>Patient:</strong> {apt.patientId.name}</p>
                <p><strong>Doctor:</strong> {apt.doctorId.name}</p>
                <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {apt.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;