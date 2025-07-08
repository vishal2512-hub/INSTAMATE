import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Share = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [desc, setDesc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return {
        url: res.data,
        type: fileType
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();

    if (desc.trim() === "" && !file) {
      setErrorMessage("Please add some text or media to your post.");
      return;
    }

    let mediaData = { url: "", type: "" };
    
    if (file) {
      try {
        mediaData = await upload();
      } catch (err) {
        setErrorMessage("Failed to upload media. Please try again.");
        return;
      }
    }
    
    mutation.mutate({ 
      desc, 
      img: fileType?.startsWith('image/') ? mediaData.url : "",
      video: fileType?.startsWith('video/') ? mediaData.url : "" 
    });
    
    setDesc("");
    setFile(null);
    setFileType(null);
    setErrorMessage("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            {currentUser.profilePic ? (
              <img src={`/upload/${currentUser.profilePic}`} alt="Profile" />
            ) : (
              <AccountCircleOutlinedIcon style={{ fontSize: 40, color: "gray" }} />
            )}
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && fileType?.startsWith('image/') && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
            {file && fileType?.startsWith('video/') && (
              <video className="file" controls src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="Add Media" />
                <span>Add Media</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="Add Place" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="Tag Friends" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Share;
