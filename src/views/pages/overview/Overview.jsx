import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getCalendarPost } from "../../../api/calendar";
import { Select } from 'antd';

export default function Overview() {
    const [dataCalendar, setDataCalendar] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filteredData, setFilteredData] = useState([]);

    // Lấy danh sách năm từ dữ liệu
    const getYears = (data) => {
        const years = new Set();
        data.forEach(item => {
            const year = item.month.split('/')[1];
            years.add(year);
        });
        return Array.from(years).sort();
    };

    // Tạo dữ liệu cho 12 tháng
    const createMonthlyData = (data, year) => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const month = String(i + 1).padStart(2, '0');
            const monthData = data.find(item => item.month === `${month}/${year}`);
            return {
                month: month,
                count: monthData ? monthData.count : 0
            };
        });
        return months;
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getCalendarPost();
            setDataCalendar(response.data);
        };
        fetchData();
    }, []);

    // Cập nhật dữ liệu khi năm được chọn hoặc dataCalendar thay đổi
    useEffect(() => {
        if (dataCalendar.length > 0) {
            const filtered = createMonthlyData(dataCalendar, selectedYear);
            setFilteredData(filtered);
        }
    }, [selectedYear, dataCalendar]);

    const years = getYears(dataCalendar);

    return (
        <div>
          <div>
            <h1 className="text-xl font-medium mb-7">Tổng quan</h1>

          </div>
        <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: 'fit-content',
            margin: 'auto'
        }}>
          
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Số bài đăng hàng tháng</h2>
                <Select
                    style={{ width: 120 }}
                    value={selectedYear}
                    onChange={setSelectedYear}
                >
                    {years.map(year => (
                        <Select.Option key={year} value={year}>
                            {year}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            <BarChart
                width={1000}
                height={400}
                data={filteredData}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => `Tháng ${value}`}
                />
                <YAxis />
                <Tooltip 
                    formatter={(value) => [`${value} bài đăng`, 'Số lượng']}
                    labelFormatter={(label) => `Tháng ${label}`}
                />
                <Legend />
                <Bar 
                    dataKey="count" 
                    fill="#bbd58e" 
                    name="Số bài đăng"
                />
            </BarChart>
        </div>
        </div>
    );
}
