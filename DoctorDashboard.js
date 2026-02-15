import { useEffect, useState } from "react";
import axios from "axios";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/appointments/doctor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const viewPatient = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/doctor/patients/${patientId}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPatient(res.data.patient);
      setHistory(res.data.history);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const todayAppointments = appointments.filter(
    (apt) =>
      new Date(apt.date).toDateString() === new Date().toDateString()
  );

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full border">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td>{apt.patientId?.name}</td>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td>{apt.status}</td>
                <td>
                  <button
                    onClick={() => viewPatient(apt.patientId._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View Patient
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL OUTSIDE TABLE */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded">
            <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
            <p>Email: {selectedPatient.email}</p>
            <p>Mental Score: {selectedPatient.mentalScore}</p>

            <h3 className="mt-4 font-semibold">History</h3>
            {history.map((h) => (
              <p key={h._id}>
                {new Date(h.date).toLocaleDateString()} – {h.status}
              </p>
            ))}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
