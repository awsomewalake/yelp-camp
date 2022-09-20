const mongoose = require('mongoose');
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true
})
const { places, descriptors } = require('./seedHelper');
const cities = require('./cities')
const db = mongoose.connection;
db.on('eroor', console.error.bind(console, 'connecion error:'));
db.once('open', () => {
    console.log("Database Connected");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)]
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const pr = Math.floor(Math.random() * 10) + 1;
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            image: "https://source.unsplash.com/collection/483251",
            title: `${sample(descriptors)} ${sample(places)}`,
            price: pr * 500,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae maxime dolore quos exercitationem facilis suscipit corporis, aliquid totam fuga? Ipsum, enim veniam doloremque accusantium at asperiores ea facilis vitae repudiandae"
        })
        await camp.save();
    }
}
seedDB().then(() => { mongoose.connection.close() })