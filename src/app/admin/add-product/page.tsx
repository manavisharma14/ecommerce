"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
export default function AddProductPage() {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // stop page reload
        console.log('submit');
        try{
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, price, imageUrl, description, stock})
            })
            if(!res.ok){
                throw new Error('Failed to add product');
            }
            const data = await res.json();
            console.log('Product added', data);
            alert('Product added successfully');
            setName('');
            setPrice('');
            setImageUrl('');
            setDescription('');
            setStock('');

            router.push('/');
        } catch (error) {
            console.log('ADD_PRODUCT', error);
            alert('Failed to add product');
    }
}
    
    


    return (
        <div>
            <h1 className="text-center  mb-20 text-3xl">Add product!!</h1>
            <div className="max-w-3xl items-center mx-auto justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="mb-8"/>
                <Input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Product Price" className="mb-8"/>
                <Input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Product Image URL" className="mb-8"/>
                <Input type="text" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Product Stock" className="mb-8"/>
                <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product Description" className="mb-8"/>
                <div className="flex justify-center">
                <Button type="submit" className="justify-center bg-gray-300 hover:bg-gray-700 hover:text-white w-full">Add Product</Button>
                </div>
            </form>
            </div>

        </div>
    )
}