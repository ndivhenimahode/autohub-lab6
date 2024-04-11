const fs = require('fs').promises;
const path = require('path');

module.exports = async function (context, req) {
    try {
        if (req.method === 'POST') {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString(); // Convert the data chunk to a string
            });

            req.on('end', async () => {
                try {
                    const newCar = JSON.parse(body); // Parse the JSON data

                    // Get the path to the cars.json file
                    const carsFilePath = path.resolve(__dirname, '../cars.json');

                    // Read the current cars array from the cars.json file
                    let cars = await fs.readFile(carsFilePath, 'utf-8');
                    cars = JSON.parse(cars);

                    // Add the new car to the cars array
                    cars.push(newCar);

                    // Write the updated cars array back to the cars.json file
                    await fs.writeFile(carsFilePath, JSON.stringify(cars, null, 2));

                    context.res = {
                        status: 201,
                        body: { success: true, message: 'Car added successfully', car: newCar }
                    };
                } catch (error) {
                    context.res = {
                        status: 400,
                        body: { success: false, message: 'Failed to add car. Invalid JSON data' }
                    };
                }
            });
        } else {
            context.res = {
                status: 405,
                body: { success: false, message: 'Method Not Allowed' }
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: { success: false, message: 'Internal Server Error' }
        };
    }
};
