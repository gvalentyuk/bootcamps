const {model, Schema} = require('mongoose')

const Review = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please< enter a course name'],
        maxLength: [100, 'Max length of title: 100']
    },
    text: {
        type: String,
        required: [true, 'Please enter text'],
        maxLength: [500, 'Text max length: 500 chars']
    },
    rating: {
        type: Number,
        max: 10,
        min: 1,
        required: [true, 'Rating must be between 1 - 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

Review.index({bootcamp: 1, user: 1}, {unique: true})

module.exports = model('Review', Review)