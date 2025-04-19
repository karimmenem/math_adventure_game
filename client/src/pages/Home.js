import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Make Math Fun</span>
            <span className="title-line">with Math Adventure!</span>
          </h1>
          <p className="hero-subtitle">
            Solve puzzles, earn rewards, and master math skills in a fun
            learning journey!
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Start Your Adventure
            </Link>
            <Link to="/signin" className="btn btn-secondary">
              Already Playing? Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="math-icon math-icon-1">+</div>
          <div className="math-icon math-icon-2">-</div>
          <div className="math-icon math-icon-3">×</div>
          <div className="math-icon math-icon-4">÷</div>
          <div className="math-icon math-icon-5">=</div>
        </div>
      </section>
      
      <section className="features-section">
        <h2 className="section-title">Why Kids Love Math Adventure</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Fun Gameplay</h3>
            <p>
              Solve math problems in an engaging game format that makes learning
              enjoyable!
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Earn Achievements</h3>
            <p>
              Collect badges and unlock rewards as you improve your math skills!
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>
              See your improvement over time with detailed progress tracking!
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Level Up</h3>
            <p>
              Start with simple problems and work your way up to challenging
              math concepts!
            </p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make Math Fun?</h2>
          <p>
            Join thousands of kids who love learning math with Math Adventure!
          </p>
          <Link to="/signup" className="btn btn-primary">
            Start Playing Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
