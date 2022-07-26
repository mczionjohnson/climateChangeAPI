const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')



const app = express()

const newspapers = [
    {
    name: 'cityam',
    address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
    base: ''
},
{
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: ''
},
{
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
},
{
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
},
{
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: '',
},
{
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: '',
},
{
    name: 'smh',
    address: 'https://www.smh.com.au/environment/climate-change',
    base: 'https://www.smh.com.au',
},
{
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: '',
},
{
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science_and_environment',
    base: 'https://www.bbc.co.uk',
},
{
    name: 'es',
    address: 'https://www.standard.co.uk/topic/climate-change',
    base: 'https://www.standard.co.uk'
},
{
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
    base: ''
},
{
    name: 'dm',
    address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: ''
},
{
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change/',
    base: ''
}
]

const articles = []
const specificArticles = []



//  create dynamic function
// for each newpaper from the newspapers, use the address
newspapers.forEach(newspaper => {

    // visit the URL with axiom then save the res as html
    // use chaining to wait for the first response
    // pass html into cheerio and saved as $
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            // look for all a-tags that contains "climate" in html
            // for each result
            // look into this result and grab text and href
            // push into a global var(array) articles
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        }).catch((err) => console.log(err.message))
})




app.get('/', (req, res) => {
    res.status(200).json('Hello API endpoints')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId

    // for each newspaper from the filter
    // if it matches the newpaperId
    // use only the first element in the result and get the address
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    // console.log(newspaperAddress)
    await axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        // look for all a-tags that contains "climate" in html
        // for each result
        // look into this result and grab text and href
        // push into a global var(array) specificArticles
        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        
        res.json(specificArticles)
    }).catch((err) => console.log(err.message))
})
          



app.listen(process.env.PORT || 3000, () => console.log('server running'))