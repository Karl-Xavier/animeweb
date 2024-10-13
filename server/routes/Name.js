const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:animeName/:episodeNumber', async (req, res) => {
    try {
        const { animeName, episodeNumber } = req.params;

        // Construct the API URL for the episode details
        const apiUrl = `https://animeyubi.com/api/v4/streamani/episodes/?anime=${encodeURIComponent(animeName)}&episode=${episodeNumber}`;

        console.log(animeName, episodeNumber);

        // Fetch data from the API
        const response = await axios.get(apiUrl);
        const episodeData = response.data;

        // Process the video source link to generate download link
        const videoSRC = episodeData.iframe || 'Video source not available';
        let downloadLink = '';

        if (videoSRC.includes('streaming.php')) {
            console.log('includes')
            downloadLink = videoSRC.replace('streaming.php', 'download');
            console.log(downloadLink)
        }

        // Scrape from download link
        /* let resolution = ''
        if (downloadLink) {
            const pageResponse = await axios.get(downloadLink);
            const $ = cheerio.load(pageResponse.data);
            resolution = $('#content-download > div:nth-child(1) > .dowload > a').attr('href')
            console.log(resolution)
            console.log(pageResponse.status)
        } */
        
        const formatSlug = (slug) => (slug ? `/${slug}` : null)

        // Collect all video details
        const VideoDetails = {
            title: episodeData.current.title || 'Unknown Title',
            videoSRC,
            downloadLink: downloadLink || 'Download link not available',
            next: formatSlug(episodeData.next?.full_slug),
            prev: formatSlug(episodeData.prev?.full_slug)
        };

        console.log(VideoDetails); // Log for debugging
        res.json(VideoDetails); // Send the details back as a JSON response

    } catch (error) {
        console.error('Error fetching anime details:', error.message || error); // Log error message
        res.status(500).send('Error fetching anime details');
    }
});

module.exports = router;
