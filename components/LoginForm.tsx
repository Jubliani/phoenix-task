"use client";
import Link from "next/link"
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    };
    return (
        <div className="grid place-items-center h-screen">
            <div>
                <h1 className="text-xl font-bold">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input onChange={e => setEmail(e.target.value)} type="text" placeholder="email" required/>
                    <input onChange={e => setPassword(e.target.value)} type="password" placeholder="password" required/>
                    <button className="bg-blue-600 text-white">Login</button>
                    {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
                    <Link className="text-right underline" href={"/register"}>
                        Register an account
                    </Link>
                </form>
            </div>
        </div>
    )
}