import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

const Header = () => {
    return (
        <Card sx={{ borderRadius: 0, boxShadow: "none" }}>  
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
    
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        </Card>
    )
}
export default Header;