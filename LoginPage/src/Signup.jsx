import React from 'react';

const Signup = ({ switchToLogin }) => {
  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form>
        <input type="text" placeholder="Name" style={styles.input} />
        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button style={styles.button}>Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <span onClick={switchToLogin} style={styles.link}>
          Log in
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '30px' },
  input: { margin: '10px 0', padding: '10px', width: '100%' },
  button: { padding: '10px 20px', background: 'blue', color: 'white' },
  link: { color: 'blue', cursor: 'pointer' },
};

export default Signup;