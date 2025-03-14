import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const DropDownComponent = ({ items, placeholder = "Chọn một mục", className , value, onChange, error }) => {
  const [selectedItem, setSelectedItem] = useState(placeholder);

  const handSelect = ({ key }) => {
    const selected = items.find(item => item.key === key);
    if (selected) {
      setSelectedItem(selected.label);
      onChange(key); // Gửi giá trị đã chọn lên form
    }
  };

  return (
    <div className={className}>
      <Dropdown
        menu={{
          items,
          onClick: handSelect,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
        <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedItem}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DropDownComponent;
