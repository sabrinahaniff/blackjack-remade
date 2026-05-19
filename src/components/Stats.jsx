const styles = {
  bar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '640px',
  },
  card: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    minWidth: '90px',
  },
  value: {
    color: '#fbbf24',
    fontSize: '22px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
  },
  label: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '11px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  streakActive: {
    color: '#4ade80',
  },
  resetBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.3)',
    borderRadius: '6px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    fontSize: '11px',
    marginTop: '4px',
  },
};

export default function Stats({ stats, winRate, onReset }) {
  if (stats.handsPlayed === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={styles.bar}>
        <div style={styles.card}>
          <span style={styles.value}>{stats.handsPlayed}</span>
          <span style={styles.label}>Hands</span>
        </div>
        <div style={styles.card}>
          <span style={styles.value}>{winRate}%</span>
          <span style={styles.label}>Win Rate</span>
        </div>
        <div style={styles.card}>
          <span style={{ ...styles.value, ...(stats.currentStreak > 2 ? styles.streakActive : {}) }}>
            {stats.currentStreak > 0 ? ` ${stats.currentStreak}` : stats.currentStreak}
          </span>
          <span style={styles.label}>Streak</span>
        </div>
        <div style={styles.card}>
          <span style={styles.value}>{stats.bestStreak}</span>
          <span style={styles.label}>Best Streak</span>
        </div>
        <div style={styles.card}>
          <span style={styles.value}>${stats.biggestWin}</span>
          <span style={styles.label}>Biggest Win</span>
        </div>
        <div style={styles.card}>
          <span style={styles.value}>{stats.blackjacks}</span>
          <span style={styles.label}>Blackjacks</span>
        </div>
      </div>
      <button style={styles.resetBtn} onClick={onReset}>reset stats</button>
    </div>
  );
}