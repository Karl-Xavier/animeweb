const express = require('express')
const axios = require('axios')
const router = express.Router()

let baseUrl = ''

const setBaseUrl = (url) => {
  baseUrl = url
}
const getBaseUrl = () => baseUrl

router.get('/proxy', async (req, res) => {
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ message: 'URL parameter is missing' })
  }

  try {
    if (url.endsWith('.m3u8')) {
      const response = await axios.get(url, {
        headers: { 'Origin': 'http://localhost:5173' },
      })

      // Extract and set the base URL from the .m3u8 URL
      setBaseUrl(url.substring(0, url.lastIndexOf('/')))
      console.log('Base URL set to:', getBaseUrl())

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
      res.setHeader('Allow-Control_Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Access-Control-Allow-Methods', '*')
      res.send(response.data)
    } else {
      return res.status(400).json({ message: 'Unsupported file type' })
    }
  } catch (err) {
    console.error('Error fetching .m3u8 file:', err.message)
    res.status(500).json({ message: 'Error fetching .m3u8 file', error: err.message })
  }
})

// Proxy for .ts file
router.get('/:filename', async (req, res) => {
  const { filename } = req.params
  const baseUrl = getBaseUrl()

  if (!baseUrl) {
    return res.status(400).json({ message: 'Base URL not set, cannot fetch .ts file' })
  }

  const tsUrl = `${baseUrl}/${filename}`
  console.log('Requesting .ts file from URL:', tsUrl)

  try {
    const tsResponse = await axios.get(tsUrl, {
      headers: { 'Origin': 'http://localhost:5173' },
      responseType: 'arraybuffer',
    })

    res.setHeader('Content-Type', 'video/mp2t')
    res.setHeader('Allow-Control_Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.send(tsResponse.data)
  } catch (err) {
    console.error('Error fetching .ts file:', err.message)
    res.status(500).json({ message: 'Error fetching .ts file', error: err.message })
  }
}) 

module.exports = router
