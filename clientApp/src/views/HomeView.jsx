import React, { useState } from 'react';

// Import sidebar and chat components
import LeftSidebar from '../components/leftSidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';

// Main HomeView component
const HomeView = () => {
  // State to track the selected user for chat
  const [selectedUser, setSelectedUser] = useState(null);
  // State to control visibility of the right sidebar (user info/settings)
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    // Main container with responsive padding
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      {/* Blurred background and border styling */}
      <div className="backdrop-blur-xl border-2 border-blue-400/30 rounded-2xl overflow-hidden h-full relative flex">
        
        {/* MOBILE VIEW: Only visible on small screens */}
        <div className="w-full h-full flex md:hidden">
          {showSidebar ? (
            // Show right sidebar if toggled
            <div className="w-full">
              <RightSidebar
                selectedUser={selectedUser}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
            </div>
          ) : !selectedUser ? (
            // Show left sidebar if no user is selected
            <div className="w-full">
              <LeftSidebar
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            </div>
          ) : (
            // Show chat container if a user is selected
            <div className="w-full">
              <ChatContainer
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              
                setShowSidebar={setShowSidebar}
              />
            </div>
          )}
        </div>

        {/* DESKTOP VIEW: Only visible on medium and larger screens */}
        <div
          className={`hidden md:grid h-full w-full relative ${
            selectedUser
              // If a user is selected, show three columns (left, chat, right)
              ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
              // Otherwise, show two columns (left, chat)
              : 'md:grid-cols-2'
          }`}
        >
          {/* Always show left sidebar */}
          <LeftSidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
          {/* Always show chat container */}
          <ChatContainer
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
          {/* Show right sidebar only if a user is selected and sidebar is toggled */}
          {selectedUser && showSidebar && (
            <RightSidebar
              selectedUser={selectedUser}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
