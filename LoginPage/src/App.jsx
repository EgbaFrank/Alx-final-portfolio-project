import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Header from './Header';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div style={styles.app}>
      <Header /> {/* Adding the Header component here */}
      {isLogin ? (
        <Login switchToSignup={switchToSignup} />
      ) : (
        <Signup switchToLogin={switchToLogin} />
      )}
    </div>
  );
};

const styles = {
  app: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0', flexDirection: 'column' },
};

export default App;
