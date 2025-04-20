// ProblemTypeFilter.js
import React from 'react';

const ProblemTypeFilter = ({ selectedTypes, onChange }) => {
  // The problem types array should reflect what's actually in your database
  // These values are what will be passed to the backend
  const problemTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'addition', label: 'Addition' },
    { id: 'subtraction', label: 'Subtraction' },
    { id: 'multiplication', label: 'Multiplication' },
    { id: 'division', label: 'Division' },
    { id: 'fractions', label: 'Fractions' },
    { id: 'decimals', label: 'Decimals' },
    { id: 'geometry', label: 'Geometry' },
    { id: 'word', label: 'Word Problems' }
  ];

  return (
    <div className="problem-type-filter">
      <h3>Problem Types</h3>
      <div className="filter-options">
        {problemTypes.map(type => (
          <button
            key={type.id}
            className={`filter-option ${selectedTypes.includes(type.id) || 
              (type.id === 'all' && selectedTypes.length === 0) ? 'selected' : ''}`}
            onClick={() => onChange(type.id === 'all' ? [] : [type.id])}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProblemTypeFilter;