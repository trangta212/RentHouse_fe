import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

const DropDownComponent = ({
  items = [],
  placeholder = "Chọn một mục",
  className = "",
  value = "",
  onChange = () => {},
  error = "",
}) => {
  const [selectedItem, setSelectedItem] = useState(placeholder);

  // Cập nhật selectedItem khi value thay đổi
  useEffect(() => {
    try {
      if (value && Array.isArray(items) && items.length > 0) {
        const selected = items.find((item) => item?.key === value);
        if (selected) {
          setSelectedItem(selected.label || placeholder);
        } else {
          setSelectedItem(placeholder);
        }
      } else {
        setSelectedItem(placeholder);
      }
    } catch (error) {
      console.error("Error in DropDownComponent useEffect:", error);
      setSelectedItem(placeholder);
    }
  }, [value, items, placeholder]);

  const handSelect = ({ key }) => {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        console.warn("Items is not an array or is empty");
        return;
      }

      const selected = items.find((item) => item?.key === key);
      if (selected) {
        setSelectedItem(selected.label || placeholder);
        onChange(key);
      }
    } catch (error) {
      console.error("Error in handSelect:", error);
    }
  };

  return (
    <div className={className}>
      <Dropdown
        menu={{
          items: Array.isArray(items) ? items : [],
          onClick: handSelect,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
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
