import AddData from "@/components/AddData"
import UpdateData from "@/components/UpdateData"
import ViewData from "@/components/ViewData"

export default function Homepage() {
    return (
        <div className="grid place-items-center h-screen">
            <div className="grid">
                <AddData />
                <UpdateData />
                <ViewData />
            </div>
        </div>
    )
}