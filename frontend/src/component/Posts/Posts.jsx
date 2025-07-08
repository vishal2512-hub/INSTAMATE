import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import { makeRequest } from "../../axios";
import "./posts.scss";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId], // Add userId to queryKey to refetch when it changes
    queryFn: () =>
      makeRequest.get("/posts" + (userId ? `?userId=${userId}` : "")).then((res) => {
        return res.data;
      }),
  });

  if (isLoading) return "Loading...";
  if (error) return "Error loading posts: " + error.message;
  if (!data || data.length === 0) return "No posts found";

  return (
    <div className="posts">
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;