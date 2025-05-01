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
    const response = await axios.get('http://localhost:8000/api/events/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(response.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:8000/api/events/',
      { title, description, date, location },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    fetchEvents();
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
          />
          <textarea
            className="form-control mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
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