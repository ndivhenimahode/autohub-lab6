const fs = require('fs').promises;
const path = require('path');
const { app } = require('@azure/functions');

module.exports = async function (context, req) {
    try {
        if (req.method === 'DELETE') {
            const carId = req.params.id; // Extract car ID from request parameters

            // Get the path to the cars.json file
            const carsFilePath = path.resolve(__dirname, '../cars.json');

            // Read the current cars array from the cars.json file
            let cars = await fs.readFile(carsFilePath, 'utf-8');
            cars = JSON.parse(cars);

            // Find the index of the car to delete
            const index = cars.findIndex(car => car.id === parseInt(carId));

            // If car not found, return 404
            if (index === -1) {
                context.res = {
                    status: 404,
                    body: { success: false, message: 'Car not found' }
                };
                return;
            }

            // Remove the car from the cars array
            cars.splice(index, 1);

            // Write the updated cars array back to the cars.json file
            await fs.writeFile(carsFilePath, JSON.stringify(cars, null, 2));

            context.res = {
                status: 200,
                body: { success: true, message: 'Car deleted successfully' }
            };
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
