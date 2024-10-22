const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/:animeName/:episodeNumber', async (req, res) => {
    try {
        const { animeName, episodeNumber } = req.params

        const apiUrl = `https://animeyubi.com/api/v4/streamani/episodes/?anime=${encodeURIComponent(animeName)}&episode=${episodeNumber}`

        console.log(animeName, episodeNumber)

        const response = await axios.get(apiUrl)
        const episodeData = response.data

        const videoSRC = episodeData.iframe || undefined
        let downloadLink = ''

        if (videoSRC.includes('streaming.php')) {
            downloadLink = videoSRC.replace('streaming.php', 'download')
        }
        
        const formatSlug = (slug) => (slug ? `/${slug}` : null)

        const VideoDetails = {
            title: episodeData.current.title || 'Unknown Title',
            videoSRC,
            downloadLink: downloadLink || 'Download link not available',
            next: formatSlug(episodeData.next?.full_slug),
            prev: formatSlug(episodeData.prev?.full_slug)
        }
        res.json(VideoDetails)

    } catch (error) {
        console.error('Error fetching anime details:', error.message || error)
        res.status(500).send('Error fetching anime details')
    }
})

module.exports = router