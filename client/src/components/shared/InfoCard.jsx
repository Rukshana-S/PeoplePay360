import React from "react";
import { Info } from "lucide-react";

const InfoCard = ({ title = "Business Rule Note", message, icon: Icon = Info, type = "info" }) => {
  const styles = {
    info: "bg-[#5B8DEF]/10 border-[#5B8DEF]/20 text-slate-300 icon-text-[#5B8DEF]",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300 icon-text-amber-400",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 icon-text-emerald-400",
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${currentStyle}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        {title && <strong className="text-white block font-semibold mb-0.5">{title}</strong>}
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default InfoCard;
