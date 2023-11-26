import { userModel } from "../models/users.js"


export const userController = async (req, resp) => {
    try {
        const { name, email, password, adress, city, country, phone } = req.body

        if (!name || !email || !password || !adress || !city || !country || !phone) {
            resp.status(500).send({
                success: false,
                message: 'Please provide all fields',
            })
        }

        //check email existance
        const emailExist = await userModel.findOne({ email })
        if (emailExist) {
            return resp.status(500).send({
                success: false,
                message: 'Email Already Exist'
            })
        }

        const user = await userModel.create({
            name,
            email,
            password,
            adress,
            city,
            country,
            phone
        })
        resp.status(201).send({
            success: true,
            message: 'Registration successfull',
            user
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        })
    }
}


//Login

export const loginController = async (req, resp) => {
    try {
        const {email, password} = req.body;

        //validation
        if(!email || !password){
            return resp.status(500).send({
                success:false,
                message:'Please enter both Email and Password'
            })
        }
        //exatract user
        const user = await userModel.findOne({email})

        //verify email
        if(!user){
            return resp.status(404).send({
                success:false,
                message:'User Not Found'
            })
        }

        //compare password with encrypted
            const validPass = await user.comparePassword(password)

            //verfiy Password
            if(!validPass){
                return resp.status(401).send({
                    success:false,
                    message:'Invalid Cridentals'
                })
            }

        resp.status(200).send({
            success:true,
            message:'Login Successfully',
            user,
        })

    } catch (error) {
        resp.status(500).send({
            success:false,
            message:'Login API Error',
            error
        })
    }
}