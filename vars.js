// car.js

// TEST

console.log("This is vars.js!");

const cars = {
    brand: 'Ford',
    model: 'Fiesta',
};

const bikes = {
    brand: "Honda",
    model: "CBR 1000",
};

const buses = {
    type: "big",
    color: "red",
};

// This approach doesn't work for multiple objects
// module.exports = cars;
// module.exports = bikes;

// This approach works better for multiple objects
// module.exports = {
//     cars: cars, // or whatever you want to assign it to
//     bikes: bikes, // again, set it to what you like
// };

// Another way to do exports...
exports.cars = cars;
exports.bikes = bikes;
exports.buses = buses;