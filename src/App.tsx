import { useState } from "react";
const RAW_BASE = "https://raw.githubusercontent.com/Travicescoot/-home-of-chromwell/main/";
const products = [
  { id: 1, cat: "Official Wear", name: "Cromwell Signature", price: "45,000 TZS", img: `${RAW_BASE}IMG_7577.jpeg` },
  { id: 2, cat: "Official Wear", name: "Classic Fit - Ladies", price: "55,000 TZS", img: `${RAW_BASE}IMG_1780.jpeg` },
  { id: 3, cat: "Official Wear", name: "Evening Wear", price: "65,000 TZS", img: `${RAW_BASE}IMG_1781.jpeg` },
  { id: 4, cat: "Hoodie", name: "Cromwell Hoodie", price: "50,000 TZS", img: `${RAW_BASE}IMG_1778.jpeg` },
  { id: 5, cat: "Jacket", name: "Street Jacket", price: "75,000 TZS", img: `${RAW_BASE}18046bcf-3d63-46fb-8522-e1cb57e5cae4.jpeg` },
  { id: 6, cat: "Accessories", name: "Luxe Set", price: "85,000 TZS", img: `${RAW_BASE}3483ae4f-a2f5-4510-a600-d9618e5e86bb.jpeg` },
  { id: 7, cat: "Miwani", name: "Miwani Kali", price: "40,000 TZS", img: `${RAW_BASE}7b0f8ce2-cab9-40d3-812b-11321acd1830.jpeg` },
  { id: 8, cat: "Saa", name: "Saa Kali", price: "35,000 TZS", img: `${RAW_BASE}e7122ff2-ed34-4266-ba73-0d7979829ca1.jpeg` },
  { id: 9, cat: "Oil", name: "Oil Fragrance", price: "60,000 TZS", img: `${RAW_BASE}f363b2c6-d190-45f2-beb2-c989b8a704f2.jpeg` },
];
export default function App(){
  const [show,setShow]=useState(false);
  const order=(p:any)=>{ window.open(`https://wa.me/255754973156?text=${encodeURIComponent(`Habari HOME OF CROMWELL! Nahitaji ${p.name} - ${p.price}`)}`,"_blank") };
  return(
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white text-[10px] text-center py-2 tracking-widest">📍 DODOMA CBE | MANAGER: OLIVA 🍎 | +255 754 973 156</div>
      <header className="sticky top-0 z-50 bg-white border-b flex justify-between items-center px-6 py-5">
        <h1 className="font-black text-xl tracking-[0.2em]">HOME OF CROMWELL</h1>
        <button onClick={()=>setShow(true)} className="border border-black px-4 py-2 rounded-full text-[10px] font-bold">ADMIN</button>
      </header>
      <section className="bg-black text-white px-6 py-16 text-center">
        <p className="text-zinc-500 text-[11px] tracking-[0.4em] mb-4">DODOMA CBE - OFFICIAL LADIES STORE</p>
        <h2 className="text-5xl font-black">HOME OF<br/>CROMWELL</h2>
        <p className="text-zinc-400 mt-4 text-sm max-w-xl mx-auto">Official Clothes for Ladies, Saa Kali, Miwani, Viatu Vikali, Cheni Kali, Oil Fragrance za Kisasa na Urembo kwa Wanawake - Dodoma CBE</p>
        <a href="https://wa.me/255754973156" className="inline-block mt-6 bg-white text-black px-8 py-3 rounded-full text-xs font-black">WHATSAPP OLIVA</a>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4 border-y text-center text-[10px] font-bold tracking-widest"><div className="p-4 border-r">OFFICIAL LADIES</div><div className="p-4 border-r">SAA & MIWANI</div><div className="p-4 border-r">VIATU & CHENI</div><div className="p-4">OIL & UREMBO</div></div>
      <section className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#fafafa]">
        {products.map(p=>(
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img src={p.img} className="h-64 w-full object-cover"/>
            <div className="p-3"><p className="text-[9px] bg-black text-white inline px-2 py-1 rounded-full">{p.cat}</p><h4 className="font-bold text-sm mt-2">{p.name}</h4><p className="text-xs mt-1 font-black">{p.price}</p><button onClick={()=>order(p)} className="mt-2 w-full bg-black text-white py-2.5 rounded-full text-[10px] font-black tracking-widest">ORDER</button></div>
          </div>
        ))}
      </section>
      <section className="grid md:grid-cols-3 border-t">
        <div className="p-8 border-r"><h4 className="font-black text-xs tracking-widest mb-3">ABOUT</h4><p className="text-sm text-zinc-600">HOME OF CROMWELL - Brand ya Dodoma CBE. Tunauza Official Ladies, Saa, Miwani, Viatu, Cheni, Oil Fragrance na Urembo bora.</p><p className="text-[11px] font-black mt-4">📍 DODOMA CBE - TANZANIA</p></div>
        <div className="p-8 border-r"><h4 className="font-black text-xs tracking-widest mb-3">DELIVERY & PAYMENT</h4><p className="text-sm text-zinc-600">CBE Same Day 5k (2hrs), Dodoma Mjini 3k, Mikoani 10k-15k. Free Delivery kwa 2+ CBE. Lipa: Tigo Pesa, M-Pesa, Cash.</p></div>
        <div className="p-8 bg-black text-white"><h4 className="font-black text-xs tracking-widest mb-3">CONTACT - OLIVA 🍎</h4><p className="text-sm text-zinc-300">📍 Dodoma CBE, Udom Area</p><p className="text-sm text-zinc-300">📞 +255 754 973 156</p><p className="text-sm text-zinc-300">👩‍💼 Manager: Oliva 🍎</p><p className="text-sm text-zinc-300">🏷️ Brand: HOME OF CROMWELL</p><p className="text-[10px] tracking-widest text-zinc-500 mt-4">OFFICIAL | SAA | MIWANI | VIATU | CHENI | OIL | UREMBO</p></div>
      </section>
      <footer className="bg-black text-zinc-600 text-center py-6 text-[10px] tracking-widest border-t border-zinc-900">© 2026 HOME OF CROMWELL | MANAGED BY OLIVA 🍎 | +255 754 973 156 | DODOMA CBE</footer>
      {show && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"><div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center"><h3 className="font-black mb-2">ADMIN - HOME OF CROMWELL</h3><p className="text-xs text-zinc-500 mb-4">Manager: Oliva - Dodoma CBE</p><button onClick={()=>setShow(false)} className="bg-black text-white px-6 py-2 rounded-full text-xs w-full">CLOSE</button></div></div>)}
    </div>
  )
}
