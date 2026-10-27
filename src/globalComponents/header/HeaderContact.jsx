import { Phone } from 'lucide-react';

export default function HeaderContact({
  label = 'Assistance',
  phone = '+225 27 20 00 00',
  className = ''
}) {
  if (!phone) return null;

  return (
    <div className={`hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/90 px-3.5 py-2 rounded-xl ${className}`}>
      <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
      <span>{label} : <strong className="font-bold text-slate-800">{phone}</strong></span>
    </div>
  );
}
