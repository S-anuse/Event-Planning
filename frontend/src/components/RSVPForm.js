import { useState, useEffect } from 'react';
import axios from 'axios';

function RSVPForm({ eventId }) {
  const [rsvps, setRsvps] = useState([]);
  const [status, setStatus] = useState('yes');

  const fetchRsvps = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/rsvps/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRsvps(response.data.filter((rsvp) => rsvp.event === eventId));
  };

  useEffect(() => {
    fetchRsvps();
    const interval = setInterval(fetchRsvps, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleRSVP = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:8000/api/rsvps/',
      { event: eventId, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRsvps();
  };

  return (
    <div className="mt-3">
      <h6>RSVP</h6>
      <select
        className="form-select mb-2"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="maybe">Maybe</option>
      </select>
      <button className="btn btn-primary mb-2" onClick={handleRSVP}>
        Submit RSVP
      </button>
      <ul className="list-group">
        {rsvps.map((rsvp) => (
          <li
            key={rsvp.id}
            className={`list-group-item ${
              rsvp.status === 'yes'
                ? 'bg-success text-white'
                : rsvp.status === 'no'
                ? 'bg-danger text-white'
                : 'bg-warning'
            }`}
          >
            User {rsvp.user} - {rsvp.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RSVPForm;