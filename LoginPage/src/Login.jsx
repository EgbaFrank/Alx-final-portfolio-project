import React from 'react';

const Login = ({ switchToSignup }) => {
  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button style={styles.button}>Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span onClick={switchToSignup} style={styles.link}>
          Sign up
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '20px' },
  input: { margin: '10px 0', padding: '10px', width: '80%' },
  button: { padding: '10px 20px', background: 'blue', color: 'white' },
  link: { color: 'blue', cursor: 'pointer' },
};

export default Login;
