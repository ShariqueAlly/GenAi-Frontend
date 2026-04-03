import axios from "axios";
import { clearAuthToken } from "../../auth/services/auth.api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const getToken = () => localStorage.getItem("auth_token");

const api = axios.create({
    baseURL: apiBaseUrl
})

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            clearAuthToken();
        }
        return Promise.reject(error);
    }
);

export const generateInterviewReport = async ({jobDescription, selfDescription, resume})=>{ 
    try {
       const formData = new FormData();
       formData.append("jobDescription", jobDescription);
       formData.append("selfDescription", selfDescription);
       formData.append("resume", resume);

       const response = await api.post("/interview", formData);
       return response.data.data;

    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
}

export const getInterviewReportById = async (interviewId)=>{
    try {
        const response = await api.get(`/interview/report/${interviewId}`) 
        return response.data.data;
    } catch (error) {
        console.error("Error fetching interview report:", error);
        throw error;
    }
}

export const getAllInterviewReports = async ()=>{
    try {
        const response = await api.get("/interview/reports") 
        return response.data.data;
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        throw error;
    }
}   

export const downloadInterviewReportPdf = async (interviewId)=>{
    try {
        const response = await api.get(`/interview/report/${interviewId}/pdf`, {
            responseType: "blob"
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading interview report PDF:", error);
        throw error;
    }
}

