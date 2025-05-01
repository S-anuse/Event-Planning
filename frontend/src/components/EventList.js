import { useState, useEffect } from 'react';
import axios from 'axios';
import RSVPForm from './RSVPForm';
import CommentSection from './CommentSection';

function EventList() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/events/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Add polling for live updates
    return () => clearInterval(interval);
  }, []);

  const handleCreateEvent = async () => {
    const token = localStorage.getItem('token');
    if (!title || !description || !date || !location) {
      console.error('All fields are required:', { title, description, date, location });
      alert('Please fill in all fields.');
      return;
    }
    try {
      // Parse the datetime-local input and convert to ISO 8601 format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        throw new Error('Invalid date format');
      }
      const formattedDate = parsedDate.toISOString(); // e.g., "2025-06-01T10:00:00.000Z"
      const payload = {
        title,
        description,
        date: formattedDate,
        location,
        organizer: JSON.parse(atob(token.split('.')[1])).user_id, // Extract user_id from JWT token
      };
      console.log('Sending payload:', payload); // Log the payload for debugging
      const response = await axios.post(
        'http://localhost:8000/api/events/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Event created:', response.data);
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      alert('Failed to create event: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">EventSync - Events</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5>Create Event</h5>
          <input
            type="text"
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            required
          />
          <textarea
            className="form-control mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            required
          />
          <button className="btn btn-primary" onClick={handleCreateEvent}>
            Add Event
          </button>
        </div>
      </div>
      <div>
        {events.map((event) => (
          <div key={event.id} className="card mb-3">
            <div className="card-body">
              <h5>{event.title}</h5>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.location}</p>
              <RSVPForm eventId={event.id} />
              <CommentSection eventId={event.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;