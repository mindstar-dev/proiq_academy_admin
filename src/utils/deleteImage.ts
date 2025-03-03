import { supabase } from "./supabaseClient";

export const deleteImage = async (publicUrl: string, bucketName: string) => {
  try {
    // Extract the file path from the public URL
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const filePath = publicUrl.replace(baseUrl, "");
    console.log(filePath);
    if (!filePath) {
      console.error("Invalid file path extracted from URL");
      return;
    }

    // Delete the image from Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([bucketName, filePath]);

    if (error) throw error;

    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
