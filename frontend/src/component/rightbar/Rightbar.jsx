import { useState } from "react";
import "./rightbar.scss";


const RightBar = () => {
  const [following, setFollowing] = useState({});

  const handleFollow = (userId) => {
    setFollowing(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <span>JAILER</span>
            </div>
            <div className="buttons">
              <button onClick={() => handleFollow('user1')}>
                {following['user1'] ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
        <div className="item">          
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.kG-DnyXBOrU1ErB1OdeWsgHaJ4?w=186&h=248&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Rajinikanth"
              />
              <div className="online" />
              <span>Prabhas</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.1vZSlybxHWbGwaC-T50F5QHaJQ?w=132&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Vijay Deverakonda"
              />
              <div className="online" />
              <span>Vijay Deverakonda</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.YqP9ZFFjqQqZ0G1GENhIjwHaKj?w=186&h=265&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Nayanthara"
              />
              <div className="online" />
              <span>Nayanthara</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.LYEdWYApFAEBD02zZnXVkgHaKd?w=115&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Alia Bhatt"
              />
              <div className="online" />
              <span>Alia Bhatt</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.Va0mrHRhI1yK6mOlNR-VcAHaFj?w=243&h=182&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Shah Rukh Khan"
              />
              <div className="online" />
              <span>Shah Rukh Khan</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.848hxg3lJsik8nE3awuyyAHaEK?w=285&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Salman Khan"
              />
              <div className="online" />
              <span>Salman Khan</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.vUpJYB1fQ6NkVts9GVTb6wHaJQ?w=186&h=233&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Katrina Kaif"
              />
              <div className="online" />
              <span>Katrina Kaif</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.xfSIs8Fap3NGpdcFVzgMdAHaFj?w=237&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Anushka Sharma"
              />
              <div className="online" />
              <span>Anushka Sharma</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.PrYV-BjvvvWvUnHjXsqacwHaJu?w=186&h=244&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Kareena Kapoor"
              />
              <div className="online" />
              <span>Kareena Kapoor</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://th.bing.com/th/id/OIP.WzdokV5mR3nO_5Ip14pSrgHaO0?w=115&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7"
                alt="Prabhas"
              />
              <div className="online" />
              <span>RajniKanth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
