import supabaseClient from "@/utils/supabase"

export const GetJobs = async (token, { location, company_id, search_query }) => {
    // console.log(token);

    const supabase = await supabaseClient(token);
    let query = supabase.from("jobs").select("*,company:companies(name,logo_url),savedJobs:saved_jobs(id)");
    // let query = supabase.from("jobs").select("*");

    if (location) {
        query = query.eq("location", location);
    }

    if (company_id) {
        query = query.eq("company_id", company_id);
    }
    if (search_query) {
        query = query.ilike("title", `%${search_query}%`);
    }



    const { data, error } = await query;
    if (error) {
        console.log("Error while fetching job :", error);
        return null;
    }
    return data;
}


export const SavedJobs = async (token, { alreadySaved }, savedData) => {

    const supabase = await supabaseClient(token);

    if (alreadySaved) {
        const { data, error: deleteError } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("job_id", savedData.job_id)

        if (deleteError) {
            console.log("Error in delete Save Jobs :", deleteError);
            return null;
        }
        return data;
    } else {
        const { data, error: insertError } = await supabase
            .from("saved_jobs")
            .insert([savedData])
            .select()

        if (insertError) {
            console.log("Error in insert Save Jobs :", insertError);
            return null;
        }
        return data;
    }

}


export const GetSingleJob = async (token, { job_id }) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .select("*,company:companies(name,logo_url),applications:applications(*)")
        .eq("id", job_id)
        .single();

    if (error) {
        console.log("Error in getting single job  :", error);
        return null;
    }

    return data;
}

export const UpdateHireStatus = async (token, { job_id }, isOpen) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .update({ isOpen })
        .eq("id", job_id)
        .single();

    if (error) {
        console.log("Error in Updating Hiring Status :", error);
        return null;
    }
    return data;
}



export const AddNewJob = async (token, _, jobData) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .insert([jobData])
        .single();

    if (error) {
        console.log("Error in adding job data :", error);
        return null;
    }

    return data;
}


export const GetSavedJobs = async (token) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("saved_jobs")
        .select("*,job:jobs(*,company:companies(name,logo_url))");

    if (error) {
        console.log("Error in fetching saved jobs :", error);
        return null;
    }

    return data;
}

export const GetMyJobs = async (token, { recruiter_id }) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .select("*,company:companies(name,logo_url)")
        .eq("recruiter_id", recruiter_id);

    if (error) {
        console.log("Error in fetching my jobs :", error);
        return null;
    }

    return data;
}

export const DeleteMyJobs = async (token, { job_id }) => {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id);

    if (error) {
        console.log("Error in deleting my jobs :", error);
        return null;
    }

    return data;
}


