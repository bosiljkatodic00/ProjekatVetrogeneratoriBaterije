import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    vmin: { type: Number, required: true },
    vfull: { type: Number, required: true },
    vmax: { type: Number, required: true }
});

const SettingModel = mongoose.model('settingsV', SettingSchema);

export default SettingModel;
