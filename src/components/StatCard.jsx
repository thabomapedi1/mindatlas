function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <Icon size={18} aria-hidden="true" />
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  )
}

export default StatCard