// Set VITE_API_URL in your production build env, e.g. https://api.yourdomain.com/api
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api";
const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

export const resolveImageUrl = (url) => {
  if (typeof url !== "string" || !url) return "";
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  return url;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return token 
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

// --- AUTH ---
export const loginAdmin = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

// --- PROJECTS ---
export const fetchProjects = async (featuredOnly = false) => {
  try {
    const res = await fetch(`${API_URL}/projects${featuredOnly ? "?featured=true" : ""}`);
    if (!res.ok) return []; 
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Backend connection failed, falling back to empty state:", error);
    return []; 
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Backend connection failed, falling back to Not Found:", error);
    return null; 
  }
};

export const createProject = async (projectData) => {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

export const uploadProjectImages = async (files) => {
  try {
    const body = new FormData();
    files.forEach((file) => body.append("images", file));
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
    const json = await res.json();
    if (!res.ok || !json.success) return { success: false, message: json.message || "Image upload failed" };
    return { ...json, data: { ...json.data, images: json.data.images.map(({ url }) => resolveImageUrl(url)) } };
  } catch (error) {
    console.error("Error uploading project images:", error);
    return { success: false, message: "فشل الاتصال بالخادم أثناء رفع الصور" };
  }
};

export const deleteProject = async (id) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

// --- GALLERY ---
export const fetchGallery = async () => {
  try {
    const res = await fetch(`${API_URL}/gallery`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Backend connection failed, falling back to empty state:", error);
    return []; 
  }
};

export const createGalleryItem = async (data) => {
  try {
    const res = await fetch(`${API_URL}/gallery`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

export const deleteGalleryItem = async (id) => {
  try {
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return { success: false, message: "فشل الاتصال بالخادم" };
  }
};

// --- PAGE DATA (Preserved for existing frontend components) ---
export const fetchAllProjectsPageData = async () => {
  try {
    const response = await fetch('/api/all-projects.json');
    return await response.json();
  } catch (error) {
    console.error("Failed to load local static data:", error);
    return null;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await fetch('/api/settings.json');
    return await response.json();
  } catch (error) {
    console.error("Failed to load local static settings:", error);
    return null;
  }
};
