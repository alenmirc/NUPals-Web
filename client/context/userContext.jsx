import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
                console.log("Fetched user data:", data);
                setUser(data || null); // Set user to null if no data is returned
            })
            .catch((error) => {
                console.error("Error fetching profile data:", error);
            })
            .finally(() => {
                setLoading(false);
                console.log("Loading complete. User state:", user);
            });
    }, [user]); // Add user as a dependency

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
