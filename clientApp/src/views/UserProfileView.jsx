import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';




const UserProfileView = () => {
  const { authUser, updateUser } = useContext(AuthContext); 
  const navigator = useNavigate();

  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(authUser?.username || 'WGC');
  const [userBio, setUserBio] = useState(authUser?.bio || 'WGC');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userImage) {
      await updateUser({ username: userName, bio: userBio });
      navigator('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(userImage);
    reader.onload = async () => {
      const base64Image = reader.result;
     
      await updateUser({ profilePicture: base64Image, username: userName, bio: userBio });
         navigator('/');
    };
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-5 backdrop-blur-md">
      <div className="bg-blue-500/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <h1 className="text-3xl text-white font-bold text-center">User Profile</h1>

          {/* Avatar Upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer bg-white/5 hover:bg-blue-500/10 active:bg-violet-500 p-3 rounded-md transition-colors"
          >
            <input
              onChange={(e) => setUserImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept="image/*"
              hidden
            />
            <img
              src={
                userImage
                  ? URL.createObjectURL(userImage)
                  : authUser?.profilePicture || assets.avatar_icon
              }
              alt="avatar"
              className={`w-12 h-12 object-cover rounded-full ${userImage}`}
            />
            <span className="text-blue-300">Change Avatar</span>
          </label>

          {/* User Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300"
          />

          {/* User Bio */}
          <textarea
            placeholder="Bio..."
            className="p-2 rounded-md bg-teal-500/30 text-white outline-none placeholder:text-blue-300"
            rows={4}
            value={userBio}
            onChange={(e) => setUserBio(e.target.value)}
          />

          {/* Save Button */}
          <button
            type="submit"
            className="bg-blue-500/20 text-white py-2 rounded-md hover:bg-blue-500/30 active:bg-violet-500 transition-colors duration-300"
          >
            Save Changes
          </button>
        </form>

        <div className="flex justify-center items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="max-w-44 rounded-full mx-10 mt-10 sm:mt-0"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
