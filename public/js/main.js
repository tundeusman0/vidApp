var myVideo = document.getElementById("video");
// var MediaStream = window.MediaStream;

let button = document.querySelector("#buttonn");
let btnStart = document.querySelector("#btnStart");
let btnStop = document.querySelector("#btnStop");
let btnSave = document.querySelector("#btnSave");
let videoBttns = document.querySelector('.vid-btn');
let titleContainer = document.querySelector('.title_container2');
let preview = document.querySelector('.preview');
let preview2 = document.querySelector('.preview2');
let video = document.querySelector('video');
let vidSave = document.querySelector("#vid2");
let toggle = document.querySelector('.toggle');
let shows = document.querySelector('.shows');
let show = document.querySelector('.show');
let showz = document.querySelectorAll(".showz")
let showing = document.querySelectorAll("#showing")

for (let ind = 0; ind < showz.length; ind++) {
    showz[ind].addEventListener('click', () => {
        if (showing[ind].style.display === "none") {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "flex";
        } else if (showing[ind].style.display === "flex") {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "none";
        } else {
            showing.forEach(show => show.style.display = "none");
            showing[ind].style.display = "flex";
        }
    });
}

toggle.addEventListener("click",()=>{
    if(shows.style.display === "flex"){
        shows.style.display = "none"
        showing.forEach(show => show.style.display = "none");
    }else{
        shows.style.display = "flex"
        

    }
})

let audio2 = {
    autoGainControl: false,
    channelCount: 2,
    deviceI: "default",
    echoCancellation: false,
    latency: 0.01,
    noiseSuppression: false,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1
}
let audio = {
    sampleSize: 16,
    channelCount: 2,
    echoCancellation: false
}
let videoS = {
    aspectRatio: 1.3333333333333333,
    frameRate: 30,
    height: 240,
    resizeMode: "none",
    width: 320,
    facingMode: {
        ideal: "environment"
    }
}

let constraintObj = {
    // audio: {
    //     channelCount: {
    //         ideal: 2,
    //         min: 1
    //     },
    //     sampleSize: 16,  channelCount: 2,  echoCancellation: false,
    //     // autoGainControl: true,
    //     // echoCancellation: true,
    //     // sampleRate: 48000,
    //     // channelCount: 1,
    //     // volume: 1.0
    // },
    audio: audio2,
    video: videoS
    // video: {
    //     width: {
    //         exact: 280
    //     },
    //     height: {
    //         exact: 200
    //     },
        // facingMode: {
        //     ideal: "environment"
        // }

    // }
};
console.log(constraintObj)

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function (constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
} else {
    
    button.addEventListener("click", () => {
        if (videoBttns.style.display === "none" || titleContainer.style.display === "none" ){
            titleContainer.style.display = "block";
            videoBttns.style.display = "flex";
            video.style.display = "block";
            btnStart.style.display = "block";
            btnSave.style.display = "none";
            button.value = "Close the Recording Tabs and re-apply";
            navigator.mediaDevices.getUserMedia(constraintObj)
                .then(function (mediaStreamObj) {
                    //connect the media stream to the first video element
                    if ("srcObject" in video) {
                        video.srcObject = mediaStreamObj;
                    } else {
                        //old version
                        video.src = window.URL.createObjectURL(mediaStreamObj);
                        console.log("video src",video.src)
                    }

                    video.onloadedmetadata = function (ev) {
                        //show in the video element what is being captured by the webcam
                        video.play();
                    };

                    //add listeners for saving video/audio
                    let mediaRecorder = new MediaRecorder(mediaStreamObj);
                    let chunks = [];

                    btnStart.addEventListener('click', (ev) => {

                        mediaRecorder.start(1000);
                        preview2.innerHTML = ""
                        setTimeout(()=>{
                            mediaRecorder.stop();
                            vidSave.style.display = "block";
                            video.style.display = "none";
                            btnStart.style.display = "none";
                            btnSave.style.display = "block";
                            preview.style.display = "block";
                            mediaStreamObj.getTracks().forEach(track => track.stop());
                            let timeLapse = document.createTextNode("Video Record limit reached");
                            // console.log(mediaRecorder.state);
                            preview.appendChild(timeLapse);
                        },121000);
                        // console.log(mediaRecorder.state);
                        // video.style.display = "block";
                    })
                    button.addEventListener('click', (ev) => {
                        // mediaRecorder.stop();
                        mediaStreamObj.getTracks().forEach(track => track.stop())
                    })
                    btnStop.addEventListener('click', (ev) => {
                        // console.log(mediaRecorder.state);
                        if (mediaRecorder.state !== "recording" && mediaRecorder.state === "inactive"){
                            console.log(mediaRecorder.state);
                            // let doubleClick = document.createTextNode("No video to stop the recordings");
                            // preview2.appendChild(doubleClick);
                            preview2.innerHTML = "<p>No video to stop the recordings </p>"
                            // preview2.insertAdjacentHTML(p,"<br>")
                        }else{
                            mediaRecorder.stop();
                            vidSave.style.display = "block"
                            video.style.display = "none"
                            btnStart.style.display = "none"
                            btnSave.style.display = "block"
                            preview.style.display = "block"
                            mediaStreamObj.getTracks().forEach(track => track.stop())
                        }
                    });
                    mediaRecorder.ondataavailable = function (ev) {
                        chunks.push(ev.data);
                        // console.log("ev.data",ev.data)
                    }
                    
                    mediaRecorder.onstop = (ev) => {
                        let blob = new Blob(chunks, { 'type': 'video/mp4;' });
                        chunks = [];
                        let videoURL = window.URL.createObjectURL(blob);
                        vidSave.src = videoURL;
                        // console.log("videoURL",videoURL);
                        // console.log("vidSave.src",vidSave.src);

                        btnSave.addEventListener("click", () => {
                            xhr('./upload-video', vidSave.src, function (fName) {
                                console.log("Video succesfully uploaded !");
                            });

                            // Helper function to send 
                            function xhr(url, data, callback) {
                                var request = new XMLHttpRequest();
                                request.onreadystatechange = function () {
                                    if (request.readyState == 4 && request.status == 200) {
                                        callback(location.href + request.responseText);
                                    }
                                };
                                request.open('POST', url);
                                request.send(data);
                            }
                        })
                        
                    }
                })
                .catch(function (err) {
                    console.log(err.name, err.message);
                });
        }else{
            videoBttns.style.display = "none";
            titleContainer.style.display = "none";
            button.value = "Apply";
            video.style.display = "none";
            vidSave.style.display = "none";
            vidSave.muted = true
            // btnStop.style.display = "none"
            preview.style.display = "none"
            preview2.innerHTML = ""
            
        }
        
    })
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                console.log(device.kind.toUpperCase(), device.label);
                //, device.deviceId
            })
        })
        .catch(err => {
            console.log(err.name, err.message);
        })
}