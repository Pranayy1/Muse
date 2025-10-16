// Debug YouTube Player API
console.log('YouTube API Debug Script Started');

// Check if YouTube API is loaded
console.log('window.YT:', window.YT);
console.log('window.YT.Player:', window.YT ? window.YT.Player : 'YT not loaded');

// Test a simple video ID
const testVideoId = 'dQw4w9WgXcQ'; // Rick Roll for testing

if (window.YT && window.YT.Player) {
  console.log('YouTube API is loaded, testing player...');
  
  // Create a test container
  const testDiv = document.createElement('div');
  testDiv.id = 'test-player';
  testDiv.style.width = '1px';
  testDiv.style.height = '1px';
  testDiv.style.position = 'absolute';
  testDiv.style.top = '-9999px';
  document.body.appendChild(testDiv);
  
  try {
    const testPlayer = new window.YT.Player('test-player', {
      height: '1',
      width: '1',
      videoId: testVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
        onReady: (event) => {
          console.log('Test player ready!');
          console.log('Player state:', event.target.getPlayerState());
          console.log('Video duration:', event.target.getDuration());
          
          // Test play
          event.target.playVideo();
          setTimeout(() => {
            console.log('After play - Player state:', event.target.getPlayerState());
            event.target.pauseVideo();
            document.body.removeChild(testDiv);
          }, 2000);
        },
        onStateChange: (event) => {
          console.log('Player state changed:', event.data);
          const states = {
            '-1': 'unstarted',
            '0': 'ended',
            '1': 'playing',
            '2': 'paused',
            '3': 'buffering',
            '5': 'cued'
          };
          console.log('State name:', states[event.data]);
        },
        onError: (event) => {
          console.error('YouTube Player Error:', event.data);
          const errors = {
            '2': 'Invalid video ID',
            '5': 'HTML5 player error',
            '100': 'Video not found',
            '101': 'Video not allowed in embedded players',
            '150': 'Video not allowed in embedded players'
          };
          console.error('Error description:', errors[event.data]);
        }
      }
    });
  } catch (error) {
    console.error('Failed to create test player:', error);
  }
} else {
  console.log('YouTube API not loaded yet, waiting...');
  window.onYouTubeIframeAPIReady = () => {
    console.log('YouTube API loaded via callback');
    // Re-run the test
    setTimeout(() => {
      eval(document.currentScript.textContent);
    }, 100);
  };
}