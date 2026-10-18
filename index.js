// Import Express
const express = require('express')
app = express()

// Add CORS
const cors = require('cors')

var url = require('url')

// Server run on port 3000
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/static'))
app.use(cors({origin: '*'}))

// Ping API to wake up server
app.get('/ping', (req, res) => {
    console.log('Calling /ping')
    res.type('text/plain')
    res.send('ping responce')
})

/*
BMI API to calculate patient's BMI

Input Parameters:
feet : patient's height (feet)
inchest : patient's height (inches)
pounds : patient's weight (pounds)

Returns one of 4 categories:
normal
overweight
obese
uncategorized
*/
app.get('/bmi/:feet/:inches/:pounds', (req, res) => {

    // Get input to API as parameters
    const feet = req.params.feet;
    const inches = req.params.inches
    const pounds = req.params.pounds

    // Print API call confirmation with parameters
    console.log(`Calling /bmi, feet: ${feet}, inches: ${inches}, pounds: ${pounds}`)

    // Convert feet + inches to meters
    let meters = feet * 0.3048 + inches * 0.0254

    // Convert pounds to kilograms
    let kg = pounds * 0.45359237

    // Calculate BMI
    let bmi = kg / meters ** 2

    // Print BMI calculation confirmation
    console.log(`bmi: ${bmi}`)

    // Interpret BMI to find group
    let group;

    if (bmi >= 18.5 && bmi <= 24.9)
    {
        group = 'normal'
    }
    else if (bmi >= 25.0 && bmi <= 29.9)
    {
        group = 'overweight'
    }
    else if (bmi >= 30.0 && bmi <= 34.9)
    {
        group = 'obese'
    }
    else
    {
        group = 'uncategorized'
    }

    // Print group interpretation confirmation
    console.log(`group: ${group}`)

    // Send group as response
    res.type('text/plain')
    res.send(group)
})

app.listen(port, () => console.log(
    `Express started at \"http://localhost:${port}\"\n` +
    `press Ctrl-C to terminate.`
))