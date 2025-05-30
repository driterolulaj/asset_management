
// 15. src/pages/AssetPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@mui/material';

const AssetPage = ({ token }) => {
  const [assets, setAssets] = useState([]);
  const [models, setModels] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', serialNumber: '', status: '', modelId: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssets();
    fetchModels();
  }, []);

  const fetchAssets = async () => {
    const res = await axios.get('http://localhost:4000/api/assets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAssets(res.data);
  };

  const fetchModels = async () => {
    const res = await axios.get('http://localhost:4000/api/models', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setModels(res.data);
  };

  const handleAddOrUpdateAsset = async () => {
    if (editingId) {
      await axios.put(`http://localhost:4000/api/assets/${editingId}`, newAsset, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post('http://localhost:4000/api/assets', newAsset, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setNewAsset({ name: '', category: '', serialNumber: '', status: '', modelId: '' });
    setEditingId(null);
    fetchAssets();
  };

  const handleEditAsset = (asset) => {
    setNewAsset({
      name: asset.name,
      category: asset.category,
      serialNumber: asset.serialNumber,
      status: asset.status,
      modelId: asset.modelId
    });
    setEditingId(asset.id);
  };

  const handleDeleteAsset = async (id) => {
    await axios.delete(`http://localhost:4000/api/assets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAssets();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Asset Management</Typography>
      <TextField label="Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />
      <TextField label="Category" value={newAsset.category} onChange={e => setNewAsset({ ...newAsset, category: e.target.value })} />
      <TextField label="Serial Number" value={newAsset.serialNumber} onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })} />
      <TextField label="Status" value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value })} />
      <Select value={newAsset.modelId} onChange={e => setNewAsset({ ...newAsset, modelId: e.target.value })} displayEmpty>
        <MenuItem value="" disabled>Select Model</MenuItem>
        {models.map(model => (
          <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>
        ))}
      </Select>
      <Button variant="contained" onClick={handleAddOrUpdateAsset}>{editingId ? 'Update Asset' : 'Add Asset'}</Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map(asset => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.serialNumber}</TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>{asset.Model?.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditAsset(asset)}>Edit</Button>
                <Button color="error" onClick={() => handleDeleteAsset(asset.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AssetPage;