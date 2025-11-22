import { useEffect, useState } from 'react';
import './Employees.css';
import api from '../../services/api';
import EmployeeForm from '../../components/EmployeeForm/EmployeeForm';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    loadEmployees();
  };

  return (
    <div className="employees-page">
      <EmployeeForm
        key={editing ? editing.id : 'new'}
        editing={editing}
        onSaved={() => {
          setEditing(null);
          loadEmployees();
        }}
      />


      <div className="table-card">
        <div className="table-header-row">
          <h2>Employees</h2>
          <button
            className="primary-btn"
            onClick={() => setEditing(null)}
            type="button"
          >
            + New employee
          </button>
        </div>

        {loading ? (
          <div className="employees-empty">Loading…</div>
        ) : employees.length === 0 ? (
          <div className="employees-empty">
            No employees yet. Create one above to get started.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">
                        {(emp.firstName?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div>
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="badge-muted">ID #{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.email || <span className="badge-muted">—</span>}</td>
                  <td>{emp.phone || <span className="badge-muted">—</span>}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="employees-row-btn"
                      onClick={() => setEditing(emp)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="employees-row-btn danger"
                      onClick={() => handleDelete(emp.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
