const express = require('express')
const router = express.Router()
const axios = require('axios')
const FetchHTML = require('../fetch')
const { fetchVideoSrc, sources } = require('../FetchEpisodeSrc')
const webURL= require('../url')
const { getBaseImg } = require('../proxyUrl')

router.get('/data/:animeName/:episodeNumber', async (req, res) => {

    try {
        const { animeName, episodeNumber } = req.params
        let directDownloadLink = []

        // Scrape Gogoanime video page //

        const videoPageUrl = `${webURL}${animeName}-episode-${episodeNumber}`
        console.log(videoPageUrl)
        const $ = await FetchHTML(videoPageUrl)

        const downloadLink = $('.anime_video_body .download-anime .favorites_book ul li.dowloads a').attr('href')
        const title = $('.anime_video_body h1').text().trim()
        const prev = $('.anime_video_body_episodes .anime_video_body_episodes_l a').attr('href')
        const next = $('.anime_video_body_episodes .anime_video_body_episodes_r a').attr('href')
        const anzeatUrl = $('.anime_muti_link ul li.anime a').attr('data-video') || ''
        const vidcdnUrl = $('.anime_muti_link ul li.vidcdn a').attr('data-video') || ''
        const mp4Url = $('.anime_muti_link ul li.mp4upload a').attr('data-video') || ''
        const vidhideUrl = $('.anime_muti_link ul li.vidhide a').attr('data-video') || ''

       const videoUrl = new URL(anzeatUrl)

       await fetchVideoSrc(videoUrl, anzeatUrl).then(sources=>{
        console.log('Sources: ', sources)
    })

        // get Direct Download Link //

        try{
            const captcha = '03AFcWeA5zy7DBK82U_tctVKelJ6L2duTWac5at2zXjHLX8XqUm8tI6NKWMxGd2gjh1vi2hnEyRhVgbMhdb9WjexRsJkxTt-C-_iIIZ5yC3E5I19G5Q0buSTcIQIZS6tskrz-mDn-d37aWxAJtqbg0Yoo1XsdVc5Yf4sB-9iQxQK-W_9YLep_QaAz8uL17gMMlCz5WZM3dbBEEGmk_qPbJu_pZ8kk-lFPDzd6iBobcpyIDRZgTgD4bYUnby5WZc11i00mrRiRS3m-qSY0lprGaBqoyY1BbRkQZ25AGPp5al4kSwBZqpcVgLrs3bjdo8XVWAe73_XLa8HhqLWbz_m5Ebyl5F9awwL7w4qikGj-AK7v2G8pgjT22kDLIeenQ_ss4jYpmSzgnuTItur9pZVzpPkpqs4mzr6y274AmJjzppRTDH4VFtta_E02-R7Hc1rUD2kCYt9BqsD7kDjmetnvLtBm97q5XgBS8rQfeH4P-xqiTAsJwXlcrPybSjnwPEptqYCPX5St_BSj4NQfSuzZowXu_qKsP4hAaE9L2W36MvqePPlEm6LChBT3tnqUwcEYNe5k7lkAAbunxx8q_X5Q3iEdcFqt9_0GWHebRBd5abEbjbmoqqCoQeZt7AUvkXCRfBDne-bf25ypyTtwgyuvYMYXau3zGUjgPUO9WIotZwyKyrYmjsZJ7TiM'

            const baseUrl = new URL(downloadLink).origin
            const params = new URL(downloadLink).searchParams
            const id = params.get('id')
            const directUrl = `${baseUrl}/download?id=${id}&captcha_v3=${captcha}`
            const $ = await FetchHTML(directUrl)
            $('.dowload').each((index, element)=>{
                const link = $(element).find('a')
                if (link.attr('target') != '_blank') {
                    const title = link.text()
                    const resolution = title.replace(/Download\s*\((\d+P)\s*-\s*.*\)/, '$1').trim()
                    directDownloadLink.push({ 
                        resolution, 
                        link: link.attr('href') 
                    })
                }
            })
        }catch(err){
            res.status(500).json({ message: err.message })
        }

        console.log(sources)

        function formatString(i){
            if(i.includes('(Dub)')){
                return i.replace(/\s*\(Dub\)/, '').replace(/Episode\s+\d+/, (match)=> `${match} Dub` )
            }else{
                return i.replace(/\s*English Subbed/, '').replace(/Episode\s+\d+/, (match)=> `${match} Sub` )
            }
        }

        const imgUrl = `https://gogocdn.net/cover/${animeName}.png`

        return res.status(200).json({
            title: formatString(title).replace('at gogoanime', '').trim(),
            hlsUrl: sources[sources.length - 1].url,
            vidpinUrl: sources[sources.length - 2].url.replace('anzeat.pro','vipanicdn.net'),
            videoSrc: anzeatUrl,
            mp4Upload: mp4Url,
            vidHide: vidhideUrl,
            vidCdn: vidcdnUrl,
            downloadLink,
            episode: `Episode ${episodeNumber}`,
            next,
            prev,
            directDownloadLink,
            imgUrl
        })

    } catch (error) {
        console.error('Error fetching anime details:', error.message || error)
        res.status(500).json({ message: 'Error fetching anime details' })
    }
})

module.exports = router