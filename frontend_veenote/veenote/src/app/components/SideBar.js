import {
  UserOutlined, FolderOpenOutlined, DownOutlined, RightOutlined,
  LeftOutlined, SettingOutlined, SearchOutlined, MenuOutlined, CloseOutlined,
} from '@ant-design/icons';
import { MoreOutlined, EditOutlined, DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Input, Modal, notification, Button } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SidebarComponent = ({ username, notes, folders, onNoteSelect, onDelete, onRename, onAddFolder }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(null);  // To track which note is being renamed
  const [newName, setNewName] = useState('');  // To hold the new name being entered
  const [folderNotes, setFolderNotes] = useState({});
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');



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

  const handleOpenChange = async (flag, folderId) => {
    // Expand or collapse the dropdown
    setDropdownOpen(flag ? folderId : null);
  
    // Fetch notes if the folder is being opened and notes haven't been fetched yet
    if (flag && !folderNotes[folderId]) {
      console.log('Fetching notes for folder:', folderId);
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/user/folder/notes/${folderId}`, {
          withCredentials: true,
        });
        // Ensure that response.data and response.data.folder exist before accessing notes
        if (response.data && response.data.folder && Array.isArray(response.data.folder.notes)) {
          console.log('Available notes');
          setFolderNotes({
            ...folderNotes,
            [folderId]: response.data.folder.notes // Safely assign notes to the state
          });
        } else {
          // Handle the case where no notes are present or the structure is not as expected
          console.log('No notes found or unexpected data structure');
          setFolderNotes({
            ...folderNotes,
            [folderId]: [] // Assign an empty array if no notes are present
          });
        }
        
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch notes. Please try again.'
        });
      }
    }
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
  
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/folder/create', { folderName: newFolderName }, { withCredentials: true });
      const createdFolder = response.data;
      // setFolder([...folders, createdFolder]);  // Update the folders state
      onAddFolder(createdFolder);  // Pass the new folder up to the parent component
      setNewFolderName('');  // Reset the input field
      setIsCreatingFolder(false);  // Hide the input field
      notification.success({
        message: 'Success',
        description: 'Folder created successfully.'
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      // work on the error
      setError()
      setIsCreatingFolder(false)
      setNewFolderName('')
      notification.error({
        message: 'Error',
        description: 'Failed to create the folder. Please try again.'
      });
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
            {isRenaming === note._id ? (
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
            {/* Folder creation area */}
                  <div className="folder-creation-area">
          {isCreatingFolder ? (
            <Input
              type="text"
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onPressEnter={handleCreateFolder}
              onBlur={handleCreateFolder}
              autoFocus
            />
          ) : (
            <Button icon={<FolderAddOutlined />} onClick={() => setIsCreatingFolder(true)}>Add Folder</Button>
          )}
        </div>
        {/**Existing folder */}
        {
          Array.isArray(folders) && folders.map((folder) => (
            <Dropdown
              key={folder._id}
              overlay={
                <Menu>
                  {
                    (folderNotes[folder._id] && folderNotes[folder._id].length > 0) ?
                    folderNotes[folder._id].map((note) => (
                      <Menu.Item key={note._id} onClick={() => onNoteSelect(note)}>
                        {note.content}
                      </Menu.Item>
                    )) :
                    <Menu.Item disabled>No notes available</Menu.Item> // Display when no notes are available
                  }
                </Menu>
              }
              onOpenChange={(flag) => handleOpenChange(flag, folder._id)}
              open={dropdownOpen === folder._id}
              trigger={['click']}
              className="mb-2" // Adding bottom margin to each Dropdown
            >
              <a className="ant-dropdown-link cursor-pointer flex items-center justify-between text-lg p-2" // Adding padding for better spacing
                style={{ display: 'block', marginBottom: '10px' }}>
                <FolderOpenOutlined className="mr-2" /> {folder.folderName} {dropdownOpen === folder._id ? <DownOutlined /> : <RightOutlined />}
              </a>
            </Dropdown>
          ))
        }

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
