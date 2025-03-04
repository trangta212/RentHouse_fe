import { Box, Tab, Tabs  } from '@mui/material';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';


const SideBar = () => {
    return(
        <Box sx ={{width:"25vw", display:"flex", flexDirection:"column",height:"100%"}}>
             <List sx ={{p:0, overflowY:"auto", flex:"1 0 0"}}>
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
             <ListItem alignItems="flex-start">
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors
                     </Typography>
                 }
               />
             </ListItem>
             <Divider variant="inset" component="li" />
           </List>
        </Box>
    )
}

export default SideBar;