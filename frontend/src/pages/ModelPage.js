import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ModelPage = () => {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [open, setOpen] = useState(false);
  const [modelData, setModelData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);

  const fetchModels = async () => {
    const res = await axios.get('http://localhost:4000/api/models', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setModels(res.data);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleOpen = (model = null) => {
    if (model) {
      setModelData({ name: model.name });
      setEditId(model.id);
    } else {
      setModelData({ name: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModelData({ name: '' });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!modelData.name) return alert('Name is required.');
    const url = editId
      ? `http://localhost:4000/api/models/${editId}`
      : 'http://localhost:4000/api/models';
    const method = editId ? 'put' : 'post';
    await axios[method](url, modelData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchModels();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/models/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchModels();
  };

  return (
    <div>
      <h2>Models</h2>
      <Button variant="contained" onClick={() => handleOpen()}>Add Model</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(model)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(model.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Model' : 'Add Model'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={modelData.name}
            onChange={(e) => setModelData({ ...modelData, name: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModelPage;
