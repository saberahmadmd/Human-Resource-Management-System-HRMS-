import './TeamForm.css';
import { useState } from 'react';
import api from '../../services/api';

export default function TeamForm({ editing, onSaved }) {
  const [form, setForm] = useState(() =>
    editing
      ? {
        name: editing.name || '',
        description: editing.description || '',
      }
      : { name: '', description: '' }
  );

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/teams/${editing.id}`, form);
    } else {
      await api.post('/teams', form);
    }
    onSaved?.();
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <div className="team-form-header">
        <h2>{editing ? 'Edit team' : 'Add team'}</h2>
      </div>
      <div className="team-form-grid">
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Math Mentors"
            required
          />
        </div>
        <div className="team-form-full">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tutors handling advanced math batches."
          />
        </div>
      </div>
      <div className="team-form-footer">
        <button type="submit">
          {editing ? 'Save changes' : 'Create team'}
        </button>
      </div>
    </form>
  );
}
