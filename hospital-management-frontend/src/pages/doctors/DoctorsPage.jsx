import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const DoctorsPage = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, [token]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/users/doctors', { token });
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
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
      <Typography variant="h4" gutterBottom>
        Doctors
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.user_id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dr. {doctor.first_name} {doctor.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctor.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctor.phone}
                </Typography>
                <Chip label={doctor.role} size="small" color="primary" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {doctors.length === 0 && (
        <Paper sx={{ p: 4, mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No doctors found
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DoctorsPage;

