const express = require('express')
const router = express.Router()
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

let apiKey = '1c2604a8d09e42c8a6d5ccd8eb6277fe' || undefined
let title = ''
let description = ''
let img = ''
let newLink = ''
let mainDescription= ''

router.get('/feeds', async(req,res)=>{
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=anime&from=2024-10-01&sortBy=publishedAt&language=en&apikey=${apiKey}`)

        const articles = response.data.articles.map((article, index) => ({
            id: index,
            documentId: uuidv4(),
            title: article.title,
            description: article.description,
            img: article.urlToImage,
            newLink: article.url,
            mainDescription: article.content,
        }));

        //res.status(404).json({ message: 'Response Not Found' })
        res.status(200).json({articles})
        console.log(response.data)
    } catch(err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
})

module.exports = router