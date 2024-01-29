import React from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
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
      fetch('https://culturebackoffice-production.up.railway.app/categoriecultures/categorieculture')
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
        // Check if the culture is new or existing
        console.log("iconcheck clicke......");
        const isNewCulture = id < 0; // Assuming negative IDs are temporary and not present on the server

        try {
            if (isNewCulture) {
                // Make a POST request to insert the new culture
                const response = await fetch('https://culturebackoffice-production.up.railway.app/categoriecultures/categorieculture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        nom: categorieCultures.find(culture => culture.idCategorieCulture === id).nomCateCult,
                        rendement: categorieCultures.find(culture => culture.idCategorieCulture === id).rendement.toString(),
                    }),
                });

                if (response.ok) {
                    // Update the state to reflect the successful insert
                    // You may need to update the state based on the server response
                    setCategorieCultures(prevCategorieCultures => prevCategorieCultures.map(culture => {
                        if (culture.idCategorieCulture === id) {
                            const maxId = Math.max(...prevCategorieCultures.map(c => c.idCategorieCulture));
                            const newId = maxId + 1;
                    
                            return { ...culture, idCategorieCulture: newId };
                        }
                        return culture;
                    }));

                    // Set the edit status for the new culture to false
                    setEditStatus(prevEditStatus => ({
                        ...prevEditStatus,
                        [id]: false,
                    }));
                } else {
                    console.error('Failed to insert culture:', response.statusText);
                }
            } else {

                // Find the culture to update
                const cultureToUpdate = categorieCultures.find(culture => culture.idCategorieCulture === id);

                // Get the edited fields for the culture
                const editedFields = Object.keys(editStatus).filter(fieldName => editStatus[fieldName]);
                console.log(editedFields);

                // Prepare the request body with only the edited fields
                const requestBody = new URLSearchParams();
                editedFields.forEach(fieldName => {
                    const fieldValue = cultureToUpdate[fieldName];
                    if (fieldValue !== undefined && fieldValue !== null) {
                        requestBody.append(fieldName, fieldValue.toString());
                    }
                });

                // Get the values of nom and rendement
                const nom = cultureToUpdate.nomCateCult;
                const rendement = cultureToUpdate.rendement;

                // Make a PUT request to update the culture
                const response = await fetch(`https://culturebackoffice-production.up.railway.app/categoriecultures/categorieculture?id=${id}&nom=${nom}&rendement=${rendement}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: requestBody.toString(),  // Convert the URLSearchParams to a string
                });

                if (response.ok) {
                    // Update the state to reflect the successful update
                    // (Assuming your server doesn't return updated data, otherwise, update accordingly)
                    // You may need to update the state based on the server response
                    setCategorieCultures(prevCategorieCultures => prevCategorieCultures.map(culture => {
                        if (culture.idCategorieCulture === id) {
                            // Update only the edited fields
                            editedFields.forEach(fieldName => {
                                culture[fieldName] = cultureToUpdate[fieldName];
                            });
                        }
                        return culture;
                    }));

                    // Set the edit status for the updated culture to false
                    setEditStatus(prevEditStatus => ({
                        ...prevEditStatus,
                        [id]: false,
                    }));
                } else {
                    console.error('Failed to update culture:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error during update/insert:', error);
        }
    };

    
    const handleDeleteClick = async (id, nomCateCult) => {
        // Display a confirmation dialog
        const isConfirmed = window.confirm(`Are you sure to delete "${nomCateCult}"?`);
    
        if (isConfirmed) {
            try {
                // Make a DELETE request to delete the culture
                const response = await fetch(`https://culturebackoffice-production.up.railway.app/categoriecultures/categorieculture?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json', // Set the content type if needed
                        // Add other headers as needed
                    },
                });
    
                if (response.ok) {
                    // If the delete is successful, update the state to remove the deleted culture
                    setCategorieCultures(prevCategorieCultures => prevCategorieCultures.filter(culture => culture.idCategorieCulture !== id));
                } else {
                    console.error('Failed to delete culture:', response.statusText);
                    // Handle the error case here if needed
                }
            } catch (error) {
                console.error('Error during delete:', error);
                // Handle the error case here if needed
            }
        }
    };
    

    const handleAddClick = () => {
        // Create a new culture with default values or fetch from server if needed
        const newCulture = {
            idCategorieCulture: -Date.now(),
            nomCateCult: "",
            rendement: 0,
        };

        // Update the state to add the new culture
        setCategorieCultures(prevCategorieCultures => [...prevCategorieCultures, newCulture]);

        // Set the edit status for the new culture to true so fields are editable
        setEditStatus(prevEditStatus => ({
            ...prevEditStatus,
            [newCulture.idCategorieCulture]: true,
        }));
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
                                    Rendement
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={400}>
                                    kg/m2
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
                                    <IconTrash onClick={() => handleDeleteClick(culture.idCategorieCulture, culture.nomCateCult)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <Button variant="contained" color="primary" onClick={handleAddClick}>
                        New Categorie Culture
                    </Button>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
