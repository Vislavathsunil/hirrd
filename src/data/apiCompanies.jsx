import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function GetCompanies(token) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("companies")
        .select("*")

    if (error) {
        console.log("Error in fetching Companies :", error);
        return null;
    }
    return data;

}

export async function AddNewComapany(token, _, companyData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    // Method to get file extension
    // const fileExtension = companyData.logo.name.split('.').pop();  
    // console.log(fileExtension)
    
    const filename = `logo-${random}-${companyData.name}`;

    const { error: StorageError } = await supabase.storage
        .from("company-logos")
        .upload(filename, companyData.logo);


    if (StorageError) {
        console.log("Error in Uploading company logo in storage :", StorageError);
        return null;
    }

    // resume url
    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logos/${filename}`;

    const { data, error } = await supabase.from("companies").insert([{
        name: companyData.name,
        logo_url,
    }]).select();

    if (error) {
        console.log("Error in submitting company:", error);
        return null;
    }
}