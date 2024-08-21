"use server";
import { connectUserDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const register = async (values: any) => {
    const { email, password } = values;

    try {
        await connectUserDB();
        const userFound = await User.findOne({ email });
        if(userFound){
            return {
                error: 'Email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
        });
        const savedUser = await user.save();

    } catch(e) {
        console.log(e);
    }
}