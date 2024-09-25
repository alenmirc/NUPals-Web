import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Prevent fetching if user data is already set
        if (user !== null) {
            setLoading(false);
            return; // Early exit if user is already defined
        }

        console.log("Fetching user profile...");
        axios.get('/profile', { withCredentials: true })
            .then(({ data }) => {
                if (!data) {
                    // If no user data is returned, it may indicate session expiry
                    toast.error('Session expired, please login again', { autoClose: 8000 });
                } else {
                    setUser(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching profile data:", error);
                toast.error('Session expired, please login again', { autoClose: 8000 });
            })
            .finally(() => {
                setLoading(false); // Set loading to false when request completes
            });
    }, []);    

    const logout = () => {
        axios.post('/logout').then(() => {
            setUser(null);
        });
    };

    const isAdmin = user && user.role === 'admin';
    const isSuperadmin = user && user.role === 'superadmin';

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading, isAdmin, isSuperadmin }}>
            {children}
        </UserContext.Provider>
    );
}
