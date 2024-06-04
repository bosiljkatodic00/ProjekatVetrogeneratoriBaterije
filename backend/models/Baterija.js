import mongoose from 'mongoose';
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
    kapacitetB: {
        type: Number,
        required: true
    },
    snagaB: {
        type: Number,
        required: true
    },
    napunjenostB: {
        type: Number,
        default: 0
    },
    trajanjePunjenaB: {
        type: Number,
        required: true
    },
    trajanjePraznjenjaB: {
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
    },
    systemId: {
        type: String,
        required: true,
    }
});

// Indeksiranje za geoprostorne upite
BaterijaSchema.index({ lokacija: '2dsphere' });

const BaterijaModel = mongoose.model('baterije', BaterijaSchema);
export default BaterijaModel;
