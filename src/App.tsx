import { useState } from 'react';

   const RAW_BASE = "https://raw.githubusercontent.com/Travicescoot/-home-of-chromwell/main/";

const products = [
  { id: 1, name: "Cromwell Signature Shirt", price: "TZS 45,000", img: `${RAW_BASE}IMG_7577.jpeg` },
  { id: 2, name: "Dodoma Classic Fit", price: "TZS 55,000", img: `${RAW_BASE}IMG_1780.jpeg` },
  { id: 3, name: "Cromwell Evening Wear", price: "TZS 65,000", img: `${RAW_BASE}IMG_1781.jpeg` },
  { id: 4, name: "Home of Cromwell Hoodie", price: "TZS 50,000", img: `${RAW_BASE}IMG_1778.jpeg` },
  { id: 5, name: "Street Culture Jacket", price: "TZS 75,000", img: `${RAW_BASE}18046bcf-3d63-46fb-8522-e1cb57e5cae4.jpeg` },
  { id: 6, name: "Cromwell Luxe Set", price: "TZS 85,000", img: `${RAW_BASE}3483ae4f-a2f5-4510-a600-d9618e5e86bb.jpeg` },
  { id: 7, name: "Tanzania Pride", price: "TZS 40,000", img: `${RAW_BASE}7b0f8ce2-cab9-40d3-812b-11321acd1830.jpeg` },
  { id: 8, name: "Urban Street Tee", price: "TZS 35,000", img: `${RAW_BASE}e7122ff2-ed34-4266-ba73-0d7979829ca1.jpeg` },
  { id: 9, name: "Bestseller Drop", price: "TZS 60,000", img: `${RAW_BASE}f363b2c6-d190-45f2-beb2-c989b8a704f2.jpeg` },
];

export default function App() {
  const [cart, setCart] = useState(0);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="sticky top-0 z-50 bg-black/90 border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-[0.3em]">HOME OF CROMWELL</h1>
        <button className="bg-white text-black px-4 py-2 text-xs font-bold">CART ({cart})</button>
      </nav>
      <header className="px-6 py-20 text-center">
        <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-6">HOUSE<br/>OF<br/><span className="text-white/20">CROMWELL</span></h2>
        <p className="max-w-xl mx-auto text-white/60 text-sm">Official fashion store. Designed in Dodoma, worn worldwide.</p>
      </header>
      <section className="px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((p) => (
          <div key={p.id} className="bg-[#111] border border-white/10">
            <div className="aspect-[3/4] overflow-hidden bg-[#1a1a1a] relative">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1">{p.tag}</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">{p.name}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="text-white/70 text-sm">{p.price}</span>
                <button onClick={() => setCart(c => c+1)} className="text-[10px] border border-white/20 px-3 py-1 hover:bg-white hover:text-black">ADD TO CART</button>
              </div>
            </div>
          </div>
        ))}
      </section>
      <footer className="border-t border-white/10 py-12 text-center text-[10px] tracking-[0.3em] text-white/30">© 2026 HOME OF CROMWELL • DODOMA</footer>
    </div>
  );
}
