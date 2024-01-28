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
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [terrainToValidate, setTerrainToValidate] = useState(null);

  useEffect(() => {
      // Make an HTTP GET request to your Spring Boot endpoint
      fetch('http://localhost:8080/terrains/avalider')
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
    setTerrainToValidate(terrain);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmation = async () => {
    if (terrainToValidate) {
      try {
        // Make a POST request to validate the terrain
        const response = await fetch('http://localhost:8080/valider', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            idTerrain: terrainToValidate.idTerrain,
            idParcelle: terrainToValidate.idParcelle,
            idUser: terrainToValidate.idUser,
          }),
        });

        if (response.ok) {
          // Update the state to remove the validated terrain
          setTerrainNonValide(prevTerrainNonValide =>
            prevTerrainNonValide.filter(t => t.idTerrain !== terrainToValidate.idTerrain)
          );
        } else {
          console.error('Failed to validate terrain:', response.statusText);
        }
      } catch (error) {
        console.error('Error during terrain validation:', error);
      } finally {
        // Close the confirmation dialog
        setConfirmationDialogOpen(false);
        setTerrainToValidate(null);
      }
    }
  };

  const handleCancellation = () => {
    // Close the confirmation dialog
    setConfirmationDialogOpen(false);
    setTerrainToValidate(null);
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
        <Dialog open={confirmationDialogOpen} onClose={handleCancellation}>
          <DialogTitle>Are you sure to validate?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCancellation}>Cancel</Button>
            <Button onClick={handleConfirmation}>OK</Button>
          </DialogActions>
        </Dialog>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
