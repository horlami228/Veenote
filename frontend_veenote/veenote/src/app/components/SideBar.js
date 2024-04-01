import {
  UserOutlined, FolderOpenOutlined, DownOutlined, RightOutlined,
  LeftOutlined, SettingOutlined, SearchOutlined, MenuOutlined, CloseOutlined,
} from '@ant-design/icons';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Input, Modal } from 'antd';
import { useState, useEffect } from 'react';

const SidebarComponent = ({ username, notes, onNoteSelect, onDelete, onRename }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(null);  // To track which note is being renamed
  const [newName, setNewName] = useState('');  // To hold the new name being entered


  useEffect(() => {
    // Define a function to update the state based on the window's width
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    // Update the screen size upon initial component mount
    updateScreenSize();

    // Add an event listener for subsequent window resize events
    window.addEventListener('resize', updateScreenSize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleOpenChange = (flag) => {
    setDropdownOpen(flag);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  console.log('The onNoteSelect is a', typeof onNoteSelect); // Should output 'function'
  
  const showDeleteConfirm = (noteId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this note?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(noteId);
      },
    });
  };

  const startRenaming = (note, e) => {
    e.stopPropagation();  // Prevent the click event from bubbling up
    setIsRenaming(note.id);
    setNewName(note.title);
  };
  
  
  const handleRenameConfirm = (noteId) => {
    if (newName.trim() !== '') {
      // Pass the new name up to the parent component
      onRename(noteId, newName);
      setIsRenaming(null);
      setNewName('');
    }
  };
  
    // Dropdown menu for user settings
    const userMenu = (
      <Menu>
        <Menu.Item key="0">
          <SettingOutlined style={{ marginRight: 8 }} />
          Profile Settings
        </Menu.Item>
        {/* More menu items can be added here */}
        {/* <Menu.Item key="1">
          <SettingOutlined style={{ marginRight: 8 }} />
          Profile Settings
        </Menu.Item> */}
      </Menu>
    );
  
    const notesMenu = (
      <Menu className="overflow-y-auto max-h-72">
        {notes.map((note, index) => (
          <Menu.Item key={note.id}>
            <div className="flex justify-between items-center">
            {isRenaming === note.id ? (
              <Input
              value={newName}
              onChange={(e) => {
                e.stopPropagation(); // Prevent event propagation
                setNewName(e.target.value);
              }}
              onPressEnter={(e) => {
                e.stopPropagation(); // Prevent event propagation
                handleRenameConfirm(note.id);
              }}
              onBlur={(e) => {
                e.stopPropagation(); // Prevent event propagation
                handleRenameConfirm(note.id);
              }}
              autoFocus
            />
       
            ) : ( <div
                className="flex-grow cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteSelect(note)
                }}
              >
                {note.title}
              </div>
            )}
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="rename" icon={<EditOutlined />}>
                    <button onClick={(e) => startRenaming(note, e)} style={{ all: 'unset' }}>
                      Rename
                    </button>
                    </Menu.Item>
                    <Menu.Item key="delete" icon={<DeleteOutlined />}  onClick={(e) => showDeleteConfirm(note.id)
                    }>
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <MoreOutlined className="cursor-pointer" onClick={(e) => e.stopPropagation()} />
              </Dropdown>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );
  

  return (
    <div>
      {/* Hamburger icon for mobile screens */}
      {!isLargeScreen && !isMobileSidebarVisible && (
        <div className="fixed top-0 left-0 p-4 z-20">
          <MenuOutlined onClick={toggleMobileSidebar} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-10 bg-gray-200 transition-all duration-300 h-full ${
        isLargeScreen ? (collapsed ? 'w-16' : 'w-64') : (isMobileSidebarVisible ? 'w-64' : 'w-0')
      }`}>
        {!isLargeScreen && isMobileSidebarVisible && (
          <div className="absolute top-0 right-0 p-4">
            <CloseOutlined onClick={toggleMobileSidebar} />
          </div>
        )}
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 flex flex-col items-center">
            {((isLargeScreen && !collapsed) || (!isLargeScreen && isMobileSidebarVisible)) && (
              <>
                <Dropdown overlay={userMenu} placement="bottomLeft" trigger={['click']}>
                  <div className="p-4 cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
                      <UserOutlined className="text-white text-3xl" />
                    </div>
                  </div>
                </Dropdown>
                <div className="px-4 flex flex-col items-center">
                  <span className="text-2xl font-medium mt-2">{username}</span>
                  <Input prefix={<SearchOutlined />} className="my-4" placeholder="Search notes" />
                  <Dropdown overlay={notesMenu} trigger={['click']} onOpenChange={handleOpenChange} open={dropdownOpen} className="w-full">
                    <a className="ant-dropdown-link cursor-pointer flex items-center justify-between text-lg">
                      <FolderOpenOutlined className="mr-2" /> Root Folder {dropdownOpen ? <DownOutlined /> : <RightOutlined />}
                    </a>
                  </Dropdown>
                </div>
              </>
            )}
          </div>
          {isLargeScreen && (
            <div className="p-4">
              <button onClick={toggleSidebar} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                {collapsed ? <RightOutlined /> : <LeftOutlined />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
