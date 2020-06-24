const {model, Schema} = require('mongoose')
const geocoder = require('../utills/geocoder')
const slugify = require('slugify')

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
    careers: {
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
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAd: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

Bootcamp.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

Bootcamp.pre('save', async function (next) {
    let loc = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
        city: loc[0].city,
        street: loc[0].streetName,
        state: loc[0].stateCode
    }

    this.address = undefined
    next()
})

Bootcamp.pre('remove', async function(next){
    await this.Model('Course').deleteMany({bootcamp: this._id})
    next()
})

Bootcamp.virtual('courses',{
    ref: 'Course',
    localField:'_id',
    foreignField: 'bootcamp',
    justOne: false
})

module.exports = model('Bootcamp', Bootcamp)