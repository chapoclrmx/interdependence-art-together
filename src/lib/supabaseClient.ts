import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a photo to the 'art-together-photos' bucket
 * @param canvasId - The canvas ID (e.g., 'venus')
 * @param base64DataUrl - The base64 data URL from the photo
 * @returns The public URL of the uploaded photo
 */
export async function uploadCanvasPhoto(
  canvasId: string,
  base64DataUrl: string
): Promise<string> {
  try {
    // Convert data URL to Blob
    const response = await fetch(base64DataUrl);
    const blob = await response.blob();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${canvasId}/${timestamp}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("art-together-photos")
      .upload(filename, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("art-together-photos")
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
}

/**
 * Save canvas state with the latest photo URL
 * @param canvasId - The canvas ID (e.g., 'venus')
 * @param photoUrl - The URL of the uploaded photo
 */
export async function saveCanvasState(
  canvasId: string,
  photoUrl: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("canvas_states")
      .upsert(
        {
          canvas_id: canvasId,
          latest_photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "canvas_id" }
      );

    if (error) throw error;
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}

/**
 * Get the latest canvas state
 * @param canvasId - The canvas ID (e.g., 'venus')
 * @returns The URL of the latest photo, or null if no photo exists
 */
export async function getCanvasLatestPhotoUrl(
  canvasId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("canvas_states")
      .select("latest_photo_url")
      .eq("canvas_id", canvasId)
      .maybeSingle();

    if (error) throw error;
    return data?.latest_photo_url || null;
  } catch (error) {
    console.error("Error fetching canvas state:", error);
    return null;
  }
}
