import React, { useState } from 'react';
import { Modal, Input, Button, Form, Divider } from 'antd';

const UserProfileModal = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailChange = () => {
    console.log('Updating email to:', email);
    // Implement the email update logic
  };

  const handlePasswordChange = () => {
    console.log('Updating password with:', { oldPassword, newPassword });
    // Implement the password update logic
  };

  const handleUsernameChange = () => {
    console.log('Updating username to:', username);
    // Implement the username update logic
  };

  return (
    <Modal
      title="Profile Settings"
      open={isVisible}
      onCancel={onClose}
      footer={null}  // No default footer
      bodyStyle={{ backgroundColor: 'white', padding: '20px' }}  // White background for the modal body
    >
      <Form layout="vertical">
        {/* Username Update Section */}
        <Form.Item label="New Username" style={{ marginBottom: '10px' }}>
          <Input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ height: '40px' }}  // Increased height for the input field
          />
          <Button 
            type="primary" 
            onClick={handleUsernameChange} 
            style={{ marginTop: '10px', backgroundColor: 'blue', borderColor: 'blue', color: 'white' }}  // Changed button color to blue
          >
            Change Username
          </Button>
        </Form.Item>
        <Divider />

        {/* Email Update Section */}
        <Form.Item label="New Email" style={{ marginBottom: '10px' }}>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ height: '40px' }}  // Increased height for the input field
          />
          <Button 
            type="primary" 
            onClick={handleEmailChange} 
            style={{ marginTop: '10px', backgroundColor: 'green', borderColor: 'green', color: 'white' }}  // Changed button color to green
          >
            Change Email
          </Button>
        </Form.Item>
        <Divider />

        {/* Password Update Section */}
        <Form.Item label="Old Password" style={{ marginBottom: '10px' }}>
          <Input.Password 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            style={{ height: '40px' }}  // Increased height for the input field
          />
        </Form.Item>
        <Form.Item label="New Password" style={{ marginBottom: '10px' }}>
          <Input.Password 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            style={{ height: '40px' }}  // Increased height for the input field
          />
          <Button 
            type="primary" 
            onClick={handlePasswordChange} 
            style={{ marginTop: '10px', backgroundColor: 'red', borderColor: 'red', color: 'white' }}  // Changed button color to red
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;
