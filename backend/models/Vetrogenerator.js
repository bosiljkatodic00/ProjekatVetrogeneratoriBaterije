import mongoose from 'mongoose';
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
    nominalnaSnagaV: {
        type: Number,
        required: true
    },
    trenutnaSnagaV: {
        type: Number,
        default: 0
    }
});

// Indeksiranje za geoprostorne upite
VetrogeneratorSchema.index({ lokacija: '2dsphere' });

const VetrogeneratorModel = mongoose.model('vetrogeneratori', VetrogeneratorSchema);
export default VetrogeneratorModel;
