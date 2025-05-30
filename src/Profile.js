import React, { useEffect, useState } from 'react';
import './Profile.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

function Profile({ userName }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;

    fetch(`http://localhost:5000/profile/${userName}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setLoading(false);
      });
  }, [userName]);

  if (!userName) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading images...</p>;
  }

  const handleDownload = (url) => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => alert('Failed to download file'));
};

  const handleDelete = (url) => {
    const fileName = url.split('/').pop();

    fetch(`http://localhost:5000/delete-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, fileName }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setImages(prevImages => prevImages.filter(img => img !== url));
      })
      .catch(err => {
        alert('Failed to delete image');
        console.error(err);
      });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-username">Profile: {userName}</h2>

      {images.length === 0 ? (
        <p className="profile-empty">No images uploaded yet.</p>
      ) : (
        <div className="profile-grid">
          {images.map((imgUrl) => (
            <div
              key={imgUrl}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={imgUrl}
                alt="User upload"
                style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
              />

              <button
                onClick={() => handleDelete(imgUrl)}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  padding: '6px 10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  opacity: 0.85,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                aria-label="Delete image"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>

              <button
                onClick={() => handleDownload(imgUrl)}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  padding: '6px 10px',
                  backgroundColor: '#4b6cb7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  opacity: 0.85,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                aria-label="Download image"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
