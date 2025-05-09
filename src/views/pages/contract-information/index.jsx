import React from "react";

export default function ContractInformation() {
    return (
        <div>
         <h1 className="text-xl font-medium mb-3">Tin đăng</h1>
        <div className="flex space-x-4">
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số hợp đồng</h2>
        <h2 className="text-xl font-semibold">{"0"}</h2>
        </div>
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số hợp đồng đang có</h2>
        <h2 className="text-xl font-semibold">13</h2>
        </div>
        <div className="w-1/3  bg-white shadow-md p-4 rounded-3xl h-35">
        <h2 className="text-black/70 mb-3 mt-3"> Tổng số hợp đồng hết hạn</h2>
        <h2 className="text-xl font-semibold">13</h2>
        </div>
      </div>
      <h1 className="text-xl font-medium mt-6">Danh sách các hợp đồng của bạn</h1>
        </div>
    );
    }
