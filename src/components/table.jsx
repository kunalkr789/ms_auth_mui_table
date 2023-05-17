import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography
} from '@mui/material';

export default function TableWithSearch({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchString(value);
    const filtered = data.filter((_) => {
      return _.key.toLowerCase().includes(value) || _?.value?.toLowerCase().includes(value);
    });
    setFilteredData(filtered);
  };

  return (
    <Box p={2}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchString}
        onChange={handleSearch}
        fullWidth
      />
      <TableContainer sx={{ marginTop: 2, border: "1px solid black" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "GrayText" }}>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.key}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>
        {filteredData?.length === 0 &&
          <Box>
            <Typography>No Results Found.</Typography>
          </Box>
        }
      </TableContainer>
    </Box>
  );
};