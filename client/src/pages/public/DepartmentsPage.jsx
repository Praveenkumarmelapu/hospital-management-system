import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import DepartmentCard from '../../components/DepartmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="departments-page bg-light" style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">Hospital Departments</h1>
          <p className="section-subtitle">
            Explore our specialized clinical centers and meet our experienced department heads.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading departments..." />
        ) : (
          <div className="grid-4">
            {departments.map((dept) => (
              <DepartmentCard key={dept._id} department={dept} />
            ))}
          </div>
        )}
      </div>
      <style>{`
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 992px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .grid-4 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default DepartmentsPage;
