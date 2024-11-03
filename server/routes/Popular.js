const express = require('express')
const router = express.Router()
const FetchHTML = require('../fetch')
const webURL = require('../url')

router.get('/popular', async(req,res)=>{
    const allPopular = []

    try {
        const url = 'https://ajax.gogocdn.net/ajax/page-recent-release-ongoing.html' 
        console.log(url)
        const $ = await FetchHTML(url)

        $('div.added_series_body.popular ul li').each((index, element)=>{

            allPopular.push({ 
                title: $(element).find('a:nth-child(2)').text().trim().split(',')[0].trim(),
                imgURL: $(element).find('a:nth-child(1) div').attr('style').match('(https?://.*.(?:png|jpg))')[0],
                link: $(element).find('a:nth-child(1)').attr('href'),
                latest: $(element).find('p:nth-of-type(2) a').text().trim()
             })
        })
        res.json(allPopular)
    } catch(err){
        console.log(err)
        res.status(500).json({ message: 'Server Error Occurred' })
    }

})

module.exports = router