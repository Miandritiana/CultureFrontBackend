import React from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import Btn from './Btn';
import { Link, Typography, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';

const RecentTransactions = () => {

  const [terrainNonValide, setTerrainNonValide] = useState([]);
  const [terrainToValidate, setTerrainToValidate] = useState(null);

  useEffect(() => {
      // Make an HTTP GET request to your Spring Boot endpoint
      fetch('https://culturebackoffice-production.up.railway.app/terrains/avalider')
          .then(response => response.json())
          .then(data => {
              // Update the state with the response data
              setTerrainNonValide(data);
              console.log(data);
          })
          .catch(error => {
              // Handle errors
              console.error('Misy.....Error during fetch(terrain non valide):', error);
          });
  }, []);

  const handleBtnClick = (terrain) => {
    console.log("btn clicked");
    // Display a confirmation dialog
    const isConfirmed = window.confirm(`Are you sure to validate the terrain?`);
    if (isConfirmed) {
      // Directly call the confirmation logic if confirmed
      handleConfirmation(terrain.idTerrain);
    }
  };

  const handleConfirmation = async (idTerrain, idUser) => {
    
    if (idTerrain) {
      try {

        const requestBody = new URLSearchParams();
        requestBody.append('idTerrain', idTerrain);

        // Make a GET request to validate the terrain
        const response = await fetch('http://localhost:8080/terrains/valider', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: requestBody.toString(),
        });
  
        if (response.ok) {
          // Update the state to remove the validated terrain
          setTerrainNonValide((prevTerrainNonValide) =>
            prevTerrainNonValide.filter((t) => t.idTerrain !== idTerrain)
          );
  
          // Display an alert message
          alert('Terrain validated successfully.');
        } else {
          console.error('Failed to validate terrain:', response.statusText);
          // Handle error scenarios or provide user feedback
          alert('Failed to validate terrain. Please try again.');
        }
      } catch (error) {
        console.error('Error during terrain validation:', error);
        // Handle error scenarios or provide user feedback
        alert('Error during terrain validation. Please try again.');
      } finally {
        // Close the confirmation dialog
        // setConfirmationDialogOpen(false);
        setTerrainToValidate(null);
      }
    }
  };

  
  return (
    <DashboardCard title="Valider creation terrain">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: '-40px',
            '& .MuiTimelineConnector-root': {
              width: '1px',
              backgroundColor: '#efefef'
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {Array.isArray(terrainNonValide) && terrainNonValide.map((t) => (
            <TimelineItem>
              <TimelineOppositeContent><Btn onClick={() => handleBtnClick(t)} /></TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="warning" variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent><Typography fontWeight="600">{t.nomUser}</Typography> a demande la creation du "{t.description}"<Typography fontWeight="400">{t.geolocalisation}</Typography></TimelineContent>
            </TimelineItem>
          ))}
          <TimelineItem></TimelineItem>
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
