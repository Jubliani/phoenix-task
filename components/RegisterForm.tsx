import Link from "next/link"

export default function RegisterForm() {
    return (
        <div className="grid place-items-center h-screen">
            <div>
                <h1 className="text-xl font-bold">Register an account</h1>
                <form className="flex flex-col gap-3">
                    <input type="text" placeholder="email" />
                    <input type="text" placeholder="password" />
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