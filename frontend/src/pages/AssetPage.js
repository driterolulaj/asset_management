import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AssetPage = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [models, setModels] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    modelId: '',
  });

  const fetchAssets = async () => {
    const res = await axios.get('http://localhost:4000/api/assets', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(res.data);
  };

  const fetchModels = async () => {
    const res = await axios.get('http://localhost:4000/api/models', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setModels(res.data);
  };

  useEffect(() => {
    fetchAssets();
    fetchModels();
  }, []);

  const handleOpen = (asset = null) => {
    if (asset) {
      setFormData({ name: asset.name, modelId: asset.modelId || '' });
      setEditId(asset.id);
    } else {
      setFormData({ name: '', modelId: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', modelId: '' });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.modelId) {
      alert('Please fill in all fields.');
      return;
    }

    const url = editId
      ? `http://localhost:4000/api/assets/${editId}`
      : 'http://localhost:4000/api/assets';
    const method = editId ? 'put' : 'post';

    await axios[method](url, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset?')) {
      await axios.delete(`http://localhost:4000/api/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssets();
    }
  };

  const getModelName = (id) => models.find((m) => m.id === id)?.name || 'N/A';

  return (
    <div>
      <h2>Assets</h2>
      <Button variant="contained" onClick={() => handleOpen()}>Add Asset</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{getModelName(asset.modelId)}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(asset)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(asset.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            select
            label="Model"
            fullWidth
            margin="normal"
            value={formData.modelId}
            onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
          >
            {models.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssetPage;
