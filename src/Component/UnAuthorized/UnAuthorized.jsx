import React from 'react';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UnauthorizedComponent = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        icon={<LockOutlined className="text-red-500 text-6xl" />}
        title={<span className="text-2xl font-bold">Unauthorized Access</span>}
        subTitle={<span className="text-gray-600">Sorry, you don't have permission to access this page.</span>}
        extra={
          <Button type="primary" onClick={()=>navigate('/')} className="bg-blue-500 hover:bg-blue-600">
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default UnauthorizedComponent;