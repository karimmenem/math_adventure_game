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
         
          <img 
            src="/images/karim.jpg" 
            alt="Developer Portrait" 
            className="about-photo"
            onError={(e) => {
              e.target.src = '/avatars/avatar1.png'; 
            }}
          />
          <div className="photo-frame"></div>
        </div>

        <div className="about-text-container">
          <section className="about-section">
            <h2>Who I Am</h2>
            <p>
              {/* FILL IN: Write a brief introduction about yourself */}
              I'm Karim Menem, a passionate web developer with a love for education and technology. 
              With 3 years of experience in Computer Science, I've dedicated my career to making learning 
              more engaging and accessible for everyone.
            </p>
          </section>

          <section className="about-section">
            <h2>My Journey</h2>
            <p>
              
              My adventure began at the Lebanese American University, where I earned a degree in Computer Science. 
              After graduation, I am looking to start a career in making kid education fun. Throughout my journey, I've 
              learned many things, and met several individuals who share the love I have for web development.
            </p>
          </section>

          <section className="about-section">
            <h2>Math Adventure Story</h2>
            <p>
              {/* FILL IN: Tell the story of why you created Math Adventure */}
              I created Math Adventure because I believe learning mathematics should be fun and engaging. 
              The inspiration came from W3S School, and I wanted to build a platform that 
              makes learning fun for kids. This project combines my passion for fun learning with 
              my expertise in web development.
            </p>
          </section>

          <section className="about-section">
            <h2>Beyond Coding</h2>
            <p>
              {/* FILL IN: Share personal interests/hobbies */}
              When I'm not working on Math Adventure, you can find me on X tweeting about football. 
              I'm also passionate about trying new foods and enjoy visiting as many new restaurants as I can.
            </p>
          </section>

          <section className="about-section">
            <h2>Connect With Me</h2>
            <div className="social-links">
              {/* FILL IN: Add your social media links */}
              <a href="https://github.com/karimmenem" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://www.linkedin.com/in/karim-menem-b49630290/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href="https://x.com/karimmenem_" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i> X/Twitter
              </a>
              <a href="karimmenem2@gmail.com" className="social-link">
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