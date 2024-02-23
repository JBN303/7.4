import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';

const drawerWidth = 240;

const DoctorPage = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5007/api/doctors/${userId}`);
        setDoctorDetails(response.data);
      } catch (error) {
        console.error('Error fetching doctor details', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5007/api/appointments/${userId}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchDoctorDetails();
    fetchAppointments();
  }, [userId]);

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5007/api/appointments/status/${appointmentId}`, { status: newStatus });
      // Update the appointments state after successful update
      const updatedAppointments = appointments.map(appointment => {
        if (appointment._id === appointmentId) {
          return { ...appointment, status: newStatus };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  if (!doctorDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#77d5cb', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <Button component={Link} to={`/edit/${userId}`} color="inherit">
            Edit Profile
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Typography>
              {doctorDetails.pic && (
                <img
                  src={`data:image/jpeg;base64,${doctorDetails.pic}`}
                  alt="Profile"
                  style={{ width: '50px', height: '50px' }}
                />
              )}
            </Typography>
            <Typography>{doctorDetails.name}</Typography>
            <Typography>{doctorDetails.spec}</Typography>
          </List>
          <Divider />
          <List>
            {['My Appointments'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
          <List>
            {[''].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          <Typography variant="h6" gutterBottom component="div"></Typography>

          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Patient Name: {appointment.patientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {appointment.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact No: {appointment.patientContactNo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {appointment.patientEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Purpose: {appointment.purpose}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {appointment.status} {/* Display status */}
                </Typography>
                <Button onClick={() => handleAppointmentStatusChange(appointment._id, 'successfull')}>
                  <CheckCircleOutlineTwoToneIcon/>
                </Button>
              </CardContent>
            </Card>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default DoctorPage;
