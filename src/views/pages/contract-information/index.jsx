import React from "react";
import { getListContract } from "../../../api/contractApi";
import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Typography, Spin } from 'antd';
import { format } from 'date-fns';

const { Title, Text } = Typography;


export default function ContractInformation() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchContracts = async () => {
        try {
          const response = await getListContract();
          setContracts(response.data);
        } catch (error) {
          console.error('Lỗi khi tải hợp đồng:', error);
        } finally {
          setLoading(false); // ✅ phải thêm dòng này
        }
      };
    
      fetchContracts();
    }, []);

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
      <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách hợp đồng</Title>
      {loading ? (
        <Spin />
      ) : contracts.length === 0 ? (
        <Text>Không có hợp đồng nào.</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {contracts.map((contract) => (
            <Col xs={24} md={12} lg={8} key={contract.contract_id}>
              <Card
                title={contract.room_info.room_name}
                bordered={false}
                style={{ borderRadius: 10 }}
              >
                <p><Text strong>Địa chỉ:</Text> {contract.room_info.address}</p>
                <p><Text strong>Giá thuê:</Text> {contract.room_info.price_per_month.toLocaleString()} VND / tháng</p>
                <p>
                  <Text strong>Thời hạn:</Text>{' '}
                  {format(new Date(contract.start_date), 'dd/MM/yyyy')} -{' '}
                  {format(new Date(contract.end_date), 'dd/MM/yyyy')}
                </p>
                <p>
                  <Text strong>Đối tác:</Text> {contract.other_party.email} (0{contract.other_party.phone})
                </p>
                <Button type="primary" href={contract.contract_file} target="_blank">
                  Xem hợp đồng PDF
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
        </div>
    );
    }
