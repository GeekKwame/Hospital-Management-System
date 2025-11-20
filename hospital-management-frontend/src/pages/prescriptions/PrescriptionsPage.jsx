import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/ui/DataTable';

const PrescriptionsPage = () => {
  const { token, user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrescriptions();
  }, [token, user]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      // If user is a patient, load their prescriptions
      // Otherwise, show message that prescription management is not yet implemented
      if (user?.role === 'Patient') {
        try {
          const data = await apiClient(`/prescriptions?patientId=${user.user_id}`, { token });
          setPrescriptions(data);
        } catch (err) {
          // Prescription endpoint might not exist yet
          setPrescriptions([]);
        }
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <Button variant="contained" startIcon={<AddIcon />} disabled>
            Add Prescription
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {prescriptions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.role === 'Patient'
                ? 'No prescriptions found'
                : 'Prescription management feature coming soon'}
            </Typography>
          </Box>
        ) : (
          <DataTable
            columns={[
              { key: 'prescription_id', label: 'ID' },
              { key: 'medication', label: 'Medication' },
              { key: 'dosage', label: 'Dosage' },
              { key: 'instructions', label: 'Instructions' },
              {
                key: 'prescribed_date',
                label: 'Date',
                render: (row) =>
                  row.prescribed_date
                    ? new Date(row.prescribed_date).toLocaleDateString()
                    : 'N/A',
              },
            ]}
            rows={prescriptions}
            emptyLabel="No prescriptions"
          />
        )}
      </Paper>
    </Box>
  );
};

export default PrescriptionsPage;

