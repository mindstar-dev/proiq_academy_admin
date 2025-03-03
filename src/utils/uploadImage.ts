import { supabase } from "./supabaseClient";

export async function uploadFile(
  file: File,
  userName: string,
  bucketName: string
): Promise<string | null> {
  if (!file) {
    throw new Error("No file provided!");
  }

  // Create a unique filename
  const fileName = `${Date.now()}-${userName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName) // Replace with your actual bucket name
    .upload(`${fileName}`, file);

  if (error) {
    console.error("Upload error:", error);
    throw new Error("Upload failed!");
  }

  // Get public URL
  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(data.path)
    .data.publicUrl;
  return publicUrl;
}
