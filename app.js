const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

let localStream;
let remoteStream;
let peerConnection;

// Function to start the call
async function startCall() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = stream;
    localStream = stream;
    createPeerConnection();
    addLocalTracks(peerConnection);
  } catch (error) {
    console.error('Error accessing camera and microphone:', error);
  }
}

// Function to end the call
function endCall() {
  localStream.getTracks().forEach(track => track.stop());
  if (peerConnection) {
    peerConnection.close();
  }
}

// Function to create the peer connection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.stunprotocol.org' },
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  });

  // Event handlers for peer connection
  peerConnection.ontrack = handleRemoteStream;
  peerConnection.onicecandidate = handleICECandidate;
}

// Function to add local tracks to the peer connection
function addLocalTracks(pc) {
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
}

// Function to handle remote stream
function handleRemoteStream(event) {
  remoteVideo.srcObject = event.streams[0];
  remoteStream = event.streams[0];
}

// Function to handle ICE candidates
async function handleICECandidate(event) {
  try {
    if (event.candidate) {
      const response = await fetch('/send-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event.candidate),
      });
      // handle the response if needed
    }
  } catch (error) {
    console.error('Error sending ICE candidate:', error);
  }
}

// Event listeners for buttons
startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
