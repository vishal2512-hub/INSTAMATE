import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";

const Update = ({ setOpenUpdate, user, onUpdateSuccess }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [texts, setTexts] = useState({
    email: user.email || "",
    password: user.password || "",
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // File Validation Function
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and GIF files are allowed");
    }

    return true;
  };

  // Upload Function
  const upload = async (file) => {
    try {
      if (!file) return null;
      validateFile(file);

      const formData = new FormData();
      formData.append("file", file);

      setIsUploading(true);
      setUploadProgress(0);

      const response = await makeRequest.post("/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (!response.data) {
        throw new Error("No URL returned from upload");
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle File Selection
  const handleFileChange = async (e, setFile) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file);
      setFile(file);
      setError("");
    } catch (err) {
      setError(err.message);
      e.target.value = ""; // Reset input
    }
  };

  // Mutation for Profile Update
  const mutation = useMutation({
    mutationFn: async (updatedUser) => {
      const response = await makeRequest.put("/users", updatedUser);
      return response.data;
    },
    onSuccess: () => {
      onUpdateSuccess?.();
      setOpenUpdate(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Error updating profile");
    }
  });

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setError(""); 

    try {
      if (!texts.name.trim()) {
        throw new Error("Name is required");
      }

      let coverImgUrl = user.coverPic; 
      let profileImgUrl = user.profilePic;

      // Upload new images only if selected
      if (profile) {
        profileImgUrl = await upload(profile);
        if (!profileImgUrl) throw new Error("Profile upload failed");
      }

      if (cover) {
        coverImgUrl = await upload(cover);
        if (!coverImgUrl) throw new Error("Cover upload failed");
      }

      mutation.mutate({
        ...texts,
        coverPic: coverImgUrl, 
        profilePic: profileImgUrl, 
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : user.profilePic || "/api/placeholder/400/400"}
                  alt="Profile"
                />
                <CloudUpload className="icon" />
                {isUploading && profile && (
                  <div className="uploadProgress">
                    Uploading: {uploadProgress}%
                  </div>
                )}
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setProfile)}
              accept="image/jpeg,image/png,image/gif"
            />

            <label htmlFor="profile">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : user.coverPic || "/api/placeholder/400/400"}
                  alt="Cover"
                />
                <CloudUpload className="icon" />
                {isUploading && cover && (
                  <div className="uploadProgress">
                    Uploading: {uploadProgress}%
                  </div>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, setCover)}
              accept="image/jpeg,image/png,image/gif"
            />
          </div>

          <div className="inputs">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={texts.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={texts.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={texts.city}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={texts.website}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={isUploading || mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." :
              isUploading ? `Uploading: ${uploadProgress}%` : "Update"}
          </button>
        </form>

        <button className="close" onClick={() => setOpenUpdate(false)}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Update;
