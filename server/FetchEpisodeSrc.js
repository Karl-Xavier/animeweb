const cheerio = require('cheerio')
const crypto = require('crypto')
const axios = require('axios')

let sources = []

const keys = {
    key: Buffer.from('37911490979715163134003223491201'),
    secondKey: Buffer.from('54674138327930866480207815084989'),
    iv: Buffer.from('3134003223491201')
}

function encryptedData(data, key, iv){
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    cipher.setAutoPadding(true)
    let encrypted = cipher.update(data, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}

function decryptedData(encryptedData, key, iv){
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    decipher.setAutoPadding(true)
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

async function generateEncryptedAjaxParams($, id){

    const encryptedKey = encryptedData(id, keys.key, keys.iv)

    const scriptValue = $("script[data-name='episode']").attr('data-value') || ''

    const decryptedToken = decryptedData(scriptValue, keys.key, keys.iv)

    return `id=${encryptedKey}&alias=${id}&${decryptedToken}`

}

async function fetchVideoSrc(videoUrl, referer){
    let encryptedParams = ''
    try {
        const response = await axios.get(videoUrl.href)
        const $ = cheerio.load(response.data)
        const videoId = videoUrl.searchParams.get('id') || ''

        encryptedParams = await generateEncryptedAjaxParams($, videoId)
        const encryptedDataResponse = await axios.get(`${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encryptedParams}`,{
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })

        console.log(`${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encryptedParams}`)

        const decryptData = decryptedData(encryptedDataResponse.data.data.toString(), keys.secondKey, keys.iv)
        console.log('Decrypted Value',JSON.parse(decryptData))
        const videoSources = JSON.parse(decryptData)

        if(videoSources.source[0].file.includes('.m3u8')){
            const results = await axios.get(videoSources.source[0].file.toString())
            const resolution = results.data.match(/(RESOLUTION=)(.*)(\s*?)(\s*.*)/g)
            /* resolution.forEach(res=>{
                const index = videoSources.source[0].file.lastIndexOf('/')
                const quality = res.split('\n')[0].split('x')[1].split(',')[0]
                const url = videoSources.source[0].file.slice(0, index)
                sources.push({
                    url: url + '/' + res.split('\n')[1],
                    isM3U8: (url + res.split('\n')[1]).includes('.m3u8'),
                    quality: quality + 'p'
                })
            }) */

            videoSources.source.forEach(source=>{
                sources.push({
                    url: source.file,
                    isM3U8: source.file.includes('.m3u8'),
                    quality: 'default'
                })
            })
        } else {
            videoSources.source.forEach(source=>{
                sources.push({
                    url: source.file,
                    isM3U8: source.file.includes('.m3u8'),
                    quality: source.label.split(' ')[0] + 'p'
                })
            })
        }

        fetchCORSRestrictedVid(videoSources.source[0], referer)

        return sources

    } catch (error) {
        console.error('Error fetching video sources:', error)
    } finally {
        console.log(`${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encryptedParams}`);
    }
}

// Not really Needed //
async function fetchCORSRestrictedVid(source, referer){
    try {
            const response = await axios.get(source.file,{
                headers:{
                    'Referer': 'https://gogoplay.io',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
                }
            })
            console.log(response.data)
            const video = response.data.split('\n')
            for(let i = 0; i < video.length; i++){
                if(video[i].startsWith('#EXT-X-STREAM-INF')){
                    const hlsUrl = video[i + 1].trim()

                   /*  sources.push({
                        hlsUrl
                    }) */
                    console.log(hlsUrl)
                }
            }
        } catch(err){
            console.error('Error fetching video:', err)
        }
}

module.exports = { fetchVideoSrc, sources }