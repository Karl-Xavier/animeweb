## NOTICE !!!!

For those who will come across this github repository, you can follow the steps that i have listed throught the comments. But please try to make yours as unique as possible. Also try to Limit the amount of Data you take when Scrapping through the websites. You can choose to use either 9anime or gogoanime links also make sure you read their header response on the chrome web developer tools.

## THANK YOU!!

https://animeyubi.com/api/v4/streamani/episodes/?anime=${encodeURIComponent(animeName)}&episode=${episodeNumber}

const response = await axios.get(apiUrl)
        const episodeData = response.data

        const videoSRC = episodeData.iframe || undefined
        const cover = episodeData.current.image
        let downloadLink = ''
        let directDownloadLink = []

        if (videoSRC.includes('streaming.php')) {
            downloadLink = videoSRC.replace('streaming.php', 'download')
        }

        // get direct download link

        try {
            const captcha = '03AFcWeA5zy7DBK82U_tctVKelJ6L2duTWac5at2zXjHLX8XqUm8tI6NKWMxGd2gjh1vi2hnEyRhVgbMhdb9WjexRsJkxTt-C-_iIIZ5yC3E5I19G5Q0buSTcIQIZS6tskrz-mDn-d37aWxAJtqbg0Yoo1XsdVc5Yf4sB-9iQxQK-W_9YLep_QaAz8uL17gMMlCz5WZM3dbBEEGmk_qPbJu_pZ8kk-lFPDzd6iBobcpyIDRZgTgD4bYUnby5WZc11i00mrRiRS3m-qSY0lprGaBqoyY1BbRkQZ25AGPp5al4kSwBZqpcVgLrs3bjdo8XVWAe73_XLa8HhqLWbz_m5Ebyl5F9awwL7w4qikGj-AK7v2G8pgjT22kDLIeenQ_ss4jYpmSzgnuTItur9pZVzpPkpqs4mzr6y274AmJjzppRTDH4VFtta_E02-R7Hc1rUD2kCYt9BqsD7kDjmetnvLtBm97q5XgBS8rQfeH4P-xqiTAsJwXlcrPybSjnwPEptqYCPX5St_BSj4NQfSuzZowXu_qKsP4hAaE9L2W36MvqePPlEm6LChBT3tnqUwcEYNe5k7lkAAbunxx8q_X5Q3iEdcFqt9_0GWHebRBd5abEbjbmoqqCoQeZt7AUvkXCRfBDne-bf25ypyTtwgyuvYMYXau3zGUjgPUO9WIotZwyKyrYmjsZJ7TiM'

            const baseURL = new URL(downloadLink).origin
            const params = new URL(downloadLink).searchParams
            const id = params.get('id')
            const directURL = `${baseURL}/download?id=${id}&captcha_v3=${captcha}`
            const $ = await FetchHTML(directURL)
            $('.dowload').each((index, element)=>{
                const link = $(element).find('a')
                if (link.attr('target') != '_blank') {
                    const title = link.text()
                    const resolution = title.replace(/Download\s*\((\d+P)\s*-\s*.*\)/, '$1').trim()
                    directDownloadLink.push({ 
                        resolution, 
                        link: link.attr('href') 
                    })
                }
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }

        const encodedUrl = btoa(videoSRC)

        const videoApiURL = `https://animeyubi.com/api/v4/streamani/videos/?src=${encodedUrl}`
        const responseData = await axios.get(videoApiURL)
        const vid = responseData.data[0]
        const hlsUrl = vid.file

        
        const formatSlug = (slug) => (slug ? `/${slug}` : null)

        const VideoDetails = {
            title: episodeData.current.title || 'Unknown Title',
            videoSRC,
            hlsUrl,
            downloadLink: downloadLink || 'Download link not available',
            next: formatSlug(episodeData.next?.full_slug),
            prev: formatSlug(episodeData.prev?.full_slug),
            directDownloadLink,
            cover
        }
        res.json(VideoDetails)
        console.log(VideoDetails)

        const response = await axios.get(hls, {
                responseType: 'text', // Get the response as plain text
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
                }
            });
            
            // Split the response data by lines to parse each line individually
            const lines = response.data.split('\n');
            const streams = [];
            
            // Iterate over each line to find stream information and URLs
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('#EXT-X-STREAM-INF')) {
                    // Parse bandwidth, resolution, and name
                    const bandwidth = lines[i].match(/BANDWIDTH=(\d+)/)?.[1];
                    const resolution = lines[i].match(/RESOLUTION=(\d+x\d+)/)?.[1];
                    const name = lines[i].match(/NAME="(.*?)"/)?.[1];
                    
                    // The next line after #EXT-X-STREAM-INF is the URL for the stream
                    const url = lines[i + 1].trim();
                    
                    if (url) {
                        streams.push({
                            url,
                            bandwidth,
                            resolution,
                            name
                        });
                    }
                }
            }
            
             // This will give an array of objects with stream details
            hlsUrl = streams





            const express = require('express');
const axios = require('axios');
const router = express.Router();

// This will store the base URL for streaming (if needed)
let baseUrl = '';

// Helper functions to set and get the base URL
const setBaseUrl = (url) => {
  baseUrl = url;
};
const getBaseUrl = () => baseUrl;

// Proxy for .m3u8 file
router.get('/m3u8/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'URL parameter is missing' });
  }

  try {
    if (url.endsWith('.m3u8')) {
      const response = await axios.get(url, {
        headers: { 'Origin': 'http://localhost:5173' },
      });

      // Extract and set the base URL from the .m3u8 URL
      setBaseUrl(url.substring(0, url.lastIndexOf('/')));
      console.log('Base URL set to:', getBaseUrl());

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(response.data);
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (err) {
    console.error('Error fetching .m3u8 file:', err.message);
    res.status(500).json({ message: 'Error fetching .m3u8 file', error: err.message });
  }
});

// Proxy for .ts file
router.get('/api/:filename', async (req, res) => {
  const { filename } = req.params;  // Extract filename from URL
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return res.status(400).json({ message: 'Base URL not set, cannot fetch .ts file' });
  }

  const tsUrl = `${baseUrl}/${filename}`;  // Construct the full .ts file URL
  console.log('Requesting .ts file from URL:', tsUrl);

  try {
    const tsResponse = await axios.get(tsUrl, {
      headers: { 'Origin': 'http://localhost:5173' },
      responseType: 'arraybuffer',  // Ensure we handle binary data correctly
    });

    res.setHeader('Content-Type', 'video/mp2t');
    res.send(tsResponse.data);  // Send the .ts file content
  } catch (err) {
    console.error('Error fetching .ts file:', err.message);
    res.status(500).json({ message: 'Error fetching .ts file', error: err.message });
  }
});

module.exports = router;
