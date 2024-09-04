// First define the modules needed //
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5003
app.use(cors())
app.use(express.json({limit: '1gb'}))

// Function to fetch HTML from a URL
    async function FetchHTML(url){
        try{
            const { data } = await axios.get(url)
            return cheerio.load(data)
        } catch (err) {
            console.error('Error fetching HTML:', err)
            return null
        }
    }

// define the URL //

let webURL = 'https://gogoanime3.co/'

app.get('/',(req,res)=>{
    res.send('SERVER IS WORKING')
})

async function fetchEpisodes(maxPages) {
    const allEpisodes = [];
    
    for (let page = 1; page <= maxPages; page++) {
        const url = `${webURL}?page=${page}`
        const $ = await FetchHTML(url)

        $('.last_episodes.loaddub ul li').each((index, element) => {
            const title = $(element).find('p.name a').text()
            const episodeNum = $(element).find('p.episode').text()
            const imgURL = $(element).find('div.img a img').attr('src')

            allEpisodes.push({ title, imgURL, episodeNum, })
        })
        console.log(`Page ${page} processed.`)
    }
    return allEpisodes
}
    
    app.get('/recent', async (req, res) => {
        try {
            const maxPages = 6
            const newEpisode = await fetchEpisodes(maxPages)
            console.log(newEpisode)
            res.json(newEpisode)
        } catch (error) {
            console.error('Error processing request:', error)
            res.status(500).json({ error: 'Failed to fetch recent episodes' })
        }
    })

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

    app.get('/genre/:name', async (req, res) => {
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
    

    // to scrape data gotten from an anime e.g (all episode links) //
    app.get('/category/:name', async (req, res) => {
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

    // get data from the episode selected like the video src //

    app.get('/:name', async(req,res)=>{
        try {
            const animeName = req.params.name
            const Videodetails = {}
            const $ = await FetchHTML(webURL+animeName)

            Videodetails.title = $('h1').text().trim()
            Videodetails.videoSRC = $('#load_anime div.anime_video_body_watch_items.load div.play-video iframe').attr('src')
            Videodetails.next = $('.anime_video_body_episodes_r a').attr('href')
            Videodetails.prev = $('.anime_video_body_episodes_l a').attr('href')
            console.log(Videodetails)
            res.json(Videodetails)
        } catch (error) {
            console.log(error)
        }
    })

    // get data when searched for an item
    app.get('/search/:name', async(req,res)=>{
        const animeName = req.params.name
        console.log(animeName)
        const animeList = []
        const searchURL = webURL+`search.html?keyword=${encodeURIComponent(animeName)}`
        console.log(searchURL)

        const $ = await FetchHTML(searchURL)
        $('.last_episodes ul li').each((index, element)=>{
            const link = $(element).find('div.img a').attr('href')
            const imgURL = $(element).find('div.img a img').attr('src')
            const title = $(element).find('p.name').text()
            const released = $(element).find('p.released').text()

            if (link && imgURL && title && released) {
                animeList.push({
                    link: link.trim(),
                    imgURL: imgURL.trim(),
                    title,
                    released
                });
            }
        })
        console.log(animeList)
        res.json(animeList)
    })

    // get data from the popular page //

    // async function fetchPopular(maxPage){
    //     const popularEpisode = []

    //     // for(let page = 1; page <= maxPage; page++){
    //     //     const popularURL = webURL+'popular.html'
    //     //     const $ = await FetchHTML(popularURL)
    //     //     $('.last_episodes ul li').each((i,e)=>{
    //     //         const title = $(e).find('p.name').text().trim()
    //     //         const imgURL = $(e).find('.img a img').attr('src')
    //     //         const released = $(e).find('.released').text().trim()

    //     //         popularEpisode.push({
    //     //             title,
    //     //             imgURL,
    //     //             released
    //     //         })
    //     //     })
    //     // }
    //     // return popularEpisode
    // }

    app.get('/popular', async (req,res)=>{
        const popularEpisode = []
        try {
            const url = webURL+'popular.html'
            const $ = await FetchHTML(url)

            $('.last_episodes ul li').each((i,e)=>{
                const title = $(e).find('p.name a').text()
                const imgURL = $(e).find('div.img a img').attr('src')
                const link = $(e).find('div.img a').attr('href')
                const released = $(e).find('p.released').text().trim()

                popularEpisode.push({ title, imgURL, link, released })
            })
            res.json(popularEpisode)
            console.log(popularEpisode)
        } catch (error) {
            console.error('Error processing request:', error)
            res.status(500).json({ error: 'Failed to fetch recent episodes' })
        }
    })

    // get data from the movies page //
    // get data from the new-season page

app.listen(PORT, ()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})
