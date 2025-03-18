import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";


  useEffect(() => {
   
    const fetchCurrentUser = async () => {
      try {
          const token = localStorage.getItem("token");
          console.log("🔹 Token in localStorage:", token);  
  
          const response = await axios.get(`${API_URL}/api/v1/users/current-user`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,  
          });
  
          console.log("✅ Current user fetched:", response.data);
      } catch (err) {
          console.error("❌ Error fetching current user:", err);
      }   
  };
  
    fetchCurrentUser();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-200 py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-16">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <section className="text-center py-16 bg-gradient-to-r from-red-500 to-orange-600">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to MYCRYPT</h1>
        <p className="text-lg text-gray-100 mb-6">
          Discover, like, and save your favorite videos all in one place.
        </p>
      </section>

      <section className="py-16 bg-gray-800">
        <h2 className="text-4xl font-bold text-center text-gray-100 mb-12">
          Latest Videos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition"
            >
              <Link to={`/video/${video._id}`}>
                <video
                  src={video.videoFile} // Video URL from Cloudinary
                  poster={video.thumbnail} // Thumbnail before playing
                  className="w-full h-48 object-cover"
                  muted // Muted for autoplay
                  loop // Loop the video
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400">{video.description}</p>
                  <p className="text-gray-500">
                    Uploaded by: {video.ownerUsername || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}