import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function CommentSection({ eventId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState(''); // Changed from 'text' to 'content'

  const fetchComments = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/comments/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.filter((comment) => comment.event === eventId));
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
    }
  }, [eventId]);

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [eventId, fetchComments]);

  const handleComment = async () => {
    const token = localStorage.getItem('token');
    if (!content) {
      alert('Please enter a comment.');
      return;
    }
    try {
      const payload = {
        event: eventId,
        content: content, // Changed from 'text' to 'content'
        user: JSON.parse(atob(token.split('.')[1])).user_id, // Extract user_id from JWT
      };
      console.log('Sending comment payload:', payload);
      const response = await axios.post(
        'http://localhost:8000/api/comments/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Comment posted:', response.data);
      alert('Comment posted successfully!');
      setContent(''); // Reset the textarea
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
      alert('Failed to post comment: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message));
    }
  };

  return (
    <div className="mt-3">
      <h6>Comments</h6>
      <textarea
        className="form-control mb-2"
        value={content} // Changed from 'text' to 'content'
        onChange={(e) => setContent(e.target.value)} // Changed from 'setText' to 'setContent'
        placeholder="Add a comment"
      />
      <button className="btn btn-primary mb-2" onClick={handleComment}>
        Post
      </button>
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            User {comment.user}: {comment.content} {/* Changed from 'comment.text' to 'comment.content' */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;