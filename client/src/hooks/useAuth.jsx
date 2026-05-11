import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from 'firebase/auth';
import { auth } from '@/firebase.config';
import api from '@/services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await api.get('/users/profile');
                    const profileData = response.data.data.user;
                    setUser(profileData);
                    localStorage.setItem('user', JSON.stringify(profileData));
                } catch (error) {
                    console.error('Failed to fetch user profile', error);
                    // If token is invalid, clear storage
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, []);

    const register = async (email, password, name, photoURL, role) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                name,
                photoURL,
                role
            });
            const { user, token } = response.data.data;

            // Save to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            return user;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            const { user, token } = response.data.data;

            // Save to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            return user;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Send to backend to create/login user
            const response = await api.post('/auth/login', {
                email: firebaseUser.email,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                isGoogle: true
            });

            const { user, token } = response.data.data;

            // Save to local storage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            return user;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth); // Sign out from Firebase too if applicable
        } catch (error) {
            console.error("Firebase logout error", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
