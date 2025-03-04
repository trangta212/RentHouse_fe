import { Box , Button } from '@mui/material';
import { Input } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
const Footer = () => {
    return (
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",height:"10vh"}}>
          <Box sx={{ width: "100%", padding: 1 }}>
          <Input
       placeholder="Nhập tin nhắn"
       style={{
       width: "95%",
       height: "7vh",
       minHeight: "40px", // Đảm bảo không quá nhỏ
       borderRadius: "40px", // Bo góc
       padding: "8px 12px", // Khoảng cách chữ với viền
       marginLeft: "20px", // Khoảng cách với viền
       backgroundColor: "#f5f5f5", // Màu nền
       }}
       />
          </Box>
          <Button sx={{minWidth:"auto",mr :2 ,marginRight:"30px"}}>
          <FontAwesomeIcon icon={faPaperPlane} style ={{fontSize: "25px" , color:"#4caf4f"}}/>
          </Button>
        </Box>
    );
}
export default Footer;