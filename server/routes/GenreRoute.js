const express = require('express')
const router = express.Router()
const FetchHTML = require('../fetch')
const {webURL} = require('../url')
const axios = require('axios')

async function fetchGenre(genre, maxPages) {
    const genreAnime = [];

    for (let page = 1; page <= maxPages; page++) {
        const url = `${webURL}genre/${genre}?page=${page}`
        const $ = await FetchHTML(url)

        $('.last_episodes ul li').each((index, element) => {
            const title = $(element).find('p.name a').text()
            const imgURL = $(element).find('div.img a img').attr('src')
            const link = $(element).find('div.img a').attr('href')
            const released = $(element).find('p.released').text().trim()

            genreAnime.push({ title, imgURL, link, released })
        })

        console.log(`Page ${page} processed.`)
    }
    return genreAnime
}

router.get('/genre/:name', async (req, res) => {
    const genre = req.params.name
    const maxPages = parseInt(req.query.maxPages) || 20

    console.log(`Fetching genre: ${genre} with maxPages: ${maxPages}`)

    try {
        const genreAnime = await fetchGenre(genre, maxPages)
        console.log(genreAnime)
        res.json(genreAnime)
    } catch (error) {
        console.error('Error fetching genre data:', error)
        res.status(500).json({ error: 'Failed to fetch genre data' })
    }
})

module.exports = router