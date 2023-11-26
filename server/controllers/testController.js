export const testController = (req, resp) => {
    resp.status(200).send({
        message:'MUC Structured Server Code',
        success:true
    })
}