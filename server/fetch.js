const axios = require('axios')
const cheerio = require('cheerio')

const FetchHTML = async(url)=>{
    try{
        const { data } = await axios.get(url)
        return cheerio.load(data)
    } catch (err) {
        console.error('Error fetching HTML:', err)
        return null
    }
}

module.exports = FetchHTML