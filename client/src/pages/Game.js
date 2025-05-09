import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import soundService from "../services/soundService";
import animationUtils from "../utils/animationUtils";
import config from "../config"; // Import the config file

const Game = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameMode = searchParams.get("mode") || "normal";
  const problemTypes = searchParams.get("problemTypes")
    ? searchParams.get("problemTypes").split(",")
    : [];

  // State variables
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievementNotification, setShowAchievementNotification] =
    useState(false);
  const [levelInfo, setLevelInfo] = useState(null);
  const [session, setSession] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(gameMode === "practice");

  // Timer-related states
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [problemStartTime, setProblemStartTime] = useState(null);
  const [blitzScore, setBlitzScore] = useState(0);
  const timerRef = useRef(null);

  // Add refs for animation targets
  const problemCardRef = useRef(null);
  const scoreValueRef = useRef(null);

  // Add a ref to track if game is initialized to prevent multiple calls
  const gameInitializedRef = useRef(false);

  // Initialize game based on mode
  useEffect(() => {
    let initialTime = null;

    if (gameMode === "timed") {
      initialTime = 30; // 30 seconds per problem
    } else if (gameMode === "blitz") {
      initialTime = 60; // 60 seconds for the entire game
    }

    setTimeLeft(initialTime);
    setTotalTime(initialTime);
  }, [gameMode]);

  // Start game session when component mounts
  useEffect(() => {
    // Prevent multiple initializations
    if (gameInitializedRef.current) return;

    const startGame = async () => {
      try {
        // Set flag to prevent multiple initializations
        gameInitializedRef.current = true;
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        // Start a new game session
        const sessionResponse = await fetch(
          `${config.API_URL}/api/game/start`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mode: gameMode }),
          }
        );

        if (!sessionResponse.ok) {
          const errorData = await sessionResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to start game session");
        }

        const sessionData = await sessionResponse.json();
        console.log("Game session started:", sessionData.session);
        setSession(sessionData.session);

        // Get problems for this game (based on mode)
        let problemsUrl = "";

        if (gameMode === "practice") {
          // Use empty string for no problem types instead of trying to join an empty array
          const typesParam =
            problemTypes.length > 0 ? problemTypes.join(",") : "";
            problemsUrl = `${config.API_URL}/api/game/practice${
            typesParam ? `?problemTypes=${typesParam}` : ""
          }`;
          setIsPracticeMode(true);
        } else {
          // Add levelId to the URL parameters if available
          const levelId = searchParams.get("levelId");
          problemsUrl = `${config.API_URL}/api/game/problems?mode=${gameMode}${
            levelId ? `&levelId=${levelId}` : ""
          }`;
        }

        console.log("Fetching problems from:", problemsUrl);

        const problemsResponse = await fetch(problemsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!problemsResponse.ok) {
          const errorData = await problemsResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch problems");
        }

        const problemsData = await problemsResponse.json();
        console.log("Problems loaded:", problemsData.problems.length);

        if (!problemsData.problems || problemsData.problems.length === 0) {
          throw new Error("No problems received from server");
        }

        setProblems(problemsData.problems);

        if (problemsData.levelInfo) {
          setLevelInfo(problemsData.levelInfo);
        }

        setLoading(false);

        // Play game start sound
        soundService.play("game-start");

        // Set problem start time for timed mode
        if (gameMode === "timed" || gameMode === "blitz") {
          setProblemStartTime(Date.now());
          startTimer();
        }
      } catch (error) {
        console.error("Game initialization error:", error);
        setError(`Failed to start the game: ${error.message}`);
        setLoading(false);
        gameInitializedRef.current = false; // Reset flag on error to allow retry
      }
    };

    startGame();

    // Cleanup function to clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameMode, problemTypes, searchParams]); // Added searchParams to dependencies

  // Timer function
  // Timer function
  const startTimer = () => {
    console.log("Starting timer...");

    // Clear any existing timer first
    if (timerRef.current) {
      console.log("Clearing existing timer");
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime <= 1 ? 0 : prevTime - 1;

        if (newTime === 0) {
          // Time's up
          console.log("Timer reached zero");
          clearInterval(timerRef.current);
          timerRef.current = null;

          if (gameMode === "timed") {
            // In timed mode, time up on current problem means incorrect
            handleTimeUp();
          } else if (gameMode === "blitz") {
            // In blitz mode, time up means game over
            endBlitzGame();
          }
        }

        return newTime;
      });
    }, 1000);
  };

  // New function for ending blitz game specifically
  const endBlitzGame = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Play the game end sound immediately when Blitz mode ends
      soundService.play("game-end");

      const token = localStorage.getItem("token");

      // For blitz mode, we'll always include the blitzScore
      const response = await fetch(`${config.API_URL}/api/game/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session?.session_id, // Use optional chaining in case session is null
          mode: "blitz",
          blitzScore: blitzScore,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Blitz end game error:", errorData);
        // Even with error, we still show game over
        setGameOver(true);
        setSummary({
          problems_attempted: blitzScore,
          problems_correct: blitzScore,
          points_earned: blitzScore * 10,
          duration_seconds: 60,
          isHighScore: false,
        });
        return;
      }

      const data = await response.json();
      setSummary(data.summary);
      setGameOver(true);

      // Show celebration if it's a high score
      if (data.summary.isHighScore) {
        animationUtils.createCelebration();
        animationUtils.showCharacterReaction("achievement");
      }

      // Check for new achievements
      checkAchievements();
    } catch (error) {
      console.error("Blitz end game error:", error);
      // Even with error, show game over with the score
      setGameOver(true);
      setSummary({
        problems_attempted: blitzScore,
        problems_correct: blitzScore,
        points_earned: blitzScore * 10,
        duration_seconds: 60,
        isHighScore: false,
      });

      // Display error but don't block the game over screen
      setError(
        "There was an issue saving your score, but your game has ended."
      );
    }
  };

  // Handle time up for timed mode
  // Handle time up for timed mode
  // Handle time up for timed mode
  const handleTimeUp = () => {
    if (gameMode === "timed") {
      // Stop the current timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const currentProblem = problems[currentProblemIndex];
      soundService.play("incorrect");

      // Store the next problem index in a variable to ensure consistency
      const nextProblemIndex = currentProblemIndex + 1;

      // Check if currentProblem exists before accessing its properties
      if (!currentProblem) {
        console.error("No current problem found when timer ran out");

        // Just move to the next problem or end the game
        if (nextProblemIndex < problems.length) {
          // Move to next problem
          setCurrentProblemIndex(nextProblemIndex);
          setTimeLeft(totalTime); // Reset timer
          setProblemStartTime(Date.now());
          startTimer();
        } else {
          // End game directly
          handleTimedGameEnd();
        }
        return;
      }

      // Set result with the actual correct answer
      setResult({
        correct: false,
        pointsEarned: 0,
        correctAnswer: currentProblem.correct_answer || "Unknown",
      });

      // Save the current problem index so we can reference it in the timeout
      const currentIndex = currentProblemIndex;

      // Move to next problem after a brief delay
      setTimeout(() => {
        // Clear the result and selected answer
        setResult(null);
        setSelectedAnswer("");

        // Check if there are more problems
        if (nextProblemIndex < problems.length) {
          console.log(
            `Moving from problem ${currentIndex} to problem ${nextProblemIndex}`
          );

          // Force a specific next index rather than using a function
          setCurrentProblemIndex(nextProblemIndex);

          // Reset timer for the next problem
          setTimeLeft(totalTime);
          setProblemStartTime(Date.now());

          // Start the timer after a small delay to ensure state updates have completed
          setTimeout(() => {
            startTimer();
          }, 50);
        } else {
          // If this was the last problem, end the game
          handleTimedGameEnd();
        }
      }, 1500); // Reduced delay to 1.5 seconds to keep the game moving
    }
  };

  // Add a specific function to handle timed mode game ending
  const handleTimedGameEnd = () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Play game end sound
      soundService.play("game-end");

      // Set game over state with summary data
      const summary = {
        problems_attempted: problems.length,
        problems_correct: problems.filter(
          (_, index) => index < currentProblemIndex
        ).length,
        points_earned: 0, // This would be calculated based on correct answers
        duration_seconds:
          (Date.now() - (session?.started_at || Date.now())) / 1000,
      };

      setSummary(summary);
      setGameOver(true);

      // Try to end the game session in the background, but don't block UI
      const token = localStorage.getItem("token");
      if (token && session?.session_id) {
        fetch(`${config.API_URL}/api/game/end`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session.session_id,
            mode: gameMode,
          }),
        }).catch((error) => {
          console.error("Background end game error:", error);
        });
      }

      // Check for new achievements
      checkAchievements();
    } catch (error) {
      console.error("Timed game end error:", error);
      // Set game over even on error
      setGameOver(true);
    }
  };

  const handleAnswerSelect = (answer) => {
    soundService.play("click");
    setSelectedAnswer(answer);
  };

  // New function to render problem based on type
  const renderProblemContent = (problem) => {
    if (!problem) return null;

    // Special rendering for fractions
    if (problem.category === "Fractions") {
      return (
        <div className="special-problem-content fraction-problem">
          <p className="problem-question">{problem.question}</p>
          <div className="fraction-visual">
            {problem.problem_type === "addition" && (
              <div className="fraction-operation">
                <div className="fraction-visual-container">
                  <div
                    className="fraction-representation"
                    style={{ width: "100px", height: "100px" }}
                  >
                    {/* Visual representation could be added here */}
                  </div>
                  <div className="fraction-symbol">+</div>
                  <div
                    className="fraction-representation"
                    style={{ width: "100px", height: "100px" }}
                  >
                    {/* Visual representation could be added here */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Special rendering for geometry
    if (problem.category === "Geometry") {
      return (
        <div className="special-problem-content geometry-problem">
          <p className="problem-question">{problem.question}</p>
          <div className="geometry-visual">
            {problem.problem_type === "perimeter" && (
              <div className="geometry-shape perimeter">
                {/* SVG shape could be added here */}
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect
                    x="25"
                    y="25"
                    width="100"
                    height="100"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    fill="none"
                  />
                  <text
                    x="75"
                    y="75"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#333"
                  >
                    {problem.question.includes("square")
                      ? `${problem.question.match(/\d+/)?.[0] || "5"} cm`
                      : ""}
                  </text>
                </svg>
              </div>
            )}
            {problem.problem_type === "area" &&
              problem.question.includes("rectangle") && (
                <div className="geometry-shape area">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <rect
                      x="25"
                      y="50"
                      width="100"
                      height="50"
                      stroke="#2196F3"
                      strokeWidth="3"
                      fill="none"
                    />
                    <text
                      x="75"
                      y="75"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#333"
                    >
                      {`${
                        problem.question.match(/length (\d+)/)?.[1] || "6"
                      } × ${problem.question.match(/width (\d+)/)?.[1] || "4"}`}
                    </text>
                  </svg>
                </div>
              )}
          </div>
        </div>
      );
    }

    // Default rendering for other problems
    return <p className="problem-question">{problem.question}</p>;
  };

  // Updated handleSubmitAnswer function with animations and error handling
  const handleSubmitAnswer = async () => {
    try {
      if (!selectedAnswer) return;

      // Check if session exists before continuing
      if (!session || !session.session_id) {
        console.error("No valid session found");
        setError("Game session not found. Please restart the game.");
        return;
      }

      const token = localStorage.getItem("token");
      const currentProblem = problems[currentProblemIndex];

      // Check if we have a valid problem
      if (!currentProblem || !currentProblem.problem_id) {
        console.error("No valid problem found");
        setError("Problem data is missing. Please restart the game.");
        return;
      }

      // Calculate time taken for this problem (for timed modes)
      let timeTaken = 0;
      if (gameMode === "timed" || gameMode === "blitz") {
        timeTaken = (Date.now() - problemStartTime) / 1000;
      }

      console.log("Submitting answer with session:", session);
      console.log("Current problem:", currentProblem);

      const response = await fetch(`${config.API_URL}/api/game/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          problemId: currentProblem.problem_id,
          answer: selectedAnswer,
          timeTaken: timeTaken,
          mode: gameMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      const data = await response.json();
      setResult(data);

      // For blitz mode, update score with animation
      if (gameMode === "blitz" && data.correct) {
        const newScore = blitzScore + 1;
        setBlitzScore(newScore);

        if (scoreValueRef.current) {
          animationUtils.animateCounter(
            scoreValueRef.current,
            blitzScore,
            newScore,
            500
          );
        }
      }

      // Play appropriate sound based on whether answer is correct
      if (data.correct) {
        soundService.play("correct");
        // Show correct animations - safely handle potentially undefined correct_answer
        const answer =
          currentProblem.correct_answer || data.correctAnswer || "";
        animationUtils.createNumberParticles(
          problemCardRef.current,
          answer,
          true
        );
        animationUtils.showCharacterReaction("correct");
      } else {
        soundService.play("incorrect");
        // Show incorrect animations - safely handle potentially undefined correct_answer
        const answer = data.correctAnswer || "";
        animationUtils.createNumberParticles(
          problemCardRef.current,
          answer,
          false
        );
        animationUtils.showCharacterReaction("incorrect");
      }

      // Show level up animation if user leveled up
      if (data.leveledUp) {
        setLevelUpAnimation(true);
        soundService.play("level-up");
        animationUtils.createCelebration();
        animationUtils.showCharacterReaction("levelUp");
        setTimeout(() => {
          setLevelUpAnimation(false);
        }, 3000);
      }

      // Show result for 2 seconds then move to next problem
      setTimeout(
        () => {
          setResult(null);
          setSelectedAnswer("");

          if (
            currentProblemIndex < problems.length - 1 &&
            (gameMode !== "blitz" || timeLeft > 0)
          ) {
            setCurrentProblemIndex((prevIndex) => prevIndex + 1);

            // Reset timer for timed mode
            if (gameMode === "timed") {
              setTimeLeft(totalTime);
              setProblemStartTime(Date.now());
              startTimer();
            }
          } else if (gameMode === "blitz" && timeLeft > 0) {
            // In blitz mode, get a new problem as long as there's time left
            setCurrentProblemIndex((prevIndex) => prevIndex + 1);

            // If we've used all problems, cycle back to the beginning
            if (currentProblemIndex >= problems.length - 1) {
              setCurrentProblemIndex(0);
            }
          } else {
            endGame();
          }
        },
        data.leveledUp ? 4000 : 2000
      ); // Wait longer if level up animation is showing
    } catch (error) {
      console.error("Submit answer error:", error);
      setError("Failed to submit your answer. Please try again.");
    }
  };

  // Update checkAchievements to show celebration for new achievements
  const checkAchievements = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${config.API_URL}/api/achievements/check`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check achievements");
      }

      const data = await response.json();

      // Show achievement notification if user earned a new achievement
      if (data.hasNewAchievements) {
        setNewAchievements(data.newAchievements);
        setShowAchievementNotification(true);
        soundService.play("achievement");
        animationUtils.createCelebration();
        animationUtils.showCharacterReaction("achievement");

        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowAchievementNotification(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Achievement check error:", error);
    }
  };

  // Update the endGame function
  const endGame = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Special handling for blitz mode
      if (gameMode === "blitz") {
        return endBlitzGame();
      }

      // Special handling for timed mode
      if (gameMode === "timed") {
        return handleTimedGameEnd();
      }

      // Check if session exists before continuing
      if (!session || !session.session_id) {
        console.error("No valid session found");
        // Handle this case by showing game over without trying to call the API
        setGameOver(true);
        setSummary({
          problems_attempted: currentProblemIndex + 1,
          problems_correct: 0,
          points_earned: 0,
          duration_seconds: 0,
        });
        soundService.play("game-end");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${config.API_URL}/api/game/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          mode: gameMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to end game session");
      }

      const data = await response.json();
      setSummary(data.summary);
      setGameOver(true);
      soundService.play("game-end");

      // Show celebration if the player did well
      if (
        data.summary.problems_correct / data.summary.problems_attempted >=
        0.7
      ) {
        animationUtils.createCelebration();
      }

      // Check for new achievements
      checkAchievements();
    } catch (error) {
      console.error("End game error:", error);
      // Even on error, set game over
      setGameOver(true);
      // Create a basic summary
      setSummary({
        problems_attempted: currentProblemIndex + 1,
        problems_correct: 0, // We don't know this value if the API call failed
        points_earned: 0,
        duration_seconds: 0,
      });
      soundService.play("game-end");
    }
  };

  const returnToDashboard = () => {
    soundService.play("click");
    navigate("/dashboard");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return <div className="loading">Loading game...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={returnToDashboard}>Return to Dashboard</button>
      </div>
    );
  }

  // Updated render section to include refs
  if (gameOver && summary) {
    return (
      <div className="game-over-container">
        <h2>Game Complete!</h2>

        {gameMode === "blitz" ? (
          <div className="blitz-summary">
            <div className="blitz-score">{blitzScore}</div>
            <p className="blitz-label">Problems Solved in 60 Seconds</p>

            {summary.isHighScore && (
              <div className="high-score-badge">New High Score!</div>
            )}
          </div>
        ) : (
          <div className="game-summary">
            <p>Problems Attempted: {summary.problems_attempted}</p>
            <p>Correct Answers: {summary.problems_correct}</p>
            <p>Points Earned: {summary.points_earned}</p>
            <p>
              Time Taken: {Math.floor(summary.duration_seconds / 60)}m{" "}
              {Math.floor(summary.duration_seconds % 60)}s
            </p>
          </div>
        )}

        <div className="game-over-buttons">
          <button
            onClick={() => navigate("/game-mode")}
            className="play-again-btn"
          >
            Play Again
          </button>
          <button onClick={returnToDashboard} className="return-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get the current problem
  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="game-container">
      {showAchievementNotification && (
        <div className="achievement-notification">
          <h3>Achievement Unlocked!</h3>
          {newAchievements.map((achievement) => (
            <div key={achievement.achievement_id} className="new-achievement">
              <p>{achievement.name}</p>
              <p className="achievement-desc">{achievement.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="game-header">
        <div className="game-header-top">
          <h2>
            Math Adventure
            {gameMode === "timed" && <span className="mode-badge">Timed</span>}
            {gameMode === "blitz" && (
              <span className="mode-badge blitz">Blitz</span>
            )}
            {gameMode === "practice" && (
              <span className="mode-badge practice">Practice</span>
            )}
          </h2>

          {(gameMode === "timed" || gameMode === "blitz") && (
            <div className={`timer ${timeLeft <= 5 ? "timer-warning" : ""}`}>
              {gameMode === "blitz" && (
                <div className="blitz-counter">
                  Score: <span ref={scoreValueRef}>{blitzScore}</span>
                </div>
              )}
              <div className="timer-display">{formatTime(timeLeft)}</div>
              {gameMode === "timed" && (
                <div className="timer-bar">
                  <div
                    className="timer-progress"
                    style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {gameMode === "normal" && levelInfo && (
          <div className="level-info">
            <span className="level-name">{levelInfo.level_name}</span>
            <p className="level-description">{levelInfo.description}</p>
          </div>
        )}

        {gameMode === "practice" && problemTypes.length > 0 && (
          <div className="practice-info">
            <span className="practice-focus">
              Practice Focus:{" "}
              {problemTypes
                .map((type) => type.charAt(0).toUpperCase() + type.slice(1))
                .join(", ")}
            </span>
          </div>
        )}

        <div className="progress-indicator">
          {gameMode !== "blitz"
            ? `Problem ${currentProblemIndex + 1} of ${problems.length}`
            : `Time remaining: ${formatTime(timeLeft)}`}
        </div>
      </div>

      {levelUpAnimation && (
        <div className="level-up-animation">
          <h2>Level Up!</h2>
          <p>Congratulations! You've reached {result?.newLevel?.name}!</p>
        </div>
      )}

      {currentProblem && (
        <div className="problem-card" ref={problemCardRef}>
          <div className="problem-header">
            <h3 className="problem-category">
              {currentProblem.category}
              {currentProblem.problem_type && (
                <span className="problem-type">
                  {currentProblem.problem_type}
                </span>
              )}
            </h3>
            <div className="problem-points">{currentProblem.points} pts</div>
          </div>

          <div className="problem-content">
            {renderProblemContent(currentProblem)}
          </div>

          <div className="options-container">
            {currentProblem.options && Array.isArray(currentProblem.options) ? (
              currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    selectedAnswer === option ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="error-message">
                No options available for this problem
              </div>
            )}
          </div>

          {result && (
            <div
              className={`result-feedback ${
                result.correct ? "correct" : "incorrect"
              }`}
            >
              {result.correct
                ? `Correct! +${result.pointsEarned} points`
                : `Incorrect. The correct answer is ${result.correctAnswer}`}
            </div>
          )}

          <button
            className="submit-btn"
            disabled={!selectedAnswer || result !== null}
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
