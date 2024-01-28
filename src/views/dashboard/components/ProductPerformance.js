import React from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Link
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { useState, useEffect } from 'react';
import {
    IconTrash, IconEdit, IconCheck
  } from '@tabler/icons';
import EditableField from './EditableField';

const ProductPerformance = () => {

    const [categorieCultures, setCategorieCultures] = useState([]);
    const [editStatus, setEditStatus] = useState({});

    useEffect(() => {
      // Make an HTTP GET request to your Spring Boot endpoint
      fetch('http://localhost:8080/categoriecultures/')
        .then(response => response.json())
        .then(data => {
          // Update the state with the response data
          setCategorieCultures(data);
          setEditStatus(Object.fromEntries(data.map(culture => [culture.idCategorieCulture, false])));
          console.log(data);
        })
        .catch(error => {
          // Handle errors
          console.error('Misy.....Error during fetch(categori culture):', error);
        });
    }, []);

    const handleEditClick = (id) => {
        // Toggle the edit status for the clicked row
        setEditStatus(prevEditStatus => ({
            ...prevEditStatus,
            [id]: !prevEditStatus[id],
        }));
    };

    const handleInputChange = (e, id, field) => {
        const updatedCategorieCultures = categorieCultures.map(culture => {
            if (culture.idCategorieCulture === id) {
                const updatedCulture = {
                    ...culture,
                    [field]: e.target.value,
                };
    
                // Log the new values
                console.log('New id:', updatedCulture.idCategorieCulture);
                console.log('New rendement:', updatedCulture.rendement);
    
                return updatedCulture;
            }
            return culture;
        });
    
        setCategorieCultures(updatedCategorieCultures);
    };

    const handleCheckClick = async (id) => {
        // Find the edited culture
        const editedCulture = categorieCultures.find(culture => culture.idCategorieCulture === id);

        try {
            // Make a PUT request to update the culture
            const response = await fetch(`http://localhost:8080/update?id=${id}&nom=${editedCulture.nomCateCult}&rendement=${editedCulture.rendement}`, {
                method: 'PUT',
            });

            if (response.ok) {
                // If the update is successful, toggle the edit status
                setEditStatus(prevEditStatus => ({
                    ...prevEditStatus,
                    [id]: false,
                }));
            } else {
                console.error('Failed to update culture:', response.statusText);
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };
    
    

    return (

        <DashboardCard title="Categorie de culture">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    IdCulture
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Nom culture
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Prix
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Modify
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Delete
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categorieCultures.map((culture) => (
                            <TableRow key={culture.idCategorieCulture}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {culture.idCategorieCulture}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            {editStatus[culture.idCategorieCulture] ? (  
                                                <EditableField
                                                    value={culture.nomCateCult}
                                                    onChange={(e) => handleInputChange(e, culture.idCategorieCulture, 'nomCateCult')}
                                                    id={culture.idCategorieCulture}
                                                />
                                            ) : (
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {culture.nomCateCult}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {editStatus[culture.idCategorieCulture] ? (
                                        <EditableField
                                            value={culture.rendement}
                                            onChange={(e) => handleInputChange(e, culture.idCategorieCulture, 'rendement')}
                                            id={culture.idCategorieCulture}
                                        />
                                    ) : (
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {culture.rendement}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editStatus[culture.idCategorieCulture] ? (
                                        <IconCheck onClick={() => handleCheckClick(culture.idCategorieCulture)} />
                                    ) : (
                                        <IconEdit onClick={() => handleEditClick(culture.idCategorieCulture)} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconTrash />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
