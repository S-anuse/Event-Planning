import { useState, useEffect } from 'react';
import axios from 'axios';

function CommentSection({ eventId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/comments/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(response.data.filter((comment) => comment.event === eventId));
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleComment = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:8000/api/comments/',
      { event: eventId, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText('');
    fetchComments();
  };

  return (
    <div className="mt-3">
      <h6>Comments</h6>
      <textarea
        className="form-control mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
      />
      <button className="btn btn-primary mb-2" onClick={handleComment}>
        Post
      </button>
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            User {comment.user}: {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;