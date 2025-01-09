import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>DailyNutri</h1>
    </header>
  );
};

const styles = {
  header: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    color: '#008800',
    fontSize: '2.5rem',
    fontWeight: 'bolder',
  },
};

export default Header;
