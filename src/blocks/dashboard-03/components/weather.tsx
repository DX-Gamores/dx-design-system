import { CloudRain, CloudSun, Droplets, Sun, Wind, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";

const days: { day: string; icon: LucideIcon; label: string; hi: number; lo: number }[] = [
  { day: "Tue", icon: Sun, label: "Sunny", hi: 33, lo: 24 },
  { day: "Wed", icon: CloudSun, label: "Partly cloudy", hi: 31, lo: 24 },
  { day: "Thu", icon: CloudRain, label: "Rain", hi: 28, lo: 23 },
  { day: "Fri", icon: CloudSun, label: "Partly cloudy", hi: 30, lo: 23 },
];

export function Weather() {
  return (
    <section aria-labelledby="weather-title" className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
      <h2 id="weather-title" className="text-heading-h4">Weather</h2>
      <div className="flex items-center gap-4">
        <Icon name={Sun} size={24} className="size-10 text-icon-warning" />
        <p className="flex flex-col"><span className="text-heading-h2 tabular-nums">32°C</span><span className="text-body-small text-fg-secondary">Sunny · feels like 36°</span></p>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-body-small">
        <div className="flex items-center gap-2"><Icon name={Droplets} size={16} className="text-icon-secondary" /><dt className="text-fg-secondary">Humidity</dt><dd className="ms-auto tabular-nums">68%</dd></div>
        <div className="flex items-center gap-2"><Icon name={Wind} size={16} className="text-icon-secondary" /><dt className="text-fg-secondary">Wind</dt><dd className="ms-auto tabular-nums">12 km/h</dd></div>
      </dl>
      <ul className="grid grid-cols-4 gap-2 border-t border-line-default pt-4 text-center">
        {days.map((d) => (
          <li key={d.day} className="flex flex-col items-center gap-1">
            <span className="text-caption-default text-fg-secondary">{d.day}</span>
            <Icon name={d.icon} label={d.label} className="text-icon-secondary" />
            <span className="text-label-small tabular-nums">{d.hi}° <span className="text-fg-secondary">{d.lo}°</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
