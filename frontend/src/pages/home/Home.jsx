// Home.jsx
import React from "react";
import "./home.scss";
import Stories from "../../component/stories/Stories";
import Share from "../../component/share/Share";
import Posts from "../../component/Posts/Posts";

const Home = () => {
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;