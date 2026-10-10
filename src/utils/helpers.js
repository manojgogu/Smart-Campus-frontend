export const CATEGORIES = ['Medical', 'Fire', 'Accident', 'Security Threat', 'Suspicious Activity', 'Other'];
export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
export const STATUSES = ['Reported', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved'];
export const BUILDINGS = [
  'Main Academic Block', 'Library', 'Boys Hostel A', 'Girls Hostel B',
  'Cafeteria', 'Sports Complex', 'Admin Block', 'Engineering Labs', 'Auditorium', 'Parking Lot'
];

export const priorityColor = (p) => ({
  Critical: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30',
  High: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30',
  Low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30'
}[p] || 'bg-slate-100 text-slate-700');

export const statusColor = (s) => ({
  Reported: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Acknowledged: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  Assigned: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  'In Progress': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  Resolved: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
}[s] || 'bg-slate-100 text-slate-700');

export const timeAgo = (d) => {
  if (!d) return '—';
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const formatDate = (d) => d ? new Date(d).toLocaleString() : '—';

export const downloadCSV = (filename, rows) => {
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};
