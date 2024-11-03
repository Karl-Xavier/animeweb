const express = require('express')
const router = express.Router()
const FetchHTML = require('../fetch')
const webURL = require('../url')

async function fetchAllMovies(maxPages){
    const allMovies = []
    for(let page = 1; page <= maxPages; page++){
        const url = `${webURL}/anime-movies.html?page=${page}`
        const $ = await FetchHTML(url)

        $('.last_episodes ul.items li').each((index, element)=>{
            const imgURL = $(element).find('div.img a img').attr('src')
            const title = $(element).find('p.name a').text().trim()
            const released = $(element).find('p.released').text().trim()
            const link = $(element).find('div.img a').attr('href')

            allMovies.push({ title, imgURL, released, link })
        })
        console.log(`page ${page} processed`)
    }
    return allMovies
}

router.get('/movies', async(req,res)=>{
    try {
        const max = 10
        const newMovies = await fetchAllMovies(max)
        console.log(newMovies)
        res.json(newMovies)
    } catch (error) {
        console.log('An error occurred', error)
        res.status(400).json({ message: error.message })
    }
})

module.exports = router