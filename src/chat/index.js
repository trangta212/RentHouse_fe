import { Paper } from '@mui/material';
import SideBar from './sidebar';
import ChatBox from './mainchat';
import socket from './socket';
import { useEffect } from 'react';
import {useLocation} from 'react-router-dom';

const Chat = () => {
    const state = useLocation();
    return (
        <Paper square elevation={0} sx ={{height:"100vh" , display:"flex"}}>
        <SideBar/>
        <ChatBox/>
        {/* <Profile/> */}
        </Paper>
    );
}
export default Chat;