"use client";

import { useState, useTransition } from "react";
import { createUnit, updateUnit } from "@/actions/unit";
import { generatePromotionalCopy } from "@/actions/ai";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnitForm({
  unit = null,
  onClose,
}: {
  unit?: any | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name:           unit?.name || "",
    type:           unit?.type || "Villa",
    capacity:       unit?.capacity || 2,
    pricePerNight:  unit?.pricePerNight || 1500000,
    amenities:      unit?.amenities?.join(", ") || "",
    photoUrls:      unit?.photoUrls?.join(", ") || "",
    promotionalCopy: unit?.promotionalCopy || "",
  });

  const handleAI = async () => {
    if (!formData.name || !formData.type) {
      setError("Fill in Name and Type first.");
      return;
    }
    setIsGeneratingAI(true);
    setError(null);
    try {
      const res = await generatePromotionalCopy({
        name: formData.name,
        type: formData.type,
        amenities: formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
      if (res.error) setError(res.error);
      else if (res.text) setFormData(prev => ({ ...prev, promotionalCopy: res.text }));
    } catch {
      setError("AI generation failed.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const payload = {
        name:             formData.name,
        type:             formData.type,
        capacity:         Number(formData.capacity),
        pricePerNight:    Number(formData.pricePerNight),
        amenities:        formData.amenities.split(",").map((s: string) => s.trim()).filter(Boolean),
        photoUrls:        formData.photoUrls.split(",").map((s: string) => s.trim()).filter(Boolean),
        promotionalCopy:  formData.promotionalCopy,
      };
      const res = unit ? await updateUnit(unit.id, payload) : await createUnit(payload);
      if (res.error) setError(res.error);
      else { router.refresh(); onClose(); }
    });
  };

  const field = "w-full border-b border-surface-600/40 bg-transparent py-3 text-surface-100 placeholder:text-surface-500 focus:border-gold-500 focus:outline-none transition-colors duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
      {/* Warm blurred backdrop */}
      <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-surface-800 border border-surface-600/40 flex flex-col max-h-[90vh] shadow-2xl rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-surface-600/30">
          <h2 className="font-serif text-2xl font-light text-surface-100 tracking-wide">
            {unit ? "Edit Space" : "New Space"}
          </h2>
          <button onClick={onClose} className="text-surface-500 hover:text-surface-100 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <form id="unit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          {error && (
            <p className="px-4 py-3 text-xs text-red-400 bg-red-900/20 border border-red-900/40 rounded-sm">{error}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className={`${field} font-serif text-lg`} placeholder="The Canopy Suite" />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className={`${field} font-serif text-lg appearance-none`}>
                {["Villa","Cabin","Tent","Suite"].map(t => (
                  <option key={t} value={t} className="bg-surface-900">{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Capacity (Pax)</label>
              <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                className={`${field} text-lg`} />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Nightly Rate (IDR)</label>
              <input required type="number" value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                className={`${field} text-lg`} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Amenities (comma separated)</label>
            <input type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})}
              className={`${field} text-sm`} placeholder="Private Pool, King Bed, Outdoor Shower..." />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Photo URLs (comma separated)</label>
            <input type="text" value={formData.photoUrls} onChange={e => setFormData({...formData, photoUrls: e.target.value})}
              className={`${field} text-sm`} placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="space-y-4 pt-2 border-t border-surface-600/30">
            <div className="flex items-center justify-between">
              <label className="text-[9px] uppercase tracking-[0.3em] text-surface-500">Promotional Copy</label>
              <button type="button" onClick={handleAI} disabled={isGeneratingAI}
                className="flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase tracking-widest border border-gold-700/40 text-gold-400 bg-gold-700/10 hover:bg-gold-700/20 hover:border-gold-600/50 disabled:opacity-50 transition-all duration-200 rounded-sm">
                {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate with AI
              </button>
            </div>
            <textarea rows={4} value={formData.promotionalCopy} onChange={e => setFormData({...formData, promotionalCopy: e.target.value})}
              className="w-full bg-surface-700/40 border border-surface-600/40 rounded-sm p-4 font-serif text-base leading-relaxed text-surface-100 placeholder:text-surface-500 focus:border-gold-500 focus:outline-none transition-colors resize-none"
              placeholder="Let Claude craft a quiet, poetic narrative for this space..." />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-surface-600/30 bg-surface-900/50 flex justify-end gap-4">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 text-[10px] uppercase tracking-widest text-surface-400 hover:text-surface-100 transition-colors duration-200">
            Discard
          </button>
          <button type="submit" form="unit-form" disabled={isPending}
            className="px-8 py-2.5 bg-surface-100 text-surface-950 text-[10px] uppercase tracking-widest font-semibold hover:bg-parchment-50 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2 rounded-sm">
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            {unit ? "Save Changes" : "Create Space"}
          </button>
        </div>
      </div>
    </div>
  );
}
