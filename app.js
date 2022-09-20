const express = require("express")
const path = require('path')
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true
})

const db = mongoose.connection;
db.on('eroor', console.error.bind(console, 'connecion error:'));
db.once('open', () => {
    console.log("Database Connected");
});


const app = express();
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    // res.send('Got it ')
    res.render('home')
})


app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index.ejs', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    // res.send('Got it ')
    res.render('campground/new.ejs')
})
app.get('/campgrounds/:id/edit', async(req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    res.render('campground/edit.ejs', { camp })
})
app.get('/campgrounds/:id', async(req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    res.render('campground/show.ejs', { camp })
})
app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})



app.listen(3000, () => {
    console.log('Listning on port 3000');
})