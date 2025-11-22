import { useEffect, useState } from 'react';
import './Logs.css';
import api from '../../services/api';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/logs');
      setLogs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="logs-page">
      <div className="table-card">
        <div className="table-header-row">
          <h2>Audit logs</h2>
          <button className="primary-btn" type="button" onClick={loadLogs}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="logs-empty">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="logs-empty">No activity yet.</div>
        ) : (
          <table className="table logs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.action}</td>
                  <td>
                    <code className="logs-meta">
                      {JSON.stringify(log.meta || {}, null, 0)}
                    </code>
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
