import { useState, useEffect, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Get backend URL from environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// Create authentication context
export const AuthContext = createContext();

// AuthProvider component to wrap app and provide auth state
export const AuthProvider = ({ children }) => {
    // State for JWT token
    const [token, setToken] = useState(localStorage.getItem("token"));
    // State for authenticated user object
    const [authUser, setAuthUser] = useState(null);
    // State for list of online users
    const [onlineUsers, setOnlineUser] = useState([]);
    // State for socket connection
    const [socket, setSocket] = useState(null);
    // State for current user's status (online/offline/invisible)
    const [userStatus, setUserStatus] = useState("online");

    // Restore user from localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
            setAuthUser(JSON.parse(storedUser));
        }
    }, []);

    // Persist user to localStorage whenever authUser changes
    useEffect(() => {
        if (authUser) {
            localStorage.setItem("authUser", JSON.stringify(authUser));
        } else {
            localStorage.removeItem("authUser");
        }
    }, [authUser]);

    // Login or signup function
    const login = async (state, credentials) => {
        try {
            // Send login/signup request to backend
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (data.success) {
                // Set authenticated user
                setAuthUser(data.user);

                // Set token for future API requests
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                setToken(data.token);
                localStorage.setItem("token", data.token);

                // If user was offline, set status to online
                if (data.user.status === "offline") {
                    setUserStatus("online");
                    await changeStatus("online", true);
                }

                // Connect to socket server
                connectSocket(data.user);

                // Show success message
                toast.success(data.message);
            } else {
                // Show error message
                toast.error(data.message);
            }
        } catch (error) {
            // Show error message from server or generic error
            toast.error(error.response?.data?.error || error.message);
        }
    };

    // Check authentication status on initial load
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setAuthUser(null);

            // Set token for API requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const res = await axios.get("/api/auth/auth-check");

            if (res.data?.userData) {
                setAuthUser(res.data.userData);

                // Restore user status
                const savedStatus = res.data.userData.status;
                setUserStatus(savedStatus);

                // Connect to socket server
                connectSocket(res.data.userData);
            }
        } catch (error) {
            // If unauthorized, clear auth state
            if (error.response?.status === 401) {
                setAuthUser(null);
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            } else {
                // Otherwise, warn and retry later
                console.warn("Auth check failed (server issue), will retry...");
            }
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // If not invisible, set status to offline before logout
            if (userStatus !== "invisible") {
                await changeStatus("offline", false);
            } else {
                setUserStatus("invisible");
            }
        } catch (err) {
            // Warn if failed to update status
            console.warn("Failed to update status before logout:", err.message);
        }

        // Clear local storage and auth state
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logged out successfully");

        // Disconnect socket if connected
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    // Update user profile details
    const updateUser = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/updateUser", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("User details updated");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
        }
    };

    // Change user status (online/offline/invisible)
    const changeStatus = async (newStatus, silent) => {
        try {
            const { data } = await axios.put("/api/auth/set-status", { status: newStatus });
            if (data.success) {
                setUserStatus(data.user.status);
                setAuthUser(data.user);
                if (!silent) toast.success(`Status changed to ${newStatus}`);
            }
        } catch (err) {
            if (!silent) toast.error(err.response?.data?.message || "Failed to update status");
        }
    };

    // Connect to socket server and listen for online users
    const connectSocket = (userData) => {
        if (!userData) return;

        // Disconnect previous socket if exists
        if (socket) {
            socket.disconnect();
        }

        // Create new socket connection
        const newSocket = io(backendUrl, { query: { userId: userData._id } });
        newSocket.connect();
        setSocket(newSocket);

        // Listen for online users update
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUser(userIds);
        });
    };

    // On initial load, set token and check authentication
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        checkAuth();
    }, [token]);

    // Context value to provide to children
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateUser,
        changeStatus,
        userStatus
    };

    // Provide context to children components
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
