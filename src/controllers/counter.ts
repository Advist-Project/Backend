import Counter from "../models/counter"

export default async function getNextSequence(id: string) {
  try {
    const result = await Counter.findOneAndUpdate(
      { id: id },
      { $inc: { seq: 1 } },
      { new: true }
    )
    if (result instanceof Counter) {
      console.log(result.seq)
      return result.seq
    }
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}
