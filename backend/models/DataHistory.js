import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const historicalVetrogeneratorDataSchema = new mongoose.Schema({
    vetrogeneratorId: { type: mongoose.Schema.Types.ObjectId, ref: 'VetrogeneratorModel' },
    timestamp: { type: Date, default: Date.now },
    nominalnaSnagaV: Number,
    trenutnaSnagaV: Number,
    vlasnik: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }
  });
  
  const historicalBatteryDataSchema = new mongoose.Schema({
    batteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BaterijaModel' },
    timestamp: { type: Date, default: Date.now },
    napunjenostB: Number,
    vlasnik: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }
  });
  
  const HistoricalVetrogeneratorDataModel = mongoose.model('HistoricalVetrogeneratorData', historicalVetrogeneratorDataSchema);
  const HistoricalBatteryDataModel = mongoose.model('HistoricalBatteryData', historicalBatteryDataSchema);
  
  export { HistoricalVetrogeneratorDataModel, HistoricalBatteryDataModel };
