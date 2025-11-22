import './EmployeeForm.css';
import { useState } from 'react';
import api from '../../services/api';

export default function EmployeeForm({ editing, onSaved }) {
  const [form, setForm] = useState(() =>
    editing
      ? {
        firstName: editing.firstName || '',
        lastName: editing.lastName || '',
        email: editing.email || '',
        phone: editing.phone || '',
      }
      : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }
  );

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/employees/${editing.id}`, form);
    } else {
      await api.post('/employees', form);
    }
    onSaved?.();
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="employee-form-header">
        <h2>{editing ? 'Edit employee' : 'Add employee'}</h2>
      </div>

      <div className="employee-form-grid">
        <div>
          <label>First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Alice"
            required
          />
        </div>
        <div>
          <label>Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Johnson"
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="alice@example.com"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="employee-form-footer">
        <button type="submit">
          {editing ? 'Save changes' : 'Create employee'}
        </button>
      </div>
    </form>
  );
}
