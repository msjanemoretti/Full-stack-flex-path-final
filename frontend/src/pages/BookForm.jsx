import React, { useState } from 'react';

// decode/get payload of jwt
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

export default function BookForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    imageUrl: '',
    link: ''
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const payload = parseJwt(token);
  const isAdmin = payload?.roles?.includes('ROLE_ADMIN');

  // render message for non-admins
  if (!isAdmin) {
    return <p>You must be an admin to add books.</p>;
  }

  // handle changes to form inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // submit to server
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`//provides token ensuring user is admin and has authority
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) { //successful book addition
        setMessage('Book added successfully!');
        setFormData({
          title: '',
          author: '',
          description: '',
          imageUrl: '',
          link: ''
        });
      } else {
        const text = await response.text();
        console.error("Server response:", text);
        setMessage('Failed to add book. You may not have permission.');
      }
    } catch (error) {
      console.error("Error submitting book:", error);
      setMessage('An error occurred. Try again.');
    }
  }

  return ( //dynamic bookform
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" />
        <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Cover URL" />
        <input name="link" value={formData.link} onChange={handleChange} placeholder="Link (optional)" />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
