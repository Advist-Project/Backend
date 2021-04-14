import { Document } from "mongoose"

export default interface Counter extends Document {
  id: string
  seq: number
}
