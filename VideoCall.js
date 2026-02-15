import  { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [meetingLink, setMeetingLink] = useState('');

  const fetchAppointment = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const appointment = response.data.find(apt => apt._id === appointmentId);
      if (appointment && appointment.meetingLink) {
        setMeetingLink(appointment.meetingLink);
      }
    } catch (err) {
      console.error(err);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Video Call</h1>
      {meetingLink ? (
        <div>
          <p>Join your video call:</p>
          <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-4 py-2 rounded">
            Join Meeting
          </a>
        </div>
      ) : (
        <p>Loading meeting link...</p>
      )}
    </div>
  );
};

export default VideoCall;