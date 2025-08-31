import Aboutus from "@/components/Aboutus";
export default function Home() {
  return (
<div
  className="h-screen bg-cover bg-center relative"
  style={{ backgroundImage: "url('/assets/landing_image.jpg')" }}
>
  {/* overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* hero content */}
  <div className="relative z-10 flex flex-col pl-20 justify-center h-full  text-white">
    <p className="mb-20 text-5xl">Pure Care, Straight from Nature.</p>
    <p className="text-2xl">Discover skincare powered by natural botanicals, designed to let your skin breathe and glow.</p>

    
  </div>
  <Aboutus />
</div>
  );
}
