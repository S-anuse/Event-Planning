import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function RSVPForm({ eventId }) {
  const [rsvps, setRsvps] = useState([]);
  const [status, setStatus] = useState('yes');

  const fetchRsvps = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/rsvps/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(response.data.filter((rsvp) => rsvp.event === eventId));
    } catch (error) {
      console.error('Error fetching RSVPs:', error.response?.data || error.message);
    }
  }, [eventId]);

  useEffect(() => {
    fetchRsvps();
    const interval = setInterval(fetchRsvps, 5000);
    return () => clearInterval(interval);
  }, [eventId, fetchRsvps]);

  const handleRSVP = async () => {
    const token = localStorage.getItem('token');
    try {
      // Map frontend status to backend expected values
      const statusMap = {
        yes: 'YES',
        no: 'NO',
        maybe: 'MAYBE',
      };
      const backendStatus = statusMap[status];
      if (!backendStatus) {
        throw new Error('Invalid RSVP status');
      }
      const payload = {
        event: eventId,
        status: backendStatus,
        user: JSON.parse(atob(token.split('.')[1])).user_id, // Extract user_id from JWT
      };
      console.log('Sending RSVP payload:', payload); // Log for debugging
      const response = await axios.post(
        'http://localhost:8000/api/rsvps/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('RSVP submitted:', response.data);
      alert('RSVP submitted successfully!');
      fetchRsvps(); // Refresh the RSVP list
    } catch (error) {
      console.error('Error submitting RSVP:', error.response?.data || error.message);
      alert('Failed to submit RSVP: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
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
              rsvp.status === 'YES'
                ? 'bg-success text-white'
                : rsvp.status === 'NO'
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