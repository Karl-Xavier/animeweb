const express = require('express')
const router = express.Router()
const axios = require('axios')
const FetchHTML = require('../fetch')

router.get('/:animeName/:episodeNumber', async (req, res) => {
    try {
        const { animeName, episodeNumber } = req.params

        const apiUrl = `https://animeyubi.com/api/v4/streamani/episodes/?anime=${encodeURIComponent(animeName)}&episode=${episodeNumber}`

        console.log(animeName, episodeNumber)

        const response = await axios.get(apiUrl)
        const episodeData = response.data

        const videoSRC = episodeData.iframe || undefined
        const cover = episodeData.current.image
        let downloadLink = ''
        let directDownloadLink = []

        if (videoSRC.includes('streaming.php')) {
            downloadLink = videoSRC.replace('streaming.php', 'download')
        }

        // get direct download link

        try {
            const captcha = '03AFcWeA5zy7DBK82U_tctVKelJ6L2duTWac5at2zXjHLX8XqUm8tI6NKWMxGd2gjh1vi2hnEyRhVgbMhdb9WjexRsJkxTt-C-_iIIZ5yC3E5I19G5Q0buSTcIQIZS6tskrz-mDn-d37aWxAJtqbg0Yoo1XsdVc5Yf4sB-9iQxQK-W_9YLep_QaAz8uL17gMMlCz5WZM3dbBEEGmk_qPbJu_pZ8kk-lFPDzd6iBobcpyIDRZgTgD4bYUnby5WZc11i00mrRiRS3m-qSY0lprGaBqoyY1BbRkQZ25AGPp5al4kSwBZqpcVgLrs3bjdo8XVWAe73_XLa8HhqLWbz_m5Ebyl5F9awwL7w4qikGj-AK7v2G8pgjT22kDLIeenQ_ss4jYpmSzgnuTItur9pZVzpPkpqs4mzr6y274AmJjzppRTDH4VFtta_E02-R7Hc1rUD2kCYt9BqsD7kDjmetnvLtBm97q5XgBS8rQfeH4P-xqiTAsJwXlcrPybSjnwPEptqYCPX5St_BSj4NQfSuzZowXu_qKsP4hAaE9L2W36MvqePPlEm6LChBT3tnqUwcEYNe5k7lkAAbunxx8q_X5Q3iEdcFqt9_0GWHebRBd5abEbjbmoqqCoQeZt7AUvkXCRfBDne-bf25ypyTtwgyuvYMYXau3zGUjgPUO9WIotZwyKyrYmjsZJ7TiM'

            const baseURL = new URL(downloadLink).origin
            const params = new URL(downloadLink).searchParams
            const id = params.get('id')
            const directURL = `${baseURL}/download?id=${id}&captcha_v3=${captcha}`
            const $ = await FetchHTML(directURL)
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
        } catch (err) {
            res.status(500).json({ message: err.message })
        }

        const encodedUrl = btoa(videoSRC)

        const videoApiURL = `https://animeyubi.com/api/v4/streamani/videos/?src=${encodedUrl}`
        const responseData = await axios.get(videoApiURL)
        const vid = responseData.data[0]
        const hlsUrl = vid.file

        
        const formatSlug = (slug) => (slug ? `/${slug}` : null)

        const VideoDetails = {
            title: episodeData.current.title || 'Unknown Title',
            videoSRC,
            hlsUrl,
            downloadLink: downloadLink || 'Download link not available',
            next: formatSlug(episodeData.next?.full_slug),
            prev: formatSlug(episodeData.prev?.full_slug),
            directDownloadLink,
            cover
        }
        res.json(VideoDetails)
        console.log(VideoDetails)
    } catch (error) {
        console.error('Error fetching anime details:', error.message || error)
        res.status(500).send('Error fetching anime details')
    }
})

module.exports = router

// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36