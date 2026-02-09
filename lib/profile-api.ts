import { Profile, CreateProfilePayload, UpdateProfilePayload, ApiResponse } from "@/types/profile";

/**
 * Profile API Client
 * Helper functions untuk berinteraksi dengan Profile API
 */

const API_BASE_URL = "/api/profile";

/**
 * Fetch all profiles
 */
export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const response = await fetch(API_BASE_URL);
    const result: ApiResponse<Profile[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch profiles");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
}

/**
 * Fetch profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`);
    const result: ApiResponse<Profile> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch profile");
    }

    return result.data || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

/**
 * Create new profile
 */
export async function createProfile(payload: CreateProfilePayload): Promise<Profile> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<Profile[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create profile");
    }

    if (!result.data || result.data.length === 0) {
      throw new Error("No data returned from create operation");
    }

    return result.data[0];
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
}

/**
 * Update existing profile
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: ApiResponse<Profile[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update profile");
    }

    if (!result.data || result.data.length === 0) {
      throw new Error("No data returned from update operation");
    }

    return result.data[0];
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

/**
 * Delete profile by ID
 */
export async function deleteProfile(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete profile");
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
}

/**
 * Search profiles by name or email
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  try {
    const profiles = await getAllProfiles();
    const lowerQuery = query.toLowerCase();

    return profiles.filter((profile) => profile.nama.toLowerCase().includes(lowerQuery) || profile.email.toLowerCase().includes(lowerQuery));
  } catch (error) {
    console.error("Error searching profiles:", error);
    throw error;
  }
}

/**
 * Filter profiles by year and month using API query params
 */
export async function filterProfilesByDate(year?: string, month?: string): Promise<Profile[]> {
  try {
    // Build query params
    const params = new URLSearchParams();
    if (year) params.append("tahun", year);
    if (month) params.append("bulan", month);

    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

    const response = await fetch(url);
    const result: ApiResponse<Profile[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to filter profiles");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error filtering profiles:", error);
    throw error;
  }
}

/**
 * Get available filter options (years and months)
 */
export async function getFilterOptions(): Promise<{ years: string[]; months: string[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/filters`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch filter options");
    }

    return result.data || { years: [], months: [] };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }
}

/**
 * Calculate total score from individual scores
 */
export function calculateTotalScore(structure: number, listening: number, reading: number): number {
  // Formula: ((structure + listening + reading) / 3) * 10
  // Adjust this formula based on your actual scoring system
  return ((structure + listening + reading) / 3) * 10;
}
