import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Description as PrescriptionIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/patients', label: 'Patients', icon: <PeopleIcon /> },
  { to: '/doctors', label: 'Doctors', icon: <HospitalIcon /> },
  { to: '/appointments', label: 'Appointments', icon: <CalendarIcon /> },
  { to: '/prescriptions', label: 'Prescriptions', icon: <PrescriptionIcon /> },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mb: 1,
            bgcolor: 'white',
            color: 'primary.main',
          }}
        >
          {user?.first_name?.charAt(0) || 'H'}
        </Avatar>
        <Typography variant="h6" noWrap>
          Hospital Management
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {user?.role || 'User'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to === '/dashboard' && location.pathname === '/');
          return (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.to);
                  if (mobileOpen) {
                    handleDrawerToggle();
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/profile'}
            onClick={() => {
              navigate('/profile');
              if (mobileOpen) {
                handleDrawerToggle();
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === '/profile' ? 'primary.main' : 'inherit' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/settings'}
            onClick={() => {
              navigate('/settings');
              if (mobileOpen) {
                handleDrawerToggle();
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === '/settings' ? 'primary.main' : 'inherit' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

