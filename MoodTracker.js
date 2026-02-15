import  { useState } from 'react';

const MoodTracker = () => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      // For now, just log it. In real app, save to database
      console.log('Mood logged:', { mood, note, date: new Date() });
      alert('Mood logged successfully!');
      setMood(5);
      setNote('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-primary">Daily Mood Tracker</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">How are you feeling today? (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full"
          />
          <span className="text-center block text-lg">{mood}</span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Notes (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="How was your day?"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Log Mood
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;