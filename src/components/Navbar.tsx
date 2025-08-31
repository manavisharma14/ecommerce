"use client"
import Link from "next/link"
import { useState, useEffect} from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

type User = {
    id: string;
    email: string;
}
export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await fetch('/api/me', {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if(res.ok){
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        } 
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // clear JWT
        setUser(null); // clear local state
        router.push("/login"); // redirect
      };
    return(
        <nav className="flex justify-between fixed top-0 left-0 right-0 z-50 px-8 items-center py-10 items-center text-black">
            <h1 className="font-bold text-xl text-black">PureLeaf</h1>



            <ul className="flex font-medium gap-8"> {/* or gap-4 for both horizontal and vertical */}
                {user  ? (

                    <Popover>
  <PopoverTrigger>Welcome {user.email}</PopoverTrigger>
  <PopoverContent className="bg-white-600 text-black"> 
    <p className="text-black">email : {user.email}</p>
    <Button className="text-black" onClick={handleLogout}>Logout</Button>

  </PopoverContent>

</Popover>
                ) : null}
    <Link href="/">Home</Link>
    <Link href='/products'>Products</Link>
    {
        user? (
            <Link href="/cart">Cart</Link>
        ) : (
            <Link href="/login">Login</Link>
        )
    }

  </ul>
        </nav>
    )
}