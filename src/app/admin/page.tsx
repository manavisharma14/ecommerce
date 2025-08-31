import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function AdminPage() {
    return(
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to the admin panel. Here you can manage products, orders, and users.</p>
            <Button><Link href='/admin/add-product'>Want to add product?
            </Link></Button>

        </div>
    )
}