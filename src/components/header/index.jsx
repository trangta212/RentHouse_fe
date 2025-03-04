import React from 'react';
import "./index.css";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';  
const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <div>
            <div className = "header">
                <div className="imageHeader">
                <img src={require("../../assets/images/logo.jpg")} alt="Logo" className="logo-Header" />
                </div>
                <div className="headerText">
             <Box className ="BoxHeader" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center',justifyContent: 'center' }}>
              <Link to="/user/home" className="link">
             <Typography sx={{ minWidth: 120, color:'black' }}>Trang chủ</Typography>
              </Link>
             <Tooltip title="Account settings">
             <IconButton
            onClick={handleClick}
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            < Typography sx={{minWidth: 120,color:'black' }}>Nhà đất cho thuê</Typography>
            </IconButton>
            </Tooltip>
            <Typography sx={{ minWidth: 120,color:'black' }}>Về chúng tôi</Typography>
            <Typography sx={{ minWidth: 120,color:'black' }}>Tin tức</Typography>
            <Typography sx={{ minWidth: 120,color:'black' }}>Bảng giá</Typography>
            </Box>
        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
            Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          My account
        </MenuItem>
      </Menu>
            </div>
            <div className="headerButton">
            <Button  className ="signup-header" type="text">Đăng nhập</Button>
            <Button className="login-header" type="primary">Đăng ký</Button>
            <Button className="push" type="primary">Đăng bài</Button>
            </div>
            </div>
        </div>
    )
}
export default Header;