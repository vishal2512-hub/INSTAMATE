import React from 'react';
import './stories.scss';

const Stories = () => {
  // Temporary data
  const stories = [
    {
      id: 1,
      name: "GT",
      profilePic:
      "https://th.bing.com/th/id/OIP.yqWjrtg_4YEiAXlMayhi6wAAAA?w=335&h=175&c=7&r=0&o=5&dpr=1.4&pid=1.7"
    },
    {
      id: 2,
      name: "MI",
      profilePic:
      "https://th.bing.com/th/id/OIP.bW4c2tWhBiQep9ow_jNG5AHaHa?w=150&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"    },
    {
      id: 3,
      name: "RCB",
      profilePic:
      "https://th.bing.com/th/id/OIP.Cl_qQCmzfo_2n_zlW170ewHaEK?w=290&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"    },
    {
      id: 4,
      name: "CSK",
      profilePic:
      "https://th.bing.com/th/id/OIP.FAScT6INMoc4AyC2pzBI3AHaEK?w=326&h=183&c=7&r=0&o=5&dpr=1.4&pid=1.7"
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img
          src="https://th.bing.com/th/id/OIP.7ITF2gx8_a3s4NbnDOpZzAHaHa?w=205&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
          alt="Current User"
        />
        <span>Vishal</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id} >
          <img src={story.profilePic} alt={story.name} />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
