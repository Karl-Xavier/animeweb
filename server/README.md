## NOTICE !!!!

For those who will come across this github repository, you can follow the steps that i have listed throught the comments. But please try to make yours as unique as possible. Also try to Limit the amount of Data you take when Scrapping through the websites. You can choose to use either 9anime or gogoanime links also make sure you read their header response on the chrome web developer tools.

## THANK YOU!!

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

// Function to download video
async function downloadVideo(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  const writer = fs.createWriteStream(outputPath);
  
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Function to convert video to MP4
function convertToMP4(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

// Main function to handle the download and conversion
async function main() {
  const videoUrl = 'https://s3taku.com/abpl1245?id=MTIzODcx&title=Maou-sama%2C+Retry%21+Episode+1&typesub=SUB';
  const tempFilePath = path.join(__dirname, 'temp_video.file'); // Change the extension as needed
  const outputFilePath = path.join(__dirname, 'output_video.mp4');

  try {
    // Step 1: Download the video
    await downloadVideo(videoUrl, tempFilePath);
    console.log('Video downloaded successfully.');

    // Step 2: Convert the video to MP4
    await convertToMP4(tempFilePath, outputFilePath);
    console.log('Video converted to MP4 successfully.');

    // Optional: Remove the temporary file
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
