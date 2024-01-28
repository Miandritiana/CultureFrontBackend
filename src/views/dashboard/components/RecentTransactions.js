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
import { Link, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const RecentTransactions = () => {

  const [terrainNonValide, setTerrainNonValide] = useState([]);

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
              <TimelineOppositeContent><Btn /></TimelineOppositeContent>
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
