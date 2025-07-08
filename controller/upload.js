import React, { useState } from 'react';
import { makeRequest } from '../../axios';

const FileUpload = ({ onUploadSuccess, onUploadError, fieldName }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set file type for preview rendering
    setFileType(file.type);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await makeRequest.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        // Pass file type along with the response data
        onUploadSuccess({
          ...response.data,
          fileType: file.type
        });
      } else {
        throw new Error('Upload failed - no filename received');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
      onUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-input">
        <label className="file-upload-label">{fieldName}</label>
        
        <div className="file-upload-preview">
          {preview && (
            <div className="file-upload-preview-media">
              {fileType?.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="file-upload-preview-img"
                />
              ) : fileType?.startsWith('video/') ? (
                <video
                  src={preview}
                  controls
                  className="file-upload-preview-video"
                />
              ) : null}
            </div>
          )}

          <div className="file-upload-box">
            <div className="file-upload-box-inner">
              <div className="file-upload-button">
                <label className="file-upload-button-label">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="file-upload-input-hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                  />
                </label>
              </div>
              <p className="file-upload-instructions">PNG, JPG, GIF, MP4, WebM up to 10MB</p>
            </div>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="file-upload-status">
          Uploading...
        </div>
      )}
      
      {error && (
        <div className="file-upload-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;