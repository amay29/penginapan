"use client";

import { useState, useTransition } from "react";
import { createUnit, updateUnit } from "@/actions/unit";
import { generatePromotionalCopy } from "@/actions/ai";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnitForm({ 
  unit = null, 
  onClose 
}: { 
  unit?: any | null, 
  onClose: () => void 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: unit?.name || "",
    type: unit?.type || "Villa",
    capacity: unit?.capacity || 2,
    pricePerNight: unit?.pricePerNight || 1500000,
    amenities: unit?.amenities?.join(", ") || "",
    photoUrls: unit?.photoUrls?.join(", ") || "",
    promotionalCopy: unit?.promotionalCopy || "",
  });

  const handleAI = async () => {
    if (!formData.name || !formData.type) {
      setError("Please fill in Name and Type first before generating AI copy.");
      return;
    }
    
    setIsGeneratingAI(true);
    setError(null);
    try {
      const res = await generatePromotionalCopy({
        name: formData.name,
        type: formData.type,
        amenities: formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean)
      });
      
      if (res.error) {
        setError(res.error);
      } else if (res.text) {
        setFormData(prev => ({ ...prev, promotionalCopy: res.text }));
      }
    } catch (err: any) {
      setError("AI Generation failed.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      const payload = {
        name: formData.name,
        type: formData.type,
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
        amenities: formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean),
        photoUrls: formData.photoUrls.split(",").map((s: string) => s.trim()).filter(Boolean),
        promotionalCopy: formData.promotionalCopy,
      };

      let res;
      if (unit) {
        res = await updateUnit(unit.id, payload);
      } else {
        res = await createUnit(payload);
      }

      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-parchment-50 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-parchment-200 bg-white">
          <h2 className="font-serif text-2xl text-obsidian-900">
            {unit ? "Edit Space" : "New Space"}
          </h2>
          <button onClick={onClose} className="text-obsidian-400 hover:text-obsidian-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-serif focus:border-obsidian-900 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-serif focus:border-obsidian-900 focus:outline-none transition-colors"
              >
                <option>Villa</option>
                <option>Cabin</option>
                <option>Tent</option>
                <option>Suite</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Capacity (Pax)</label>
              <input 
                required
                type="number" 
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-sans text-sm focus:border-obsidian-900 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Price / Night (IDR)</label>
              <input 
                required
                type="number" 
                value={formData.pricePerNight}
                onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-sans text-sm focus:border-obsidian-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Amenities (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Private Pool, King Bed, Aesop Toiletries"
              value={formData.amenities}
              onChange={e => setFormData({...formData, amenities: e.target.value})}
              className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-sans text-sm focus:border-obsidian-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Photo URLs (comma separated)</label>
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/..."
              value={formData.photoUrls}
              onChange={e => setFormData({...formData, photoUrls: e.target.value})}
              className="w-full border border-parchment-300 bg-transparent px-4 py-2 font-sans text-sm focus:border-obsidian-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-obsidian-500">Promotional Copy</label>
              <button 
                type="button"
                onClick={handleAI}
                disabled={isGeneratingAI}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold-600 hover:text-gold-700 disabled:opacity-50 transition-colors"
              >
                {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Auto-generate with AI
              </button>
            </div>
            <textarea 
              rows={4}
              value={formData.promotionalCopy}
              onChange={e => setFormData({...formData, promotionalCopy: e.target.value})}
              className="w-full border border-parchment-300 bg-transparent p-4 font-serif text-sm leading-relaxed focus:border-obsidian-900 focus:outline-none transition-colors resize-none"
              placeholder="Leave blank or use AI to generate poetic luxury copy..."
            />
          </div>
        </form>
        
        <div className="p-6 border-t border-parchment-200 bg-white flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 border border-obsidian-200 text-xs uppercase tracking-widest text-obsidian-600 hover:bg-parchment-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-2 bg-obsidian-900 text-xs uppercase tracking-widest text-parchment-50 hover:bg-obsidian-800 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            {unit ? "Save Changes" : "Create Space"}
          </button>
        </div>
      </div>
    </div>
  );
}
