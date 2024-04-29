const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaterijaSchema = new Schema({
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
    kapacitet: {
        type: Number,
        required: true
    },
    snaga: {
        type: Number,
        required: true
    },
    napunjenost: {
        type: Number,
        default: 0
    },
    trajanjePunjena: {
        type: Number,
        required: true
    },
    trajanjePraznjenja: {
        type: Number,
        required: true
    },
    stanje: {
        type: String,
        enum: ['punjenje', 'pražnjenje', 'mirovanje'],
        default: 'mirovanje'
    },
    t1: {
        type: Number,
        required: true
    },
    t2: {
        type: Number,
        required: true
    }
});

// Indeksiranje za geoprostorne upite
BaterijaSchema.index({ lokacija: '2dsphere' });

const Baterija = mongoose.model('baterije', BaterijaSchema);
module.exports = Baterija;
