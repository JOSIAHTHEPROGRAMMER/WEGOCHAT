import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

// Create a context for chat-related state and actions
export const ChatContext = createContext();

// Provider component to wrap around parts of the app that need chat state
export const ChatProvider = ({ children }) => {
    // State for messages, users, selected user, and unread messages
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState({});

    // Get socket and axios from AuthContext
    const { socket, axios } = useContext(AuthContext);

    // Fetch users and their unread messages count
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnreadMessages(data.unreadMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch messages for a specific user
    const getMessages = async (userId) => {
        try {
            // NOTE: Should use userId, not users
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Send a message to the selected user
    const sendMessages = async (messageData) => {
        try {
            // NOTE: Should use POST for sending messages
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                // Add new message to messages state
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Subscribe to new incoming messages via socket
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            // If message is from the selected user, mark as read and add to messages
            if (selectedUser && newMessage.sender === selectedUser._id) {
                newMessage.isRead = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                // Otherwise, increment unread count for sender
                setUnreadMessages((prevUnreadMessages) => ({
                    ...prevUnreadMessages,
                    [newMessage.sender]: prevUnreadMessages[newMessage.sender]
                        ? prevUnreadMessages[newMessage.sender] + 1
                        : 1
                }));
            }
        });
    };

    // Unsubscribe from socket events
    const unsubscribeFromMessages = async () => {
        if (socket) socket.off("newMessage");
    };

    // Subscribe/unsubscribe to messages when socket or selectedUser changes
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    // Context value to provide to consumers
    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMessages,
        setSelectedUser,
        unreadMessages,
        setUnreadMessages
    };

    // Provide chat context to children
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
