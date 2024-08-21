"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const register = async (values: any) => {
    const { email, password } = values;

    try {
        await connectDB();
        const userFound = await User.findOne({ email });
        console.log("KDFJLSDFLDSF", email);
        if(userFound){
            console.log("EEEEEEEEEEEEE");
            return {
                error: 'Email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("SJDFLSDJFLSKFKLSF");
        const user = new User({
            email,
            password: hashedPassword,
        });
        const savedUser = await user.save();

    } catch(e) {
        console.log("AAAAAAAAAAAAA");
        console.log(e);
    }
}