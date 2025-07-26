import React, { useContext, useState } from 'react';
import assets, { userDummyData } from '../assets/assets';
import {
  EllipsisVertical,
  Search,
  UserRoundPlus,
  BellDot,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import StatusDot from '../lib/statusDot'

const LeftSidebar = ({ selectedUser, setSelectedUser }) => {
  
  const {logout, userStatus, changeStatus} = useContext(AuthContext)

 // console.log(userStatus)
  
  const navigator = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
 
  const filteredUsers = userDummyData.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`  bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-[ghostwhite]   ${
        selectedUser && window.innerWidth <= 768 ? 'hidden' : ''
      }`}
    >
      <div className="pb-5">
        {/* Header: Logo + Dropdown + Notifications */}
        <div className="flex justify-between items-center">
        
            <img src={assets.logo} alt="logo" className="w-32 object-contain" />
           
             

          <div className="flex items-center gap-4">

<div className="relative flex items-center justify-between gap-3 pr-5 ">
  {/* Status Dot */}
  <StatusDot status={userStatus} />

  {/* Status Dropdown */}
  <select
    value={userStatus}
    onChange={(e) => changeStatus(e.target.value)}
    className={`bg-transparent text-sm font-medium focus:outline-none cursor-pointer
      ${
        userStatus === 'online'
          ? 'text-green-400'
          : userStatus === 'afk'
          ? 'text-red-400'
          : userStatus === 'invisible'
          ? 'text-gray-400'
          : ''
      }`}
  >
    <option value="online" className="text-green-500 bg-[#282142]">Online</option>
    <option value="afk" className="text-red-500 bg-[#282142]">AFK</option>
    <option value="invisible" className="text-gray-500 bg-[#282142]">Invisible</option>
  </select>
</div>





            <div className="relative py-2 group">
              <EllipsisVertical className="w-6 h-6 text-[ghostwhite] cursor-pointer hover:text-blue-500/30 active:text-violet-500" />
              <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
                <p onClick={() => navigator('/userProfile')} className="cursor-pointer active:text-violet-500/50 hover:text-blue-300/60 text-sm">
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-blue-500" />
                <p onClick={()=> logout()} className="cursor-pointer text-sm active:text-violet-500/50 hover:text-blue-300/60">Logout</p>
             
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-lg px-3 py-2 w-full max-w-full shadow-md mt-5">
          <Search className="w-5 h-5 text-blue-300" />
          <input
            type="text"
            placeholder="Search chat..."
            className="bg-transparent flex-1 outline-none text-white placeholder:text-blue-300"
          />
        
        </div>
      </div>

    

      {/* Chat List */}
      <div className="flex flex-col">
        {userDummyData.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser((prev) => (prev?._id === user._id ? null : user));
            }}
            key={index}
            className={`relative flex items-center gap-3 p-2 rounded-lg cursor-pointer max-sm:text-sm
              hover:bg-blue-500/10 active:bg-violet-500 transition-all duration-300 ease-in-out
              ${selectedUser?._id === user._id ? 'bg-violet-500/30 backdrop-blur-md' : ''}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-10 h-10 rounded-full object-cover aspect-[1/1]"
              onClick={() => navigator('/userProfile')}
            />

            <div className="flex flex-col leading-5">
              <p className="text-white">{user.fullName}</p>
              {index < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : index < 5 ? (
                <span className="text-gray-400 text-xs">Offline</span>
              ) : (
                <span className="text-red-400 text-xs">Do Not Disturb</span>
              )}
            </div>

            {index > 2 && (
              <p
                className={`absolute top-4 right-4 text-lg h-8 w-8 flex justify-center items-center rounded-full font-bold
                  border border-blue-400/30
                  transition-all duration-300 ease-in-out
                  hover:scale-110 hover:shadow-lg
                  ${index >= 6 ? 'text-cyan-300 hover:animate-pulse' : index >= 4 ? 'text-blue-300' : 'text-gray-300'} animate-popFade`}
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', backdropFilter: 'blur(8px)' }}
              >
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
