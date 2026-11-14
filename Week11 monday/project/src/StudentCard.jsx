import React from 'react';

function StudentCard({ name, id, major }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="student-name">{name}</h2>
        <span className="student-id">ID: {id}</span>
      </div>
      <div className="card-body">
        <p>
          <strong>Major:</strong> {major}
        </p>
      </div>
    </div>
  );
}

export default StudentCard;
