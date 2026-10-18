// Function to test BMI API
async function testBMI()
{
    // Calls API with set values
    const response = await fetch("/bmi/4/10/119")
    const bmiResponse = await response.text()

    document.getElementById("bmi-test").innerHTML = bmiResponse
}

// Calls BMI test function
testBMI()