import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PrescriptionForm = ({ open, onClose, onSuccess, prescription = null }) => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: prescription?.doctor_id || (user?.role === 'Doctor' ? user.user_id : ''),
    patient_id: prescription?.patient_id || '',
    appointment_id: prescription?.appointment_id || '',
    medication: prescription?.medication || '',
    dosage: prescription?.dosage || '',
    frequency: prescription?.frequency || '',
    duration: prescription?.duration || '',
    instructions: prescription?.instructions || '',
    status: prescription?.status || 'Active',
  });

  useEffect(() => {
    if (open) {
      loadFormData();
      if (prescription) {
        setFormData({
          doctor_id: prescription.doctor_id,
          patient_id: prescription.patient_id,
          appointment_id: prescription.appointment_id || '',
          medication: prescription.medication,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          duration: prescription.duration,
          instructions: prescription.instructions || '',
          status: prescription.status,
        });
      } else {
        setFormData({
          doctor_id: user?.role === 'Doctor' ? user.user_id : '',
          patient_id: '',
          appointment_id: '',
          medication: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          status: 'Active',
        });
      }
    }
  }, [open, prescription, user]);

  const loadFormData = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        apiClient('/users/doctors', { token }),
        apiClient('/users/patients', { token }),
      ]);
      setDoctors(doctorsRes);
      setPatients(patientsRes);

      // Load appointments for selected patient
      if (formData.patient_id) {
        try {
          const appointmentsRes = await apiClient(`/appointments?patientId=${formData.patient_id}`, { token });
          setAppointments(appointmentsRes.filter(apt => apt.status === 'Completed' || apt.status === 'In Progress'));
        } catch (err) {
          setAppointments([]);
        }
      }
    } catch (err) {
      console.error('Failed to load form data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Load appointments when patient changes
    if (name === 'patient_id' && value) {
      apiClient(`/appointments?patientId=${value}`, { token })
        .then((res) => {
          setAppointments(res.filter(apt => apt.status === 'Completed' || apt.status === 'In Progress'));
        })
        .catch(() => setAppointments([]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        doctor_id: Number(formData.doctor_id),
        patient_id: Number(formData.patient_id),
        appointment_id: formData.appointment_id ? Number(formData.appointment_id) : null,
      };

      if (prescription) {
        await apiClient(`/prescriptions/${prescription.prescription_id}`, {
          method: 'PUT',
          token,
          body: payload,
        });
      } else {
        await apiClient('/prescriptions', {
          method: 'POST',
          token,
          body: payload,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{prescription ? 'Edit Prescription' : 'Create Prescription'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {user?.role !== 'Doctor' && (
              <FormControl fullWidth required>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  label="Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.user_id} value={doctor.user_id}>
                      {doctor.first_name} {doctor.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth required>
              <InputLabel>Patient</InputLabel>
              <Select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                label="Patient"
                disabled={!!prescription}
              >
                <MenuItem value="">Select Patient</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.user_id} value={patient.user_id}>
                    {patient.first_name} {patient.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Appointment (Optional)</InputLabel>
              <Select
                name="appointment_id"
                value={formData.appointment_id}
                onChange={handleChange}
                label="Appointment (Optional)"
                disabled={!formData.patient_id}
              >
                <MenuItem value="">None</MenuItem>
                {appointments.map((apt) => (
                  <MenuItem key={apt.appointment_id} value={apt.appointment_id}>
                    {new Date(apt.scheduled_at).toLocaleString()} - {apt.reason || 'No reason'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="medication"
              label="Medication"
              value={formData.medication}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="dosage"
              label="Dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              fullWidth
              placeholder="e.g., 500mg"
            />

            <TextField
              name="frequency"
              label="Frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              fullWidth
              placeholder="e.g., Twice daily, Every 8 hours"
            />

            <TextField
              name="duration"
              label="Duration"
              value={formData.duration}
              onChange={handleChange}
              required
              fullWidth
              placeholder="e.g., 7 days, 2 weeks"
            />

            <TextField
              name="instructions"
              label="Instructions"
              value={formData.instructions}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              placeholder="Additional instructions for the patient"
            />

            {prescription && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : prescription ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PrescriptionForm;

