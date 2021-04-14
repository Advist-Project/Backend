import Counter from "../models/counter"

export default function getNextSequence(id: string) {
  return Counter.findOneAndUpdate(
    { id: id },
    { $inc: { seq: 1 } },
    { new: true }
  )
    .then((result) => {
      if (result instanceof Counter) {
        console.log(result.seq)
        return result.seq
      }
    })
    .catch((error) => {
      console.log(error.message)
      return error.message
    })
}
