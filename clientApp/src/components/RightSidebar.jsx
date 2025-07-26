import assets, { imagesDummyData } from '../assets/assets';
import { DoorOpen, X } from 'lucide-react';

const RightSidebar = ({ selectedUser, showSidebar, setShowSidebar }) => {
  if (!selectedUser || !showSidebar) return null;

  return (
    <div className="fixed right-0 z-50 h-[calc(100%)] w-67 bg-gradient-to-b from-[#0e1629] to-[#111827] border-l border-blue-300/20 shadow-2xl flex flex-col">
      {/* Close Button */}
      <button
        onClick={() => setShowSidebar(false)}
        className="absolute top-4 right-4 text-white  hover:text-teal-500/50 active:text-violet-500 transition z-10 cursor-pointer"
      >
        <X size={22} />
      </button>

      {/* Scrollable Main Content */}
      <div className="pt-16 px-4 flex-1 overflow-y-auto min-h-0">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="w-24 aspect-square rounded-full overflow-hidden border-2 border-blue-400 shadow-md">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <h1 className="text-white text-lg font-bold">Chatting with</h1>
          </div>

          <p className="text-white text-xl font-semibold">{selectedUser.fullName}</p>
          <p className="text-sm text-blue-100 text-center px-4">
            {selectedUser.bio || 'Always online, always curious.'}
          </p>
        </div>

        <hr className="border-blue-300/20 mb-4" />

        {/* Media Section */}
        <div className="px-2 text-xs text-white">
          <p className="text-center pb-3 font-bold">Media</p>
          <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto">
            {imagesDummyData.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer rounded overflow-hidden"
                onClick={() => window.open(image)}
              >
                <img
                  src={image}
                  alt={`media-${index}`}
                  className="w-full h-full object-cover rounded hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-blue-300/20 my-4" />
      </div>
       
 


      {/* Logout Button  */}
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-500/20 text-white py-2 rounded-md hover:bg-blue-500/30 active:bg-violet-500 transition-colors duration-300 flex items-center justify-center gap-2">
          Logout
          <DoorOpen className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
