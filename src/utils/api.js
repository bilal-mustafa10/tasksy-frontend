import {axiosInstance} from "./auth";

export const uploadDocument = async (applicationId, title, file, type) => {
    const data = new FormData();
    const user_id = localStorage.getItem("UserId");
    data.append('applicationId',applicationId);
    data.append('userId',user_id);
    data.append('title',title);
    data.append('type',type);
    data.append('file',file)
    const config = {
        timeout: 7000,
    };

    try{
        const response = await axiosInstance.post('/documents/',data, config);
        return response.data['id'];
    }catch (c){
        return null
    }
}

export const getDocuments = async () => {
    const config = {timeout: 7000,};

    try{
        const response = await axiosInstance.get(`/documents/`,config);
        return response.data;
    }catch (c){
        return null
    }
}

export const deleteDocument = async (document_id) => {
    const config = {timeout: 7000,};

    try{
        const response = await axiosInstance.delete(`/documents/${document_id}/`,config);
        return response.data;
    }catch (c){
        return null
    }
}

export const getApplications = async () => {
    const config = {timeout: 7000,};

    try{
        const response = await axiosInstance.get('/applications/',config);
        return response.data.results;
    }catch (c){
        return null
    }
}


export const createNewApplication = async (company_name, position, job_description, notes, deadline, status, interview_call, assessment, interview_final, progress) => {
    const config = {timeout: 7000,};
    const user_id = localStorage.getItem("UserId");

    const data = {
        userId: user_id,
        companyName: company_name,
        position: position,
        description: job_description,
        notes: notes,
        deadline: deadline,
        status: status,
        progress: progress,
        assessment: assessment,
        interviewCall: interview_call,
        interviewFinal: interview_final,
        offer: false,
        accepted: null,
    }

    try{
        const response = await axiosInstance.post('/applications/', data, config);
        return response.data['id'];
    }catch (c){
        return null
    }
}

export const updateApplication = async (application_id, company_name, position, job_description, notes, deadline, status, interview_call, assessment, interview_final, progress, offer, accepted) => {
    const config = {timeout: 7000,};
    const user_id = localStorage.getItem("UserId");
    console.log("USER_ID: ",user_id);

    const data = {
        userId: user_id,
        companyName: company_name,
        position: position,
        description: job_description,
        notes: notes,
        deadline: deadline,
        status: status,
        progress: progress,
        assessment: assessment,
        interviewCall: interview_call,
        interviewFinal: interview_final,
        offer: offer,
        accepted: accepted,
    }

    try{
        const response = await axiosInstance.put(`/applications/${application_id}/`, data, config);
        return response.data['id'];
    }catch (c){
        return null
    }
}




export const deleteApplication = async (application_id) => {
    const config = {timeout: 7000,};

    try{
        const response = await axiosInstance.delete(`/applications/${application_id}/`,config);
        return response.data.results;
    }catch (c){
        return null
    }
}
