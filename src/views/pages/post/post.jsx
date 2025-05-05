// src/pages/dashboard/Post.jsx
import React from "react";
import CardManage from "../../../components/card-manage/index.jsx";
import { useEffect } from "react";
import {getPostByUser} from "../../../api/postRent.jsx";
import { useState } from "react";


export default function Post() {
    

     const [postInformation, setPostInformation] = useState([]);
     const [sumPost, setSumPost] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPostByUser();
                setPostInformation(response.data.posts);
                setSumPost(response.data.postSum);
                console.log(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }
    , []);

    return (
    <div>
      <h1 className="text-xl font-medium mb-3">Tin đăng</h1>
      <div className="flex space-x-4">
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số tin đã đăng</h2>
        <h2 className="text-xl font-semibold">{sumPost || "0"}</h2>
        </div>
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số tin đang có</h2>
        <h2 className="text-xl font-semibold">13</h2>
        </div>
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số tin hết hạn</h2>
        <h2 className="text-xl font-semibold">13</h2>
        </div>
      </div>
      <h1 className="text-xl font-medium mt-6">Danh sách tin của bạn</h1>
            <CardManage listHome={postInformation} />
      
    </div>
  );
}
