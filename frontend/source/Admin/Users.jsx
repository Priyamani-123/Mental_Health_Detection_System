import { useEffect, useState } from "react";
import API from "../Service/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Users = () => {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {

    try {

      const res = await API.get("/admin/users");
      setUsers(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  const deleteUser = async (id) => {

    try {

      await API.delete(`/admin/users/${id}`);

      setUsers(users.filter((u) => u.id !== id));

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <h2>User Management</h2>

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>

                <td>

                  <button
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
};

export default Users;