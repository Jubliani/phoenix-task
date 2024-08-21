import Link from "next/link"

export default function LoginForm() {
    return (
        <div className="grid place-items-center h-screen">
            <div>
                <h1 className="text-xl font-bold">Login</h1>
                <form className="flex flex-col gap-3">
                    <input type="text" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <button className="bg-blue-600 text-white">Login</button>
                <div className="bg-red-500 text-white p-1 w-fit">error</div>
                <Link className="text-right underline" href={"/register"}>
                    Register an account
                </Link>
                </form>
            </div>
        </div>
    )
}