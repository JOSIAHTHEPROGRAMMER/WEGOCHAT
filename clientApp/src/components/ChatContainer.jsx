import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  BadgeInfo,
  SendHorizontal,
  CheckCheck,
  Check,
  ArrowBigDown,
  Smile,
  ImagePlay,
  Paperclip,
  PlusCircle,
  FileAudio,
  
  FileImage,
  
  FileText,
  Sticker,
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import assets, { messagesDummyData } from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import StatusDot from '../lib/statusDot'

// Giphy API Key
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

const ChatContainer = ({ selectedUser, setSelectedUser, setShowSidebar }) => {

  const {authUser, userStatus} = useContext(AuthContext);
  
  // Refs
  const scrollEnd = useRef(null);
  const chatContainerRef = useRef(null);

  // UI State
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Data State
  const [gifs, setGifs] = useState([]);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [stickers, setStickers] = useState([]);
  const [stickerSearchTerm, setStickerSearchTerm] = useState('');

  // Scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Show scroll-to-bottom button if not near bottom
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    setShowScrollButton(!nearBottom);
  };

  // Add emoji to message input
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Fetch GIFs from Giphy
  const fetchGifs = async (searchTerm = '') => {
    try {
      const endpoint = searchTerm
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=12&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=12&rating=g`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setGifs(data.data);
    } catch (err) {
      console.error('Error fetching GIFs:', err);
    }
  };

  // Fetch Stickers from Giphy
  const fetchStickers = async (searchTerm = '') => {
    try {
      const endpoint = searchTerm
        ? `https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=12&rating=g`
        : `https://api.giphy.com/v1/stickers/trending?api_key=${GIPHY_API_KEY}&limit=12&rating=g`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setStickers(data.data);
    } catch (err) {
      console.error('Error fetching stickers:', err);
    }
  };

  // Handle GIF selection
  const handleGifClick = (gifUrl) => {
    console.log('Selected GIF:', gifUrl);
    setShowGifPicker(false);
  };

  // Fetch GIFs when picker opens
  useEffect(() => {
    if (showGifPicker) {
      fetchGifs();
    }
  }, [showGifPicker]);

  // Fetch Stickers when picker opens
  useEffect(() => {
    if (showStickerPicker) {
      fetchStickers();
    }
  }, [showStickerPicker]);

  // Show prompt if no user selected
  if (!selectedUser) {
    return (

          <div className="flex flex-col items-center justify-center gap-2 text-gray-500/70 h-full">
            <div className='flex flex-col items-center mb-5'>
              <img 
                src={!authUser?.profilePicture ? assets.avatar_icon : authUser.profilePicture}
                alt="profile" 
                className=" w-50 max-w-100 rounded-full object-cover mb-4" 
              />
              <p className="text-lg font-medium text-white" ><StatusDot status={userStatus}/>   {authUser.username}</p>
            </div>

            <img src={assets.logo} alt="logo" className="max-w-40" />
            
            <p className="text-lg font-medium">Select a user to start chatting</p>
          </div>

    );
  }

  return (
    <div className="h-full w-full max-w-screen-sm mx-auto px-2 flex flex-col relative min-h-screen">

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed bottom-16 z-50 bbg-blue-500/20 p-2 rounded-lg shadow-lg w-[95vw] sm:w-[400px] h-[350px]">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width="100%"
            height="100%"
          />
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div className="fixed bottom-16 z-50 bg-blue-500/20 p-3 rounded-lg shadow-lg w-[95vw] sm:w-[400px] h-[350px] overflow-hidden flex flex-col">
          <input
            type="text"
            placeholder="Search GIFs..."
            value={gifSearchTerm}
            onChange={(e) => setGifSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchGifs(gifSearchTerm)}
            className="mb-2 p-2 rounded-md bg-gray-800 text-white placeholder:text-gray-400 outline-none"
          />
          <div className="overflow-y-auto grid grid-cols-3 gap-2 flex-1">
            {gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height_small.url}
                alt={gif.title}
                className="w-full h-full rounded-md cursor-pointer hover:opacity-75 object-cover"
                onClick={() => handleGifClick(gif.images.original.url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticker Picker */}
      {showStickerPicker && (
        <div className="fixed bottom-16 z-50 bg-blue-500/20 p-3 rounded-lg shadow-lg w-[95vw] sm:w-[400px] h-[350px] overflow-hidden flex flex-col">
          <input
            type="text"
            placeholder="Search Stickers..."
            value={stickerSearchTerm}
            onChange={(e) => setStickerSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStickers(stickerSearchTerm)}
            className="mb-2 p-2 rounded-md bg-gray-800 text-white placeholder:text-gray-400 outline-none"
          />
          <div className="overflow-y-auto grid grid-cols-3 gap-2 flex-1">
            {stickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.images.fixed_height_small.url}
                alt={sticker.title}
                className="w-full h-full rounded-md cursor-pointer hover:opacity-75 object-cover"
                onClick={() => {
                  console.log('Selected Sticker:', sticker.images.original.url);
                  setShowStickerPicker(false);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Attachment Options */}
      {showAttachmentMenu && (
        <div className="absolute bottom-57 left-4 z-40 bg-blue-500/60 text-white p-3 rounded-xl shadow-xl flex flex-col gap-3">
          {/* Document Upload */}
          <label
            htmlFor="docInput"
            className="flex items-center gap-2 hover:text-teal-400 cursor-pointer active:text-violet-500 "
          >
            <FileText size={20} /> Document
            <input
              type="file"
              id="docInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const isImage = file.type.startsWith('image/');
                const isAudio = file.type.startsWith('audio/');
                const isVideo = file.type.startsWith('video/');
                if (isImage || isAudio || isVideo) {
                  alert('Please use the correct button for media files.');
                  return;
                }
                // will Handle document upload here later
              }}
            />
          </label>

          {/* Photo/Video Upload */}
          <label
            htmlFor="mediaInput"
            className="flex items-center gap-2 hover:text-teal-400 cursor-pointer active:text-violet-500 "
          >
            <FileImage size={20} /> Photo/Video
            <input
              type="file"
              id="mediaInput"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');
                if (!isImage && !isVideo) {
                  alert('Please upload only images or videos.');
                  return;
                }
                // will handle image/video upload here later
              }}
            />
          </label>


          {/* Audio and Location Buttons */}
          <label className="flex items-center gap-2 hover:text-teal-400 active:text-violet-500 cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

          
              }}
            />
            <FileAudio size={20} /> Audio
          </label>

         
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-400/20 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={assets.profile_pic5}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => setShowSidebar((prev) => !prev)}
          />
          <div className="flex items-center gap-2">
            <p className="text-white text-base font-medium">Leo Kim</p>
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden text-white hover:text-teal-500/50"
          >
            <ArrowLeft size={20} />
          </button>
          <button className="text-white hover:text-teal-500/50">
            <BadgeInfo size={20} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 sm:pb-20 md:pb-40"
      >
        {messagesDummyData.map((msg, index) => {
          const isSender = msg.senderId === 'user-002';
          return (
            <div
              key={index}
              className={`flex items-end mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for received messages */}
              {!isSender && (
                <img
                  src={assets.avatar_icon}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover mr-2 cursor-pointer"
                  onClick={() => setShowSidebar((prev) => !prev)}
                />
              )}
              <div className={`flex flex-col max-w-xs ${isSender ? 'items-end' : 'items-start'}`}>
                {/* Image or Text Message */}
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Message"
                    className={`rounded-lg shadow-md border border-gray-300 ${
                      isSender ? 'rounded-bl-none' : 'rounded-br-none'
                    }`}
                  />
                ) : (
                  <div
                    className={`p-3 rounded-lg ${
                      isSender
                        ? 'bg-blue-500/30 text-white rounded-br-none'
                        : 'bg-purple-500/30 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="p-2 max-w-xs md:text-sm font-light break-words">{msg.text}</p>
                  </div>
                )}
                {/* Message Time and Status */}
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {msg.seen ? (
                    <CheckCheck size={14} className="text-green-400" />
                  ) : (
                    <Check size={14} className="text-gray-400" />
                  )}
                </div>
              </div>
              {/* Avatar for sent messages */}
              {isSender && (
                <img
                  src={assets.profile_pic5}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover ml-2 cursor-pointer"
                  onClick={() => setShowSidebar((prev) => !prev)}
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd} />
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 p-3 bg-blue-500/70 rounded-full text-white hover:bg-blue-600 transition-colors"
          >
            <ArrowBigDown size={20} />
          </button>
        )}
      </div>

      {/* Message Input Area */}
      <div className="sticky bottom-0 w-full flex items-center gap-3 p-3 px-4 bg-gray-800/40 backdrop-blur-md rounded-t-xl">
        {/* Attachments Button */}
        <button
          onClick={() => setShowAttachmentMenu((prev) => !prev)}
          className="text-blue-300 hover:text-blue-500 active:text-violet-500 "
        >
          <Paperclip size={20} />
        </button>

        {/* More Options Button */}
        <button
          onClick={() => {
            setShowMoreOptions((prev) => !prev);
            setShowEmojiPicker(false);
            setShowGifPicker(false);
            setShowStickerPicker(false);
          }}
          className="text-blue-300 hover:text-blue-500 active:text-violet-500 "
        >
          <PlusCircle size={20} />
        </button>

        {/* Emoji/GIF/Sticker Picker Options */}
        {showMoreOptions && (
          <div className="absolute bottom-17 right-4 bg-blue-500/60 text-white p-3 rounded-xl shadow-xl flex flex-col gap-3 z-50">
            <button
              onClick={() => {
                setShowEmojiPicker(true);
                setShowGifPicker(false);
                setShowStickerPicker(false);
              }}
              className="flex items-center gap-2 hover:text-teal-400 active:text-violet-500 "
            >
              <Smile size={18} /> Emoji
            </button>
            <button
              onClick={() => {
                setShowEmojiPicker(false);
                setShowGifPicker(true);
                setShowStickerPicker(false);
              }}
              className="flex items-center gap-2 hover:text-teal-400 active:text-violet-500  "
            >
              <ImagePlay size={18} /> GIF
            </button>
            <button
              onClick={() => {
                setShowEmojiPicker(false);
                setShowGifPicker(false);
                setShowStickerPicker(true);
              }}
              className="flex items-center gap-2 hover:text-teal-400 active:text-violet-500 "
            >
              <Sticker size={18} /> Sticker
            </button>
          </div>
        )}

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-transparent text-white placeholder:text-blue-300 outline-none"
        />

        {/* Send Button */}
        <button className="p-2 bg-blue-500/70 rounded-full active:bg-violet-500 text-white hover:bg-blue-600">
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
