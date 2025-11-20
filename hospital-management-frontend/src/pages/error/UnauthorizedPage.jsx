import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock as LockIcon } from '@mui/icons-material';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <LockIcon sx={{ fontSize: '8rem', color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You do not have permission to access this resource.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          size="large"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;

