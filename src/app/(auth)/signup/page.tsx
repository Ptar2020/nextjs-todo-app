'use client';
import { ChangeEvent, useState, FormEvent } from 'react';
import { showErrorMsg, showSuccessMsg } from '@/app/_utils/Alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Signup = () => {
  // Initialize the state with default empty values for each field
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    password1: "",
    gender:"",
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle the form submission
  const signup = async (e: FormEvent) => {
    e.preventDefault();

    // Password validation
    if (newUserData.password.length < 6) {
      showErrorMsg("Password length should be more than 5 characters");
      return;
    }

    if (newUserData.password !== newUserData.password1) {
      showErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        username: newUserData?.username,
        password: newUserData?.password,
        email: newUserData?.email,
        gender:newUserData?.gender
      };

      const res = await fetch("/api/users/new", {
        method: "POST",  // POST for user creation
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccessMsg(data.success);
        // Redirect to login page upon success
        router.push('/login');
      } else {
        showErrorMsg(data.msg || 'Something went wrong');
      }
    } catch (err) {
      showErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h3>Signup for an account</h3>
      <form onSubmit={signup}>
        <label>Email</label>
        <br />
        <input
          type="email"
          value={newUserData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUserData({ ...newUserData, email: e.target.value })
          }
        />
        <br />
        <label>Username</label>
        <br />
        <input
          type="text"
          value={newUserData.username}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUserData({ ...newUserData, username: e.target.value })
          }
        />
        <br />
        <label>Gender</label>
        <br />
        <select
          value={newUserData.gender} // Bind the value to state
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setNewUserData({ ...newUserData, gender: e.target.value })
          }
        >
          <option value="" disabled>-Select gender</option> {/* Disabled placeholder option */}
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={newUserData.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUserData({ ...newUserData, password: e.target.value })
          }
        />
        <br />
        <label>Re-enter password</label>
        <br />
        <input
          type="password"
          value={newUserData.password1}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUserData({ ...newUserData, password1: e.target.value })
          }
        />
        <br />
        <button className="button" disabled={loading}>
          {loading ? 'Creating...' : 'Save'}
        </button>
        <br />
        <Link href="/login" className="link">
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default Signup;
