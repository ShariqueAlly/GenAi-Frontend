import {getAllInterviewReports, generateInterviewReport, getInterviewReportById,downloadInterviewReportPdf} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview = () => {
    const context = useContext(InterviewContext)
    if(!context) throw new Error("useInterview must be used within an InterviewProvider")
    const {loading, setLoading, reports, setReports, report, setReport} = context;

    const generateReport = async ({jobDescription, selfDescription, resume})=>{
        try {
            setLoading(true);
            const data = await generateInterviewReport({jobDescription, selfDescription, resume})
            setReport(data);
            return data;
        } catch (error) {
            console.error("Error generating interview report:", error);
            return null;
        } finally {
            setLoading(false);
        }       
     }

     const getReportById = async (interviewId)=>{
        try {
            setLoading(true);
            const data = await getInterviewReportById(interviewId)
            setReport(data);
        } catch (error) {
            console.error("Error fetching interview report:", error);
        } finally {
            setLoading(false);
        }       
    }

    const getReports = async ()=>{
        try {
            setLoading(true);
            const data = await getAllInterviewReports()
            setReports(data);
        } catch (error) {
            console.error("Error fetching interview reports:", error);
        } finally {
            setLoading(false);
        }           
}
    const downloadReportPdf = async (interviewId)=>{
        try {
            const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
            if (isIOS) {
                const token = localStorage.getItem("auth_token");
                const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
                const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;
                const downloadUrl = `${apiBaseUrl}/interview/report/${interviewId}/pdf?inline=1&token=${encodeURIComponent(token || "")}`;
                // iOS Safari blocks programmatic downloads; navigate to the PDF so it opens in the viewer.
                window.location.href = downloadUrl;
                return;
            }

            const pdfBlob = await downloadInterviewReportPdf(interviewId);
            const blob = new Blob([pdfBlob], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `interview_report_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading interview report PDF:", error);
        }
    }   
    return {
        loading,
        report,
        reports,
        setReport,
        setReports,
        generateReport,
        getReportById,
        getReports,
        downloadReportPdf
    }
}
