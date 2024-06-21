import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImportElectionsButton from './ImportElectionsButton';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [jsonFile, setJsonFile] = useState(null);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthData:', authData);
    if (!authData) return;
    if (!authData.user || authData.user.role !== 'admin') {
        toast.error('Access denied. Admins only.');
        navigate('/');
        return;
    }

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await api.get('/users', {
                headers: { 'x-auth-token': authData.token }
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error(error);
        }
    };

    fetchUsers();
}, [authData, navigate]);


const handleRoleChange = async (userId, newRole) => {
  try {
      await api.put(`/users/${userId}/role`, { role: newRole }, {
          headers: { 'x-auth-token': authData.token }
      });
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      toast.success('User role updated successfully');
  } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
  }
};


  const handleFileChange = (e) => {
    setJsonFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!jsonFile) {
      toast.error('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const elections = JSON.parse(event.target.result);

        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found, please log in first.');
          return;
        }

        await api.post('/admin/elections/import', elections, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        toast.success('Elections imported successfully');
      } catch (error) {
        toast.error('Failed to import elections');
        console.error(error);
      }
    };
    reader.readAsText(jsonFile);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Admin Panel</h2>
      <form onSubmit={handleFileUpload}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Import Elections
          </label>
          <input type="file" accept=".json" onChange={handleFileChange} />
        </div>
        <ImportElectionsButton />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>
      <table className="table-auto w-full mt-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.full_name}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                {user.role !== 'admin' && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRoleChange(user._id, 'admin')}
                  >
                    Promote to Admin
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRoleChange(user._id, 'user')}
                  >
                    Demote to User
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
