require('dotenv').config()
const express = require('express')
const cors = require('cors')
const FetchHTML = require('./fetch')
const webURL = require('./url')
const connectDB = require('./db')

const allowedOrigins = ['https://s3taku.com', 'https://gogoplay.io', 'https://s3embtaku.pro', 'http://localhost:5173', 'https://myanimetv.vercel.app']

const corsOption = {
    origin: function(origin, callback){
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not Allowed by CORS'))
        }
    }
}

const app = express()
const PORT = process.env.PORT || 5003
app.use(cors(corsOption))
app.use(express.json({limit: '1gb'}))
connectDB()

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} - ${req.url}`);
    next();
})

const auth = require('./routes/AuthRoute')
const homeRoute = require('./routes/HomeRoute')
const genreRoute = require('./routes/GenreRoute')
const cateRoute = require('./routes/CategoryRoute')
const nameRoute = require('./routes/Name')
const newsRoute = require('./routes/News')
const movieRoute = require('./routes/Movies')
const popular = require('./routes/Popular')
const proxy = require('./routes/Proxym3u8')
const user = require('./routes/UserInfo')
const bookmark = require('./routes/BookMarkRoute')
const comment = require('./routes/CommentRoute')
const reply = require('./routes/Replyroute')

app.get('/',(req,res)=>{
    res.send('SERVER IS WORKING')
}) 
app.use('/api/auth', auth)
app.use('/api', homeRoute)
app.use('/api', genreRoute)
app.use('/api', cateRoute)
app.use('/api', nameRoute)
app.use('/api', newsRoute)
app.use('/api', movieRoute)
app.use('/api', popular)
app.use('/api', proxy)
app.use('/api', user)
app.use('/api', bookmark)
app.use('/api', comment)
app.use('/api', reply)
        
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