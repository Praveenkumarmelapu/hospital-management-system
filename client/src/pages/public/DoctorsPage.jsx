import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import DoctorCard from '../../components/DoctorCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter, RefreshCw, UserX } from 'lucide-react';

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || '';

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [minExp, setMinExp] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDept) {
          // Find dept ID or pass name query
          const matchDept = departments.find((d) => d.name === selectedDept);
          if (matchDept) params.append('department', matchDept._id);
        }
        if (searchTerm) params.append('search', searchTerm);
        if (minExp) params.append('minExperience', minExp);

        const res = await api.get(`/doctors?${params.toString()}`);
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedDept, searchTerm, minExp, departments]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setMinExp('');
    setSearchParams({});
  };

  return (
    <div className="doctors-page bg-light" style={{ minHeight: '80vh', padding: '3rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">Our Specialist Doctors</h1>
          <p className="section-subtitle">
            Search and filter expert doctors by medical department, qualification, or experience.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="card filter-card mb-4">
          <div className="filter-grid">
            {/* Search Input */}
            <div className="form-group mb-0">
              <label><Search size={14} /> Search Doctor</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <div className="form-group mb-0">
              <label><Filter size={14} /> Department</label>
              <select
                className="form-control"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  if (e.target.value) {
                    setSearchParams({ department: e.target.value });
                  } else {
                    setSearchParams({});
                  }
                }}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="form-group mb-0">
              <label>Min. Experience</label>
              <select
                className="form-control"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="filter-actions">
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <RefreshCw size={15} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <LoadingSpinner text="Searching doctors database..." />
        ) : doctors.length === 0 ? (
          <div className="card text-center p-5">
            <UserX size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
            <h3>No Doctors Available</h3>
            <p style={{ color: 'var(--text-muted)' }}>No active doctors match your search parameters. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .mb-4 { margin-bottom: 2rem; }
        .mb-0 { margin-bottom: 0 !important; }
        .p-5 { padding: 3rem !important; }
        .filter-card {
          padding: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .filter-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr;
          gap: 1.25rem;
          align-items: flex-end;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 992px) {
          .filter-grid { grid-template-columns: 1fr 1fr; }
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .filter-grid, .grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default DoctorsPage;
