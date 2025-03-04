import {Box} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper';



const ChatArea = () => {
    return (
        <Box sx={{height:"80%",overflowY:"auto",p:2, flex: "1 1 0", background:"#f2fae9"}}>
          <Stack direction="row" justifyContent="center">
          <Chip label="Hôm qua" />
          </Stack>
         <List>
         <ListItem sx ={{display:"flex" , mb:3}}>
            <Box  sx={{width:"80%" , display:"flex" }}>
               <ListItemAvatar>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <Paper sx ={{width:"100%" , p:1}}>
               <ListItemText
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                       
                     </Typography>
                 }
               />
               <Box mt={1}>
                <Typography variant="caption" color="textSecondary">10:30 AM</Typography>
               </Box>
                </Paper>
                </Box>
             </ListItem>
        <ListItem sx ={{display:"flex" , flexDirection:"row-reverse" , mb:3}}>
            <Box  sx={{width:"80%" , display:"flex" , flexDirection:"row-reverse"}}>
               <ListItemAvatar sx = {{display:"flex" , flexDirection:"row-reverse"}}>
                 <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
               </ListItemAvatar>
               <Paper sx ={{width:"100%" , p:1,background:"#c8ead1"}}>
               <ListItemText 
                 primary="Brunch this weekend?"
                 secondary={
                     <Typography
                       variant="caption"
                       sx={{ color: 'text.primary', display: 'inline' }}
                     >
                       Ali Connors aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                       
                     </Typography>
                 }
               />
               <Box mt={1}>
                <Typography variant="caption" color="textSecondary">10:30 AM</Typography>
               </Box>
                </Paper>
                </Box>
             </ListItem>
         </List>
        </Box>
    );
}
export default ChatArea;