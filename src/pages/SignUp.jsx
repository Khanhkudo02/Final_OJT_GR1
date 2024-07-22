import React, { useState } from 'react';
import { auth } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '../../firebaseConfig.js';  // Đảm bảo rằng bạn đã nhập đúng

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, isAdmin);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Realtime Database
      console.log('isAdmin:', isAdmin);
      await set(ref(database, 'users/' + user.uid), {
        email: user.email,
        isAdmin: isAdmin
      });

      console.log('Signup successful');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Admin:</label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp;
