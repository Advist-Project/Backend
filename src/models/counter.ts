import mongoose, {Schema} from 'mongoose'
import Counter from '../interfaces/counter'

const counterSchema : Schema = new Schema({
    id : String,
    seq : { type: Number, default: 0 }
})
export default mongoose.model<Counter>('Counter', counterSchema)