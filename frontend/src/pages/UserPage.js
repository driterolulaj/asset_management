import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:4000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user = null) => {
    if (user) {
      setFormData({ username: user.username, password: "", role: user.role });
      setEditId(user.id);
    } else {
      setFormData({ username: "", password: "", role: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({ username: "", password: "", role: "" });
    setEditId(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.username ||
      (editId === null && !formData.password) ||
      !formData.role
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editId) {
        const updateData = { username: formData.username, role: formData.role };
        if (formData.password) updateData.password = formData.password;

        await axios.put(
          `http://localhost:4000/api/users/${editId}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:4000/api/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(user)}>Edit</Button>
                <Button onClick={() => handleDelete(user.id)} color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <TextField
            select
            label="Role"
            fullWidth
            margin="dense"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="superadmin">Superadmin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserPage;
