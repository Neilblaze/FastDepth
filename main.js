//GUI
const w = 250, h = 250;
const video = document.getElementById("video");
[video.width, video.height] = [w, h];

//WebRTC
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
// window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

let backlog;
    let vidStream = null;
    let cam = "environment" // "environment" or "user"
    const successCallback = (_vidStream) => {
        vidStream = _vidStream;
        video.srcObject = _vidStream;
        video.play();
    }