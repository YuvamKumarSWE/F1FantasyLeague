import api from '../lib/axios'

export const constructorService = {
    getAllConstructors : async() => {
        try {
            const response = await api.get('/constructors');
            return response.data;
        } catch (error) {
            console.error('Error fetching constructors:', error);
            throw error;
        }
    }
}