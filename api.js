/**
 * api.js
 * 
 * Central API service to communicate with Firebase Cloud Functions.
 */

// Replace this with your deployed Firebase Functions URL when ready.
// Typically: https://us-central1-<project-id>.cloudfunctions.net/api
const API_BASE_URL = 'http://localhost:5001/neobank-e9781/us-central1/api';

window.ApiService = {
    
    /**
     * Helper to show loading states or handles errors
     */
    async request(endpoint, options = {}) {
        try {
            // Get auth token if available
            let token = "";
            if (window.FirebaseAuth && window.FirebaseAuth.currentUser) {
                token = await window.FirebaseAuth.currentUser.getIdToken();
            }

            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...options.headers
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                // Return an error object if the request failed
                throw new Error(data.error || 'API Request Failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Get all users
     * @returns {Promise<Array>} Array of user objects
     */
    async getUsers() {
        return this.request('/users');
    },

    /**
     * Get a specific user by ID
     * @param {string} id User ID
     * @returns {Promise<Object>} User object
     */
    async getUser(id) {
        return this.request(`/users/${id}`);
    },

    /**
     * Create a new user
     * @param {Object} userData { name, email, phone }
     * @returns {Promise<Object>} the created user details
     */
    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    /**
     * Update an existing user
     * @param {string} id User ID
     * @param {Object} userData Updated properties
     * @returns {Promise<Object>}
     */
    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    /**
     * Delete a user
     * @param {string} id User ID
     * @returns {Promise<Object>}
     */
    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }
};
