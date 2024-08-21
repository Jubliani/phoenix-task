"use client";
import Link from "next/link"
import { useState } from "react";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            });
            if (res.ok) {
                (e.target as HTMLFormElement).reset();
            } else {
                console.log("User registration failed");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };
    return (
        <div className="grid place-items-center h-screen">
            <div>
                <h1 className="text-xl font-bold">Register an account</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input onChange={e => setEmail(e.target.value)} type="text" placeholder="email" />
                    <input onChange={e => setPassword(e.target.value)} type="text" placeholder="password" />
                    <button className="bg-blue-600 text-white">Register</button>
                <div className="bg-red-500 text-white p-1 w-fit">error</div>
                <Link className="text-right underline" href={"/"}>
                    Return to login
                </Link>
                </form>
            </div>
        </div>
    )
}