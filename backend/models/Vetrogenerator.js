const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VetrogeneratorSchema = new Schema({
    vlasnik: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lokacija: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    nominalnaSnaga: {
        type: Number,
        required: true
    },
    trenutnaSnaga: {
        type: Number,
        default: 0
    }
});

// Indeksiranje za geoprostorne upite
VetrogeneratorSchema.index({ lokacija: '2dsphere' });

const Vetrogenerator = mongoose.model('vetrogeneratori', VetrogeneratorSchema);
module.exports = Vetrogenerator;
