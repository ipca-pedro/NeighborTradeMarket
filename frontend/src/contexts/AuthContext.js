import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Verificar se o token existe no localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserProfile(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async (authToken) => {
        try {
            // Configurar o token no cabeçalho de autorização
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            
            // Obter o perfil do utilizador
            const response = await api.get('/perfil');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Erro ao obter perfil do utilizador:', error);
            // Se houver erro, limpar o token
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { Email: email, Password: password });
            const authToken = response.data.token;
            
            // Guardar o token no localStorage
            localStorage.setItem('token', authToken);
            setToken(authToken);
            
            // Configurar o token no cabeçalho de autorização
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            
            // Obter o perfil do utilizador
            await fetchUserProfile(authToken);
            
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Chamar a API para logout
            if (token) {
                await api.post('/logout');
            }
        } catch (error) {
            console.error('Erro ao terminar sessão:', error);
        } finally {
            // Limpar token e utilizador mesmo se houver erro na API
            localStorage.removeItem('token');
            setToken(null);
            setCurrentUser(null);
            // Remover o token do cabeçalho de autorização
            delete api.defaults.headers.common['Authorization'];
        }
    };

    const resetPassword = async (email) => {
        try {
            const response = await api.post('/password/reset', { Email: email });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/perfil', profileData);
            setCurrentUser(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        loading,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
