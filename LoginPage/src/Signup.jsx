import React, {useState} from 'react';
import axios from 'axios';


const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value 

      });
    const handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, password, confirmPassword} = formData;

        if (!name || !email || !password || !confirmPassword){
            setError('All fields are required');
            return;
        }
        
        if (password != confirmPassword) {
            setError('Password incorrect');
            return;
        }
        setError('');
        console.log('Signup Data:', formData);
    }
    return (
        <div className="form-container">
        <h2>Signup</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  };

  export default Signup;
   
