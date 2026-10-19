// Import Express
const express = require('express')
const app = express()
const cors = require('cors')

// Server run on port 3000
const port = process.env.PORT || 3000
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))
app.use(express.json());

// 1. Wake-up / Ping API
app.get('/ping', (req, res) => {
    console.log('Calling /ping (wake-up)')
    res.type('text/plain')
    res.send('Server is awake and responding')
})

// 2. BMI API
app.get('/bmi/:feet/:inches/:pounds', (req, res) => {
    const feet = parseFloat(req.params.feet)
    const inches = parseFloat(req.params.inches)
    const pounds = parseFloat(req.params.pounds)

    console.log(`Calling /bmi, feet: ${feet}, inches: ${inches}, pounds: ${pounds}`)

    let meters = feet * 0.3048 + inches * 0.0254
    let kg = pounds * 0.45359237
    let bmi = kg / meters ** 2

    let group;
    if (bmi >= 18.5 && bmi <= 24.9) group = 'normal'
    else if (bmi >= 25.0 && bmi <= 29.9) group = 'overweight'
    else if (bmi >= 30.0 && bmi <= 34.9) group = 'obese'
    else group = 'uncategorized'

    res.type('text/plain')
    res.send(group)
})

// 3. Blood Pressure Category API
app.get('/bp-category/:systolic/:diastolic', (req, res) => {
    const systolic = parseInt(req.params.systolic)
    const diastolic = parseInt(req.params.diastolic)

    console.log(`Calling /bp-category, systolic: ${systolic}, diastolic: ${diastolic}`)

    let category = 'normal'
    if (systolic > 180 || diastolic > 120) {
        category = 'crisis'
    } else if (systolic >= 140 || diastolic >= 90) {
        category = 'stage-2'
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        category = 'stage-1'
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
        category = 'elevated'
    } else {
        category = 'normal'
    }

    res.type('text/plain')
    res.send(category)
})

// 4. Risk Category API (Calculates points server-side)
app.get('/risk-category/:age/:feet/:inches/:pounds/:sys/:dia/:diabetes/:cancer/:alzheimers', (req, res) => {
    const age = parseInt(req.params.age)
    const feet = parseFloat(req.params.feet)
    const inches = parseFloat(req.params.inches)
    const pounds = parseFloat(req.params.pounds)
    const sys = parseInt(req.params.sys)
    const dia = parseInt(req.params.dia)
    const hasDiabetes = req.params.diabetes === 'true'
    const hasCancer = req.params.cancer === 'true'
    const hasAlzheimers = req.params.alzheimers === 'true'

    console.log(`Calling /risk-category for age ${age}`)

    // 1. Age Points
    let agePoints = 0
    if (age < 30) agePoints = 0
    else if (age < 45) agePoints = 10
    else if (age < 60) agePoints = 20
    else agePoints = 30

    // 2. BMI Points
    let meters = feet * 0.3048 + inches * 0.0254
    let kg = pounds * 0.45359237
    let bmi = kg / meters ** 2
    let bmiPoints = 0
    if (bmi >= 25.0 && bmi <= 29.9) bmiPoints = 30
    else if (bmi >= 30.0 && bmi <= 34.9) bmiPoints = 75

    // 3. BP Points
    let bpPoints = 0
    if (sys > 180 || dia > 120) bpPoints = 100
    else if (sys >= 140 || dia >= 90) bpPoints = 75
    else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) bpPoints = 30
    else if ((sys >= 120 && sys <= 129) && dia < 80) bpPoints = 15

    // 4. Family History Points
    let familyPoints = 0
    if (hasDiabetes) familyPoints += 10
    if (hasCancer) familyPoints += 10
    if (hasAlzheimers) familyPoints += 10

    let totalScore = agePoints + bmiPoints + bpPoints + familyPoints

    // Determine Risk Category
    let riskCategory = 'Low risk'
    if (totalScore > 75) riskCategory = 'Uninsurable'
    else if (totalScore > 50) riskCategory = 'High risk'
    else if (totalScore > 20) riskCategory = 'Moderate risk'

    res.json({
        totalScore,
        riskCategory,
        breakdown: { agePoints, bmiPoints, bpPoints, familyPoints }
    })
})

app.listen(port, () => console.log(
    `Express started at "http://localhost:${port}"\n` +
    `press Ctrl-C to terminate.`
))