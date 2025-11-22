import { useEffect, useState } from 'react';
import './AssignEmployeesModal.css';
import api from '../../services/api';

export default function AssignEmployeesModal({ team, onClose, onUpdated }) {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!team) return;
    const load = async () => {
      const res = await api.get('/employees');
      setEmployees(res.data);

      const current = new Set((team.Employees || []).map((e) => e.id));
      setSelectedIds(current);
    };
    load();
  }, [team]);

  if (!team) return null;

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentIds = new Set((team.Employees || []).map((e) => e.id));
      const nextIds = selectedIds;

      // Determine diffs
      const toAssign = [...nextIds].filter((id) => !currentIds.has(id));
      const toUnassign = [...currentIds].filter((id) => !nextIds.has(id));

      await Promise.all([
        ...toAssign.map((id) =>
          api.post(`/teams/${team.id}/assign`, { employeeId: id })
        ),
        ...toUnassign.map((id) =>
          api.post(`/teams/${team.id}/unassign`, { employeeId: id })
        ),
      ]);

      onUpdated?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="assign-modal-backdrop">
      <div className="assign-modal">
        <div className="assign-modal-header">
          <h3>Assign employees</h3>
          <span className="assign-modal-team-name">{team.name}</span>
        </div>

        <div className="assign-modal-body">
          {employees.length === 0 ? (
            <div className="assign-empty">No employees to assign.</div>
          ) : (
            <ul className="assign-list">
              {employees.map((emp) => (
                <li key={emp.id}>
                  <label className="assign-row">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(emp.id)}
                      onChange={() => toggle(emp.id)}
                    />
                    <span>
                      {emp.firstName} {emp.lastName}
                      <span className="assign-row-sub">
                        {emp.email || 'No email'}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="assign-modal-footer">
          <button type="button" onClick={onClose} className="assign-btn ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="assign-btn"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
