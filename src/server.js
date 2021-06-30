// Sets ffmpeg and ffprobe path 

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

//Screenshot instance (using node-server-screenshot api)
const Screenshot = require("node-server-screenshot");

//Videoshow instance (using videoshow api)

const Videoshow = require("videoshow");
const fs = require('fs');

//Using the express framework for the server 

const express = require('express');
const app = express();

app.use(express.json());



//Creates video object and video name for the videoshow 

const video = {
  fps: 50,
  loop: 10, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

const videoName = 'video.mp4';

//Function that uses videoshow to create the mp4 file

const videoConverter = (img,video,callbak)=>  
        Videoshow(img, video)
         .save(videoName)
         .on('start', function (command) {
             console.log('ffmpeg process started:', command)
          })
         .on('error', function (err, stdout, stderr) {
           console.error('Error:', err)
           console.error('ffmpeg stderr:', stderr)
          })
         .on('end', function (output) {
           console.error('Video created in:', output)
           callbak();
          });


//The server uses post method as its only method

app.post('*',(req,res)=>{
  console.log(req.body.url);
  const url = req.body.url;
  const img = ['test.png'];
  Screenshot.fromURL(url,img[0],()=>{
        videoConverter(img,video,
          ()=>{ 
            //After the creation of the video, deletes the unnecessay image
            fs.unlink(img[0],(err)=>{
              if (err) console.log(err);
            })
            res.json({file: __dirname+'\\'+videoName})
          });
  });
})

app.listen(3000);


//------------------------------------------------------------------------------------

//Checks that the server gets the client request and its response 

//  const axios = require('axios');
//   axios.post('http://localhost:3000/',{
//   url:'https://www.google.co.il/?hl=iw'
// })
// .then((res)=> {
  
//   const file_name = res.data.file;
//     if(fs.existsSync(file_name)){
//       console.log("the file exist");
//     }
//     else{
//       console.log("the file doesn't exist");
//     };
//   })
// .catch((err)=> console.log(err));



