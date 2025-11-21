import axios from 'axios';

const BASE_API_URL = '/incidencias/api/cuadrilla/incidencias/'; // Adjust based on your proxy or full URL

const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Token ${token}`,
        },
    };
};

export const CuadrillaService = {
    getIncidencias: async (estado?: string) => {
        try {
            const url = estado ? `${BASE_API_URL}?estado=${estado}` : BASE_API_URL;
            const response = await axios.get(url, getAuthConfig());
            return response.data;
        } catch (error: any) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        }
    },

    getIncidenciaById: async (id: number) => {
        try {
            const response = await axios.get(BASE_API_URL, getAuthConfig());
            const incidencias = response.data;
            return incidencias.find((inc: any) => inc.id === id);
        } catch (error: any) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        }
    },

    getEstadisticas: async () => {
        try {
            // Fetch all incidents to calculate statistics
            const response = await axios.get(BASE_API_URL, getAuthConfig());
            const incidencias = response.data;

            const total = incidencias.length;
            const enProceso = incidencias.filter((inc: any) => inc.estado === 'en_proceso').length;
            const finalizadas = incidencias.filter((inc: any) => inc.estado === 'finalizada').length;

            return {
                total,
                pendientes: enProceso,
                resueltas: finalizadas
            };
        } catch (error: any) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw error;
        }
    },

    resolverIncidencia: async (id: number, data: { evidencia_urls: string[], comentario: string }) => {
        try {
            const response = await axios.post(`${BASE_API_URL}${id}/resolver/`, data, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
