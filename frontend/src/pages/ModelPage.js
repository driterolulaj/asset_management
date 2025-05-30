// 14. src/pages/ModelPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Typography,
} from "@mui/material";

const ModelPage = () => {
  const { token } = useAuth();
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState({ name: "", manufacturer: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchModels();
  }, [token]);

  const fetchModels = async () => {
    const res = await axios.get("http://localhost:4000/api/models", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setModels(res.data);
  };

  const handleAddOrUpdateModel = async () => {
    if (editingId) {
      await axios.put(
        `http://localhost:4000/api/models/${editingId}`,
        newModel,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      await axios.post("http://localhost:4000/api/models", newModel, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setNewModel({ name: "", manufacturer: "" });
    setEditingId(null);
    fetchModels();
  };

  const handleEditModel = (model) => {
    setNewModel({ name: model.name, manufacturer: model.manufacturer });
    setEditingId(model.id);
  };

  const handleDeleteModel = async (id) => {
    await axios.delete(`http://localhost:4000/api/models/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchModels();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Model Management
      </Typography>
      <TextField
        label="Name"
        value={newModel.name}
        onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
      />
      <TextField
        label="Manufacturer"
        value={newModel.manufacturer}
        onChange={(e) =>
          setNewModel({ ...newModel, manufacturer: e.target.value })
        }
      />
      <Button onClick={handleAddOrUpdateModel} variant="contained">
        {editingId ? "Update Model" : "Add Model"}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Manufacturer</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.manufacturer}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditModel(model)}>Edit</Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteModel(model.id)}
                >
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

export default ModelPage;
