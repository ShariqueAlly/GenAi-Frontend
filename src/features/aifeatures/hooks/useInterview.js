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
            const pdfBlob = await downloadInterviewReportPdf(interviewId);
            const url = window.URL.createObjectURL(new Blob([pdfBlob]));
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
