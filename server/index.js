const express = require('express')
const cors = require('cors')
const FetchHTML = require('./fetch')
const webURL = require('./url')

const app = express()
const PORT = process.env.PORT || 5003
app.use(cors())
app.use(express.json({limit: '1gb'}))

const homeRoute = require('./routes/HomeRoute')
const genreRoute = require('./routes/GenreRoute')
const cateRoute = require('./routes/CategoryRoute')
const nameRoute = require('./routes/Name')
const newsRoute = require('./routes/News')
const movieRoute = require('./routes/Movies')
const popular = require('./routes/Popular')

app.get('/',(req,res)=>{
    res.send('SERVER IS WORKING')
})

app.use('/api', homeRoute)
app.use('/api', genreRoute)
app.use('/api', cateRoute)
app.use('/api', nameRoute)
app.use('/api', newsRoute)
app.use('/api', movieRoute)
app.use('/api', popular)
        
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

app.listen(PORT, ()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})
