import React from "react";

const AboutMe = () => {
  return (
    <div className="about-me-container">
      {/* Decorative math symbols */}
      <div className="math-decoration">∑</div>
      <div className="math-decoration">π</div>
      <div className="math-decoration">÷</div>
      <div className="math-decoration">√</div>

      <div className="about-header">
        <h1>About Me</h1>
        <div className="about-subtitle">Creator of Math Adventure</div>
      </div>

      <div className="about-content">
        <div className="about-photo-container">
          {/* Replace with your own photo */}
          <img 
            src="/images/developer-photo.jpg" 
            alt="Developer Portrait" 
            className="about-photo"
            onError={(e) => {
              e.target.src = '/avatars/avatar1.png'; // Fallback image
            }}
          />
          <div className="photo-frame"></div>
        </div>

        <div className="about-text-container">
          <section className="about-section">
            <h2>Who I Am</h2>
            <p>
              {/* FILL IN: Write a brief introduction about yourself */}
              I'm [YOUR NAME], a passionate [YOUR PROFESSION/ROLE] with a love for education and technology. 
              With [X YEARS] of experience in [YOUR FIELD], I've dedicated my career to making learning 
              more engaging and accessible for everyone.
            </p>
          </section>

          <section className="about-section">
            <h2>My Journey</h2>
            <p>
              {/* FILL IN: Share your educational/professional journey */}
              My adventure began at [YOUR UNIVERSITY/SCHOOL], where I earned a degree in [YOUR DEGREE]. 
              After graduation, I [KEY MILESTONE IN YOUR CAREER]. Throughout my journey, I've 
              [IMPORTANT ACHIEVEMENTS OR EXPERIENCES].
            </p>
          </section>

          <section className="about-section">
            <h2>Math Adventure Story</h2>
            <p>
              {/* FILL IN: Tell the story of why you created Math Adventure */}
              I created Math Adventure because I believe learning mathematics should be fun and engaging. 
              The inspiration came from [YOUR INSPIRATION], and I wanted to build a platform that 
              [YOUR VISION OR GOAL]. This project combines my passion for [RELEVANT PASSIONS] with 
              my expertise in [RELEVANT SKILLS].
            </p>
          </section>

          <section className="about-section">
            <h2>Beyond Coding</h2>
            <p>
              {/* FILL IN: Share personal interests/hobbies */}
              When I'm not working on Math Adventure, you can find me [YOUR HOBBIES/INTERESTS]. 
              I'm also passionate about [OTHER PASSIONS] and enjoy [ACTIVITIES YOU ENJOY].
            </p>
          </section>

          <section className="about-section">
            <h2>Connect With Me</h2>
            <div className="social-links">
              {/* FILL IN: Add your social media links */}
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="mailto:your.email@example.com" className="social-link">
                <i className="fas fa-envelope"></i> Email
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;