import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const CreatePost = () => {
  const { user } = useContext(UserContext); // Get user info from context
  const userId = user?.id;

  // Post state
  const [postContent, setPostContent] = useState(''); // Text content state
  const [image, setImage] = useState(null); // Image upload state
  const [video, setVideo] = useState(null); // Video upload state
  const [base64String, setBase64String] = useState(''); // Base64 for file upload

  // Handle file input (image or video)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Handle case where no file is selected

    const fileSize = file.size;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxSize) {
      toast.error('File size exceeds 10MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      setBase64String(base64); // Save base64 string
    };

    if (file.type.includes('image')) {
      reader.readAsDataURL(file);
      setImage(file);
      setVideo(null); // Clear video if an image is selected
    } else if (file.type.includes('video')) {
      reader.readAsDataURL(file);
      setVideo(file);
      setImage(null); // Clear image if a video is selected
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', postContent);
    formData.append('media', base64String);

    axios.post('/createuserposting', formData)
      .then((response) => {
        setPostContent(''); // Reset form fields
        setImage(null);
        setVideo(null);
        setBase64String('');
        toast.success('Post created successfully');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error creating post');
      });
  };

  return (


      <form className="post-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="postContent" className="form-label">Post Content</label>
          <textarea
            className="form-control"
            id="postContent"
            rows="3"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="postImage" className="form-label">Upload Image / Video</label>
          <input
            className="form-control"
            type="file"
            id="postImage"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview Image */}
        {image && (
          <div className="displayImg">
            <img src={URL.createObjectURL(image)} alt="Uploaded Preview" style={{ maxWidth: 'auto', height: '100px' }} />
          </div>
        )}

        {/* Preview Video */}
        {video && (
          <div className="displayImg">
            <video controls style={{ maxWidth: 'auto', height: '100px' }}>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <button type="submit" className="btn btn-primary">Post</button>
      </form>

  );
};

export default CreatePost;
