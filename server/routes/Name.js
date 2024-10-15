const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

router.get('/:animeName/:episodeNumber', async (req, res) => {
    try {
        const { animeName, episodeNumber } = req.params

        const apiUrl = `https://animeyubi.com/api/v4/streamani/episodes/?anime=${encodeURIComponent(animeName)}&episode=${episodeNumber}`

        console.log(animeName, episodeNumber)

        const response = await axios.get(apiUrl)
        const episodeData = response.data

        const videoSRC = episodeData.iframe || 'Video source not available'
        let downloadLink = ''

        if (videoSRC.includes('streaming.php')) {
            console.log('includes')
            downloadLink = videoSRC.replace('streaming.php', 'download')
            console.log(downloadLink)
        }

        let resolution = ''
        if (downloadLink) {
            const pageResponse = await axios.get(downloadLink)
            const $ = cheerio.load(pageResponse.data)
            resolution = $('div#content-download > div:nth-child(1) > div.dowload > a').attr('href')
            console.log(resolution)
            console.log(pageResponse.status)
        }
        
        const formatSlug = (slug) => (slug ? `/${slug}` : null)

        const VideoDetails = {
            title: episodeData.current.title || 'Unknown Title',
            videoSRC,
            downloadLink: downloadLink || 'Download link not available',
            next: formatSlug(episodeData.next?.full_slug),
            prev: formatSlug(episodeData.prev?.full_slug)
        }

        console.log(VideoDetails)
        res.json(VideoDetails)

    } catch (error) {
        console.error('Error fetching anime details:', error.message || error)
        res.status(500).send('Error fetching anime details')
    }
})

module.exports = router
