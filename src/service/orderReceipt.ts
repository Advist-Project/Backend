import orderReceipt from "../models/orderReceipt"

const orderReciptFindOne = async (id: number) => {
  try {
    return await orderReceipt.findOne(
      { orderId: id })
  }
  catch (error) {
    console.log("orderReciptFindOne" + error.message)
  }
}

const orderReciptFindUpdate = async (id: number, param: any) => {
  try {
    await orderReceipt.findOneAndUpdate(
      { orderId: id },
      { $set: param },
      { new: true })
  }
  catch (error) {
    console.log("orderReciptFindUpdate" + error.message)
  }
}


export default
  {
    orderReciptFindOne,
    orderReciptFindUpdate
  }
