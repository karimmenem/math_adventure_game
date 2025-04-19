import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import soundService from "../services/soundService";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState('default'); // Changed from 'avatar1' to 'default'
  const [usernameColor, setUsernameColor] = useState('#FFFFFF'); // Changed from #4CAF50 to #FFFFFF
  const [success, setSuccess] = useState(false);

  // List of available avatars
  const avatars = [
    { id: "avatar1", src: "/avatars/avatar1.png", alt: "Boy with glasses" },
    { id: "avatar2", src: "/avatars/avatar2.png", alt: "Girl with ponytail" },
    { id: "avatar3", src: "/avatars/avatar3.png", alt: "Boy with cap" },
    { id: "avatar4", src: "/avatars/avatar4.png", alt: "Girl with curly hair" },
    { id: "avatar5", src: "/avatars/avatar5.png", alt: "Robot" },
    { id: "avatar6", src: "/avatars/avatar6.png", alt: "Alien" },
  ];

  // Color options for username
  // Color options for username
  const colorOptions = [
    { name: "White", value: "#FFFFFF" }, // Added white instead of green
    { name: "Blue", value: "#2196F3" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Orange", value: "#FF9800" },
    { name: "Red", value: "#F44336" },
    { name: "Pink", value: "#E91E63" },
  ];

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        // Set initial values from server data or defaults
        setUsername(data.username || user?.username || "");
        setSelectedAvatar(data.avatar || "avatar1");
        setUsernameColor(data.usernameColor || "#4CAF50");

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Still set defaults even if there's an error
        setUsername(user?.username || "");
        setError("Failed to load profile data. Using defaults.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleAvatarSelect = (avatarId) => {
    soundService.play("click");
    setSelectedAvatar(avatarId);
  };

  const handleColorSelect = (color) => {
    soundService.play("click");
    setUsernameColor(color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundService.play("click");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          avatar: selectedAvatar,
          usernameColor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update context with new user data
      if (updateUser) {
        updateUser({
          ...user,
          username,
          avatar: selectedAvatar,
          usernameColor,
        });
      }

      // Show success message
      setSuccess(true);
      soundService.play("achievement");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  if (loading && !username) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Profile updated successfully!</div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Your Username</h2>
          <div className="username-preview" style={{ color: usernameColor }}>
            {username || "Preview Username"}
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="username-input"
            maxLength={20}
          />
        </div>

        <div className="form-section">
          <h2>Choose Your Avatar</h2>
          <div className="avatar-grid">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`avatar-option ${
                  selectedAvatar === avatar.id ? "selected" : ""
                }`}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  onError={(e) => {
                    e.target.src = "/avatars/default.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Username Color</h2>
          <div className="color-options">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={`color-option ${
                  usernameColor === color.value ? "selected" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorSelect(color.value)}
                title={color.name}
              ></div>
            ))}
          </div>
        </div>

        <button type="submit" className="save-profile-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
