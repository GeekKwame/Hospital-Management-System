import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/ui/DataTable';
import PrescriptionForm from '../../components/PrescriptionForm';
import StatusPill from '../../components/ui/StatusPill';

const PrescriptionsPage = () => {
  const { token, user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, [token, user]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient('/prescriptions', { token });
      setPrescriptions(data);
    } catch (err) {
      console.error('Failed to load prescriptions:', err);
      setError('Failed to load prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (prescription = null) => {
    setSelectedPrescription(prescription);
    setFormOpen(true);
    setAnchorEl(null);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPrescription(null);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    
    try {
      await apiClient(`/prescriptions/${selectedRow.prescription_id}`, {
        method: 'DELETE',
        token,
      });
      loadPrescriptions();
      handleMenuClose();
    } catch (err) {
      setError(err.message || 'Failed to delete prescription');
      handleMenuClose();
    }
  };

  const canEdit = (prescription) => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'Doctor' && prescription.doctor_id === user.user_id) return true;
    return false;
  };

  const canDelete = (prescription) => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'Doctor' && prescription.doctor_id === user.user_id) return true;
    return false;
  };

  if (loading && prescriptions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Prescriptions</Typography>
        {(user?.role === 'Doctor' || user?.role === 'Admin') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Add Prescription
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {prescriptions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No prescriptions found
            </Typography>
          </Box>
        ) : (
          <DataTable
            columns={[
              { key: 'prescription_id', label: 'ID' },
              {
                key: 'doctor',
                label: 'Doctor',
                render: (row) =>
                  row.doctor
                    ? `${row.doctor.first_name} ${row.doctor.last_name}`
                    : 'N/A',
              },
              {
                key: 'patient',
                label: 'Patient',
                render: (row) =>
                  row.patient
                    ? `${row.patient.first_name} ${row.patient.last_name}`
                    : 'N/A',
              },
              { key: 'medication', label: 'Medication' },
              { key: 'dosage', label: 'Dosage' },
              { key: 'frequency', label: 'Frequency' },
              { key: 'duration', label: 'Duration' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => <StatusPill label={row.status} />,
              },
              {
                key: 'prescribed_date',
                label: 'Date',
                render: (row) =>
                  row.prescribed_date
                    ? new Date(row.prescribed_date).toLocaleDateString()
                    : 'N/A',
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, row)}
                      disabled={!canEdit(row) && !canDelete(row)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRow?.prescription_id === row.prescription_id}
                      onClose={handleMenuClose}
                    >
                      {canEdit(row) && (
                        <MenuItem onClick={() => handleOpenForm(row)}>
                          <EditIcon sx={{ mr: 1 }} fontSize="small" />
                          Edit
                        </MenuItem>
                      )}
                      {canDelete(row) && (
                        <MenuItem onClick={handleDelete}>
                          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                          Delete
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                ),
              },
            ]}
            rows={prescriptions}
            emptyLabel="No prescriptions"
          />
        )}
      </Paper>

      <PrescriptionForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={loadPrescriptions}
        prescription={selectedPrescription}
      />
    </Box>
  );
};

export default PrescriptionsPage;

