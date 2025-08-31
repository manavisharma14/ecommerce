import { Leaf, Heart, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

export default function Aboutus() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      bg: "bg-green-100",
      title: "Natural Formula",
      description: "Crafted with pure, skin-loving ingredients for ultimate care."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      bg: "bg-pink-100",
      title: "Cruelty-Free",
      description: "Our products are never tested on animals, guaranteed ethical."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-100",
      title: "Expert Approved",
      description: "Carefully tested to ensure safety and visible results."
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-500" />,
      bg: "bg-purple-100",
      title: "Free Shipping",
      description: "Delivered to your doorstep with no extra costs worldwide."
    }
  ];

  return (
    <div className="bg-[#F5F6F1] py-28">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${feature.bg} mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-24 max-w-3xl mx-auto">
        <p className="text-gray-700 text-2xl md:text-3xl italic leading-relaxed">
          We believe in natural, ethical, and sustainable care — for you and the planet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-44 px-6">
      <div className="flex flex-col mt-24 items-center text-center px-6">
        <h2 className="text-2xl font-bold mb-4">About PureLeaf</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
        At PureLeaf, we believe skincare should be simple, honest, and effective. Our journey began with a passion for harnessing the best of nature and science to create products that not only nourish the skin but also inspire confidence. Every product we offer is carefully crafted with clean, dermatologist-tested ingredients that are safe, sustainable, and results-driven.
        </p>
      </div>

      <div className="flex justify-center items-center">
    <div className="w-96 h-96"> {/* 👈 fixed square (adjust as needed) */}
      <Image
        src="/assets/aboutus.png"
        alt="About Us Image"
        width={500}
        height={500}
        className="w-full h-full object-cover rounded-lg shadow-md"
      />
    </div>
  </div>
      </div>
    </div>
  );
}