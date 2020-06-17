const {Schema, model} = require('mongoose')

const Course = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please< enter a course name']
    },
    description: {
        type: String,
        required: [true, 'Please enter description'],
        maxLength: [500, 'Description max length: 500 chars']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Please add a minimum skill']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false
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

module.exports = model('Course', Course)