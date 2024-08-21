import Link from "next/link"

export default function AddData() {
    return (
        <Link className="border border-solid border-black rounded" href="/add">
            Add a new entry
        </Link>
    )
}