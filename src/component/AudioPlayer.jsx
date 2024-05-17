import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, autoPlay = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Track current playback time

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setCurrentTime(audioRef.current.currentTime); // Remember current time
    } else {
      // Resume playback from the stored time
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const startOver = () => {
    audioRef.current.currentTime = 0; // Reset playback position to start
    audioRef.current.play(); // Start playback from the beginning
    setIsPlaying(true); // Update state to reflect playing
  };

  // Function to handle end of audio playback
  const handleEnded = () => {
    setIsPlaying(false); // Update state to not playing
  };

  useEffect(() => {
    // Handle autoplay with user interaction check and muted playback fallback
    if (autoPlay && document.visibilityState === 'visible') {
      const mutedPromise = audioRef.current.play();
      // Handle potential errors during autoplay with muted fallback
      if (mutedPromise !== undefined) {
        mutedPromise.then(() => {
          // Autoplay succeeded, set isPlaying to true
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay failed, fallback to muted playback
          audioRef.current.muted = true;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          });
        });
      } else {
        // Modern browsers might not return a promise
        audioRef.current.muted = true;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        });
      }
    }

    // Update visibility state for future autoplay checks
    const visibilityChangeHandler = () => {
      if (document.visibilityState === 'visible') { // Handle potential future autoplay
        handleUserInteraction(); // Reset state on user interaction
      }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);

    return () => document.removeEventListener('visibilitychange', visibilityChangeHandler);
  }, [autoPlay]); // Re-run effect on changes to autoPlay prop

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} onEnded={handleEnded} />
      <button className="player-button" onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button className="start-over-button" onClick={startOver}>Start Over</button>
    </div>
  );
};

export default AudioPlayer;
