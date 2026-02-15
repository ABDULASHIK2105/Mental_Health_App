import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/onboarding/score', {
        mood, stress, sleep, anxiety
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-calming">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Mental Health Assessment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">How is your mood today? (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full"
            />
            <span className="text-center block">{mood}</span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stress level? (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(e.target.value)}
              className="w-full"
            />
            <span className="text-center block">{stress}</span>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sleep quality? (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full"
            />
            <span className="text-center block">{sleep}</span>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Anxiety level? (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(e.target.value)}
              className="w-full"
            />
            <span className="text-center block">{anxiety}</span>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;