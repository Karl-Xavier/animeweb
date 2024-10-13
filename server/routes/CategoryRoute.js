const express = require('express')
const router = express.Router()
const FetchHTML = require('../fetch')
const {webURL} = require('../url')
const axios = require('axios')
const cheerio = require('cheerio')

router.get('/category/:name', async (req, res) => {
    const name = req.params.name
    try {
        const $ = await FetchHTML(webURL + `category/${name}`)
        const details = {}

        details.imgURL = $('.anime_info_body .anime_info_body_bg img').attr('src')
        details.title = $('.anime_info_body .anime_info_body_bg h1').text().trim()
        details.description = $('.anime_info_body .anime_info_body_bg .description').text().trim()

        const names = []
        $('.anime_info_body .anime_info_body_bg p.type').each((index, element) => {
            const name = $(element).text().trim()
            names.push(name)
        })
        details.names = names

        // Extract anime ID and alias for AJAX request
        const animeId = $('#movie_id').val()
        const alias = name

        // Make AJAX request to fetch episodes
        const episodeUrl = `https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=0&ep_end=1000&id=${animeId}&default_ep=0&alias=${alias}`
        const episodeResponse = await axios.get(episodeUrl)

        // Load the response into cheerio for parsing
        const $episodes = cheerio.load(episodeResponse.data)
        const episodes = []
        
        $episodes('#episode_related li').each((i, element) => {
            const epLink = $(element).find('a').attr('href').trim()
            const epNum = $(element).find('a .name').text().trim()
            const type = $(element).find('a .cate').text().trim()

            episodes.push({ epLink, epNum, type })
        })

        console.log('Episode Extracted!!')
        details.episodes = episodes

        res.json(details)
        console.log(details)

    } catch (err) {
        console.error('Error fetching data:', err)
        res.status(500).json({ error: 'Failed to fetch data' })
    }
})

module.exports = router