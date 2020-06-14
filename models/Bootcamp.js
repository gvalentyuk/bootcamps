const {model, Schema} = require('mongoose')

const Bootcamp = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Please enter a name'],
        maxLength: [50, 'Max length 50 chars'],
        trim: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Enter description'],
        maxLength: [500, 'Max description length 500 chars']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Enter a valid website'
        ]
    },
    phone: {
        type: String,
        maxLength: [20, 'Max phone number length is 20 chars']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Enter a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, ' Enter address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        zipcode: String,
        country: String,
        city: String,
        street: String,
        state: String
    },
    careers:{
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min:[1, 'Rating must be at least 1'],
        max:[10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default:'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAd: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Bootcamp', Bootcamp)