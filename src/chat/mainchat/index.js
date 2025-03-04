import {Box} from '@mui/material';
import Header from '../mainchat/Header';
import ChatArea from '../mainchat/ChatArea';
import Footer from '../mainchat/Footer';
const ChatBox = () => {
return (
   <Box sx={{width:"75vw",  display:"flex", flexDirection:"column",height:"100%"}}>
    <Header/>
    <ChatArea/>
    <Footer/>
    </Box>
);
}
export default ChatBox;