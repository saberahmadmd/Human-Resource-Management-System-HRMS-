// src/pages/Teams/Teams.jsx
import { useEffect, useState } from 'react';
import './Teams.css';
import api from '../../services/api';
import TeamForm from '../../components/TeamForm/TeamForm';
import AssignEmployeesModal from '../../components/AssignEmployeesModal/AssignEmployeesModal';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignTeam, setAssignTeam] = useState(null);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    await api.delete(`/teams/${id}`);
    loadTeams();
  };

  return (
    <div className="teams-page">
      <TeamForm
        key={editing ? editing.id : 'new'}
        editing={editing}
        onSaved={() => {
          setEditing(null);
          loadTeams();
        }}
      />


      <div className="table-card">
        <div className="table-header-row">
          <h2>Teams</h2>
          <button
            className="primary-btn"
            onClick={() => setEditing(null)}
            type="button"
          >
            + New team
          </button>
        </div>

        {loading ? (
          <div className="teams-empty">Loading…</div>
        ) : teams.length === 0 ? (
          <div className="teams-empty">
            No teams yet. Create one above to group employees.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Description</th>
                <th>Members</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>
                    <div className="team-name-cell">
                      <span className="chip">{team.name}</span>
                    </div>
                  </td>
                  <td>
                    {team.description || (
                      <span className="badge-muted">No description</span>
                    )}
                  </td>
                  <td>
                    {(team.Employees?.length || 0) === 0 ? (
                      <span className="badge-muted">No members</span>
                    ) : (
                      <span>{team.Employees.length} member(s)</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="teams-row-btn"
                      onClick={() => setAssignTeam(team)}
                      type="button"
                    >
                      Assign employees
                    </button>
                    <button
                      className="teams-row-btn"
                      onClick={() => setEditing(team)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="teams-row-btn danger"
                      onClick={() => handleDelete(team.id)}
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

      {assignTeam && (
        <AssignEmployeesModal
          team={assignTeam}
          onClose={() => setAssignTeam(null)}
          onUpdated={loadTeams}
        />
      )}
    </div>
  );
}
