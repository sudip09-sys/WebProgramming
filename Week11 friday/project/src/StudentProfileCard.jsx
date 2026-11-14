import React from 'react';

function StudentProfileCard({ name, studentId, major, year, gpa }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h2 className="student-name">{name}</h2>
        <span className="student-id">ID: {studentId}</span>
      </div>
      <div className="card-body">
        <p>
          <strong>Major:</strong> {major}
        </p>
        <p>
          <strong>Year:</strong> {year}
        </p>
        <p>
          <strong>GPA:</strong> {gpa}
        </p>
      </div>
    </div>
  );
}

export default StudentProfileCard;
