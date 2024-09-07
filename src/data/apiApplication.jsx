import supabaseClient, { supabaseUrl } from "@/utils/supabase";




export const ApplyJob = async (token, _, jobData) => {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    const filename = `resume-${random}-${jobData.candidate_id}`;

    const { error: StorageError } = await supabase.storage
        .from("resumes")
        .upload(filename, jobData.resume);


    if (StorageError) {
        console.log("Error in Uploading resume in storage :", StorageError);
        return null;
    }

    // resume url
    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${filename}`;

    const { data, error } = await supabase.from("applications").insert([{
        ...jobData,
        resume,
    }]).select();

    if (error) {
        console.log("Error in submitting application:", error);
        return null;
    }

    return data;
}




export const UpdataApplication = async (token, { job_id }, status) => {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("applications")
        .update({ status: status })
        .eq("job_id", job_id)
        .select();

    if (error) {
        console.log("Error in updating job status :", error);
        return null;
    }

    return data;
}



export const GetApplications = async (token, { user_id }) => {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("applications")
        .select("*,job:jobs(title,company:companies(name))")
        .eq("candidate_id", user_id)


    if (error) {
        console.log("Error in fetching applications:", error);
        return null;
    }

    return data;
}





