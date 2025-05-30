import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Container,
  Typography,
} from "@mui/material";

const UserPage = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:4000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleAddOrUpdateUser = async () => {
    if (editingId) {
      await axios.put(`http://localhost:4000/api/users/${editingId}`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("http://localhost:4000/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setNewUser({ username: "", password: "", role: "user" });
    setEditingId(null);
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setNewUser({ username: user.username, password: "", role: user.role });
    setEditingId(user.id);
  };

  const handleDeleteUser = async (id) => {
    await axios.delete(`http://localhost:4000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <div>
        <TextField
          label="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <TextField
          label="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddOrUpdateUser}>
          {editingId ? "Update User" : "Add User"}
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditUser(u)}>Edit</Button>
                <Button color="error" onClick={() => handleDeleteUser(u.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default UserPage;
