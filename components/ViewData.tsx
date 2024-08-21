import Link from "next/link"

export default function ViewData() {
    return (
        <Link className="border border-solid border-black rounded" href="/view">
            View an entry
        </Link>
    )
}