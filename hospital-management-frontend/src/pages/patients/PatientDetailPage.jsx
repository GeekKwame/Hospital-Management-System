import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/ui/DataTable';

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [id, token]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      // Load patient from patients list or use a detail endpoint if available
      const patients = await apiClient('/users/patients', { token });
      const foundPatient = patients.find((p) => p.user_id === parseInt(id));
      
      if (foundPatient) {
        setPatient(foundPatient);
        // Load patient appointments
        try {
          const patientAppointments = await apiClient(`/appointments?patientId=${id}`, { token });
          setAppointments(patientAppointments);
        } catch (err) {
          console.error('Failed to load appointments:', err);
        }
      }
    } catch (error) {
      console.error('Failed to load patient:', error);
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

  if (!patient) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
          Back to Patients
        </Button>
        <Typography variant="h5">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
        Back to Patients
      </Button>

      <Typography variant="h4" gutterBottom>
        Patient Details
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Patient ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {patient.user_id}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Full Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {patient.first_name} {patient.last_name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {patient.email}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Phone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {patient.phone}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Role
              </Typography>
              <Typography variant="body1" gutterBottom>
                {patient.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {appointments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No appointments found
                </Typography>
              ) : (
                <DataTable
                  columns={[
                    { key: 'appointment_id', label: 'ID' },
                    {
                      key: 'scheduled_at',
                      label: 'Date',
                      render: (row) => new Date(row.scheduled_at).toLocaleDateString(),
                    },
                    { key: 'status', label: 'Status' },
                  ]}
                  rows={appointments}
                  emptyLabel="No appointments"
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDetailPage;

