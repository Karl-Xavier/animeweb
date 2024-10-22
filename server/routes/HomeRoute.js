const express = require('express')
const router = express.Router()
const FetchHTML = require('../fetch')
const webURL = require('../url')

async function fetchEpisodes(maxPages) {
    const allEpisodes = [];
    
    for (let page = 1; page <= maxPages; page++) {
        const url = `${webURL}?page=${page}`
        const $ = await FetchHTML(url)

        $('.last_episodes.loaddub ul li').each((index, element) => {
            const title = $(element).find('p.name a').text()
            const episodeNum = $(element).find('p.episode').text()
            const imgURL = $(element).find('div.img a img').attr('src')
            const link = $(element).find('div.img a').attr('href')

            allEpisodes.push({ title, imgURL, episodeNum, link })
        })
        console.log(`Page ${page} processed.`)
    }
    return allEpisodes
}
    
router.get('/recent', async (req, res) => {
    try {
        const maxPages = 1
        const newEpisode = await fetchEpisodes(maxPages)
        console.log(newEpisode)
        res.json(newEpisode)
    } catch (error) {
        console.error('Error processing request:', error)
        res.status(500).json({ error: 'Failed to fetch recent episodes' })
    }
})

module.exports = router