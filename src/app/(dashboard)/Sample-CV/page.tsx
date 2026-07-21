"use client";

import { Inter } from "next/font/google";
import {
  ChevronLeft,
  User,
  Briefcase,
  Heart,
  Bell,
  Video,
  UploadCloud,
  FileText,
  ClipboardList,
  Send,
  FolderKanban,
  Settings,
  PlusSquare,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  Music,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Camera,
  Bike,
  Award,
  GraduationCap,
  Briefcase as BriefcaseIcon,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

/* ------------------------------------------------------------------ */
/* Design tokens (shared HireFlow system)                             */
/* ------------------------------------------------------------------ */
const COLORS = {
  navy: "#1A2E44",
  green: "#22C55E",
  yellow: "#F5B32C",
  bg: "#EAF0FC",
  card: "#FFFFFF",
  textMuted: "#8B95A5",
};

/* ------------------------------------------------------------------ */
/* Sidebar nav data                                                    */
/* ------------------------------------------------------------------ */
type NavItem = {
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { label: "My Profile", icon: User },
  { label: "Applied Jobs", icon: Briefcase },
  { label: "Favorite Jobs", icon: Heart },
  { label: "Job Alert", icon: Bell },
  { label: "AI Interview", icon: Video },
  { label: "Submit CV", icon: UploadCloud },
  { label: "Resumes", icon: FileText },
  { label: "Project Submissions", icon: ClipboardList },
  { label: "My Applications", icon: Send },
  { label: "My Portfolio", icon: FolderKanban },
  { label: "Settings", icon: Settings },
  { label: "Post Job", icon: PlusSquare },
];

const ACTIVE_LABEL = "Resumes";

/* ------------------------------------------------------------------ */
/* CV thumbnail mock data                                              */
/* ------------------------------------------------------------------ */
type CVTheme =
  | "maroon"
  | "cream"
  | "teal-light"
  | "navy-white-circle"
  | "navy-teal-blob"
  | "navy-white-circle-2";

type SampleCV = {
  id: number;
  theme: CVTheme;
};

const SAMPLE_CVS: SampleCV[] = [
  { id: 1, theme: "maroon" },
  { id: 2, theme: "cream" },
  { id: 3, theme: "teal-light" },
  { id: 4, theme: "navy-white-circle" },
  { id: 5, theme: "navy-teal-blob" },
  { id: 6, theme: "navy-white-circle-2" },
];

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const LOREM_TINY = "Lorem ipsum dolor sit amet.";

/* ------------------------------------------------------------------ */
/* Shared micro-components used inside the thumbnail mockups           */
/* Text sizes are intentionally tiny (5–7px) since these are           */
/* thumbnail previews of a full-page resume, same as the reference     */
/* ------------------------------------------------------------------ */
function Bar({
  w = "100%",
  h = 2.5,
  color = "#D9DEE7",
  radius = 2,
}: {
  w?: string | number;
  h?: number;
  color?: string;
  radius?: number;
}) {
  return (
    <div style={{ width: w, height: h, backgroundColor: color, borderRadius: radius }} />
  );
}

/** Small bold section label, e.g. CONTACTS / SKILLS / PROFILE */
function Label({
  children,
  color = "#1A2E44",
  boxed = false,
  boxColor,
}: {
  children: React.ReactNode;
  color?: string;
  boxed?: boolean;
  boxColor?: string;
}) {
  if (boxed) {
    return (
      <span
        className="inline-block whitespace-nowrap border px-1 py-[1px] text-[5.5px] font-bold uppercase tracking-wide"
        style={{ borderColor: boxColor ?? color, color }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="whitespace-nowrap text-[5.5px] font-bold uppercase tracking-wide"
      style={{ color }}
    >
      {children}
    </span>
  );
}

/** A full-width banner-style section label with an icon (navy/teal designs) */
function BannerLabel({
  icon: Icon,
  children,
  bg,
  fg = "#FFFFFF",
}: {
  icon?: React.ElementType;
  children: React.ReactNode;
  bg: string;
  fg?: string;
}) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-[2px]"
      style={{ backgroundColor: bg }}
    >
      {Icon && <Icon size={6} color={fg} />}
      <span className="text-[5.5px] font-bold uppercase tracking-wide" style={{ color: fg }}>
        {children}
      </span>
    </div>
  );
}

/** One short line of real (tiny) body text */
function Line({
  children,
  color = "#9AA3B2",
  size = 4.5,
  weight = "font-normal",
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: string;
}) {
  return (
    <p className={`leading-[1.3] ${weight}`} style={{ color, fontSize: size }}>
      {children}
    </p>
  );
}

/** Icon + short text row, used for contact details */
function ContactRow({ icon: Icon, text, color = "#9AA3B2", iconColor }: { icon: React.ElementType; text: string; color?: string; iconColor?: string }) {
  return (
    <div className="flex items-center gap-1">
      <Icon size={5.5} color={iconColor ?? color} strokeWidth={2.2} />
      <span className="text-[4.5px] leading-none" style={{ color }}>
        {text}
      </span>
    </div>
  );
}

/** Row of tiny star icons representing a skill/language rating */
function StarRating({ filled = 3, total = 5, color }: { filled?: number; total?: number; color: string }) {
  return (
    <div className="flex gap-[1px]">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          size={4.5}
          fill={i < filled ? color : "none"}
          color={color}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/** A label + star rating row (languages / skills lists) */
function RatedItem({ label, filled, color, textColor = "#9AA3B2" }: { label: string; filled: number; color: string; textColor?: string }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="text-[4.5px] leading-none" style={{ color: textColor }}>
        {label}
      </span>
      <StarRating filled={filled} color={color} />
    </div>
  );
}

/** A label + thin progress bar row (skill level lists) */
function ProgressItem({ label, pct, color, textColor = "#9AA3B2" }: { label: string; pct: number; color: string; textColor?: string }) {
  return (
    <div className="flex flex-col gap-[1px]">
      <span className="text-[4.5px] leading-none" style={{ color: textColor }}>
        {label}
      </span>
      <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: `${color}33` }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/** A small row of generic hobby icons */
function HobbyIcons({ color }: { color: string }) {
  const icons = [Music, BookOpen, Dumbbell, Gamepad2, Camera, Bike];
  return (
    <div className="flex gap-1">
      {icons.map((Icon, i) => (
        <span
          key={i}
          className="flex h-[9px] w-[9px] items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <Icon size={5} color="#FFFFFF" strokeWidth={2} />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual CV thumbnail renderers (one per theme)                   */
/* Content mirrors the real reference templates: names, section        */
/* headers, contact info, skills, experience & education entries       */
/* ------------------------------------------------------------------ */
function CVThumbnail({ theme }: { theme: CVTheme }) {
  switch (theme) {
    /* ---------------- 1. Maroon / oval photo ---------------- */
    case "maroon":
      return (
        <div className="relative h-full w-full overflow-hidden bg-white">
          <div
            className="absolute inset-y-0 left-0 w-[38%]"
            style={{
              background: "linear-gradient(160deg, #A6293A 0%, #6E1522 100%)",
              clipPath: "polygon(0 0, 100% 0, 60% 100%, 0% 100%)",
            }}
          />
          {/* oval photo */}
          <div className="absolute left-2 top-2 h-9 w-11 rounded-[50%] border-2 border-white bg-[#26303F]" />

          {/* left column sections */}
          <div className="absolute left-2 top-14 flex w-[30%] flex-col gap-1.5">
            <Label boxed color="#FFFFFF" boxColor="#FFFFFF">
              Contacts
            </Label>
            <div className="flex flex-col gap-[2px]">
              <ContactRow icon={MapPin} text="City, Country" color="#F3D2D6" />
              <ContactRow icon={Phone} text="+000 0000" color="#F3D2D6" />
              <ContactRow icon={Mail} text="example@mail.com" color="#F3D2D6" />
            </div>

            <Label boxed color="#FFFFFF" boxColor="#FFFFFF">
              Languages
            </Label>
            <div className="flex flex-col gap-[2px]">
              <RatedItem label="French" filled={4} color="#F3D2D6" textColor="#F3D2D6" />
              <RatedItem label="English" filled={5} color="#F3D2D6" textColor="#F3D2D6" />
              <RatedItem label="Hindi" filled={3} color="#F3D2D6" textColor="#F3D2D6" />
            </div>

            <Label boxed color="#FFFFFF" boxColor="#FFFFFF">
              Skills
            </Label>
            <div className="flex flex-col gap-[2px]">
              <RatedItem label="Creativity" filled={5} color="#F3D2D6" textColor="#F3D2D6" />
              <RatedItem label="Teamwork" filled={4} color="#F3D2D6" textColor="#F3D2D6" />
              <RatedItem label="Leadership" filled={4} color="#F3D2D6" textColor="#F3D2D6" />
            </div>
          </div>

          {/* right column: name + content */}
          <div className="absolute right-2 top-2 flex flex-col items-end">
            <span className="text-[8px] font-extrabold leading-none tracking-wide text-[#1A2E44]">
              NAME <span className="text-[#A6293A]">SURNAME</span>
            </span>
            <span className="mt-[2px] text-[4.5px] font-semibold uppercase tracking-wide text-[#6B7280]">
              Graphics &amp; Web Designer
            </span>
          </div>

          <div className="absolute left-[40%] right-2 top-9 flex flex-col gap-1">
            <Label boxed>Profile</Label>
            <Line>{LOREM_SHORT}</Line>
            <Line size={4}>{LOREM_TINY}</Line>
          </div>

          <div className="absolute left-[40%] right-2 top-[42%] flex flex-col gap-1">
            <Label boxed>Experience</Label>
            {[1, 2].map((n) => (
              <div key={n} className="flex flex-col">
                <span className="text-[4.5px] font-bold text-[#1A2E44]">Job Position / Title Here</span>
                <Line size={4}>{LOREM_TINY}</Line>
              </div>
            ))}
          </div>

          <div className="absolute left-[40%] right-2 top-[70%] flex flex-col gap-1">
            <Label boxed>Education</Label>
            <Line size={4}>{LOREM_TINY}</Line>
            <Line size={4}>{LOREM_TINY}</Line>
          </div>

          <div className="absolute bottom-1.5 left-[40%]">
            <HobbyIcons color="#A6293A" />
          </div>
        </div>
      );

    /* ---------------- 2. Cream / hexagon photo (Elizabeth Harris) ---------------- */
    case "cream":
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#F3E9D7]">
          {/* top dark banner with name */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-[#2A2118] px-2 py-1.5 pl-[34%]">
            <div className="flex flex-col">
              <span className="text-[6px] font-extrabold leading-none text-white">
                ELIZABETH <span className="text-[#C9A25B]">HARRIS</span>
              </span>
              <span className="mt-[2px] text-[4px] font-semibold uppercase tracking-wide text-[#C9A25B]">
                Web Designer &amp; Developer
              </span>
            </div>
          </div>

          {/* hexagon photo overlapping top-left */}
          <div
            className="absolute left-2 top-2 h-9 w-9 border-2 border-[#2A2118] bg-[#EADFC6]"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          />

          <div className="absolute inset-x-2 top-11 flex flex-col gap-1">
            <Label color="#2A2118">Contact</Label>
            <div className="grid grid-cols-2 gap-x-2 gap-y-[2px]">
              <ContactRow icon={Phone} text="+001 123 456" color="#8A7A5C" />
              <ContactRow icon={Mail} text="info@mail.com" color="#8A7A5C" />
              <ContactRow icon={Globe} text="yoursite.com" color="#8A7A5C" />
              <ContactRow icon={MapPin} text="Street, Country" color="#8A7A5C" />
            </div>
          </div>

          <div className="absolute left-2 top-[26%] flex w-[46%] flex-col gap-1">
            <Label color="#2A2118">Skill 1</Label>
            <ProgressItem label="Web design" pct={90} color="#C9A25B" textColor="#8A7A5C" />
            <ProgressItem label="Graphic design" pct={80} color="#C9A25B" textColor="#8A7A5C" />
            <ProgressItem label="UI design" pct={70} color="#C9A25B" textColor="#8A7A5C" />

            <Label color="#2A2118">Skills 2</Label>
            <ProgressItem label="Teamwork" pct={85} color="#C9A25B" textColor="#8A7A5C" />
            <ProgressItem label="Leadership" pct={75} color="#C9A25B" textColor="#8A7A5C" />
          </div>

          <div className="absolute right-2 top-[26%] flex w-[46%] flex-col gap-1">
            <Label color="#2A2118">Education</Label>
            <span className="text-[4px] font-semibold text-[#8A7A5C]">1995 – 1998</span>
            <Line size={4} color="#8A7A5C">
              {LOREM_TINY}
            </Line>

            <Label color="#2A2118">Work Experience</Label>
            <span className="text-[4px] font-semibold text-[#8A7A5C]">1995 – 1998</span>
            <Line size={4} color="#8A7A5C">
              {LOREM_TINY}
            </Line>
          </div>

          <div className="absolute inset-x-2 top-[68%] flex flex-col gap-1">
            <Label color="#2A2118">Reference</Label>
            <Line size={4} color="#8A7A5C" weight="font-semibold">
              Person Full Name Here
            </Line>
            <Line size={4} color="#8A7A5C">
              General Manager · +123 4567 890
            </Line>
          </div>

          <div className="absolute inset-x-2 top-[82%] flex flex-col gap-[2px]">
            <Label color="#2A2118">Languages</Label>
            <div className="flex gap-1.5">
              {["EN", "FR", "ES", "DE"].map((l) => (
                <span
                  key={l}
                  className="flex h-[9px] w-[9px] items-center justify-center rounded-full border text-[3.5px] font-bold text-[#2A2118]"
                  style={{ borderColor: "#2A2118" }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    /* ---------------- 3. Teal-light / rounded photo (Elizabeth Harris) ---------------- */
    case "teal-light":
      return (
        <div className="relative h-full w-full overflow-hidden bg-white">
          <div className="absolute left-2 top-2 h-8 w-9 rounded-lg bg-[#EAF0FC] ring-1 ring-[#2DB5A3]/50" />
          <div className="absolute left-2 top-11 flex flex-col">
            <span className="text-[6.5px] font-extrabold leading-none text-[#1A2E44]">
              ELIZABETH <span className="text-[#2DB5A3]">HARRIS</span>
            </span>
            <span className="mt-[2px] text-[4px] font-semibold uppercase tracking-wide text-[#8B95A5]">
              Web Designer &amp; Developer
            </span>
          </div>

          <div className="absolute inset-x-2 top-[20%] flex flex-col gap-[2px]">
            <Label color="#1A2E44">Contact</Label>
            <ContactRow icon={Phone} text="+001 123 456 789" color="#8B95A5" iconColor="#2DB5A3" />
            <ContactRow icon={Mail} text="info@yourmail.com" color="#8B95A5" iconColor="#2DB5A3" />
            <ContactRow icon={MapPin} text="Street Name, Country" color="#8B95A5" iconColor="#2DB5A3" />
          </div>

          <div className="absolute left-2 top-[36%] flex w-[46%] flex-col gap-1">
            <Label color="#1A2E44">Skill</Label>
            <ProgressItem label="Web design" pct={90} color="#2DB5A3" />
            <ProgressItem label="UI design" pct={75} color="#2DB5A3" />
            <ProgressItem label="Animation" pct={60} color="#2DB5A3" />

            <Label color="#1A2E44">Languages</Label>
            <RatedItem label="French" filled={4} color="#2DB5A3" />
            <RatedItem label="English" filled={5} color="#2DB5A3" />
          </div>

          <div className="absolute right-2 top-[36%] flex w-[46%] flex-col gap-1">
            <Label color="#1A2E44">Reference</Label>
            <Line size={4} weight="font-semibold">
              Person Full Name
            </Line>
            <Line size={4}>General Manager</Line>
            <Line size={4}>+123 4567 890</Line>
          </div>

          <div className="absolute inset-x-2 top-[62%] flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label color="#1A2E44">Education</Label>
            </div>
            <div className="flex items-center justify-between">
              <Line size={4} weight="font-semibold" color="#1A2E44">
                Master&rsquo;s Degree
              </Line>
              <span className="text-[4px] font-semibold text-[#2DB5A3]">2015</span>
            </div>
            <div className="flex items-center justify-between">
              <Line size={4} weight="font-semibold" color="#1A2E44">
                Bachelor&rsquo;s Degree
              </Line>
              <span className="text-[4px] font-semibold text-[#2DB5A3]">2012</span>
            </div>
          </div>

          <div className="absolute inset-x-2 top-[82%] flex flex-col gap-1">
            <Label color="#1A2E44">Work Experience</Label>
            <div className="flex items-center justify-between">
              <Line size={4} weight="font-semibold" color="#1A2E44">
                Job Position / Title Here
              </Line>
              <span className="text-[4px] font-semibold text-[#2DB5A3]">2010–2014</span>
            </div>
          </div>
        </div>
      );

    /* ---------------- 4. Navy / oval photo top (Name Surname) ---------------- */
    case "navy-white-circle":
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#132132]">
          <div className="absolute left-1/2 top-2 h-9 w-11 -translate-x-1/2 rounded-[50%] bg-white" />
          <div className="absolute left-1/2 top-[19%] -translate-x-1/2 whitespace-nowrap text-center">
            <span className="text-[6.5px] font-extrabold tracking-wide text-white">
              NAME <span className="text-[#22C55E]">SURNAME</span>
            </span>
            <div className="mt-[1px] text-[4px] font-semibold uppercase tracking-wide text-[#9FB0C3]">
              Graphics &amp; Web Designer
            </div>
          </div>

          <div className="absolute left-2 top-[28%] flex w-[42%] flex-col gap-1">
            <Label color="#FFFFFF">Contacts</Label>
            <ContactRow icon={MapPin} text="City, Country" color="#9FB0C3" />
            <ContactRow icon={Phone} text="+000 0000 000" color="#9FB0C3" />
            <ContactRow icon={Mail} text="example@mail.com" color="#9FB0C3" />

            <Label color="#FFFFFF">Languages</Label>
            <RatedItem label="French" filled={4} color="#22C55E" textColor="#9FB0C3" />
            <RatedItem label="English" filled={5} color="#22C55E" textColor="#9FB0C3" />

            <Label color="#FFFFFF">Skills</Label>
            <RatedItem label="Creativity" filled={5} color="#22C55E" textColor="#9FB0C3" />
            <RatedItem label="Teamwork" filled={4} color="#22C55E" textColor="#9FB0C3" />
          </div>

          <div className="absolute right-2 top-[28%] flex w-[46%] flex-col gap-1">
            <BannerLabel icon={User} bg="#1E3A54">Profile</BannerLabel>
            <Line size={4} color="#B9C6D6">
              {LOREM_TINY}
            </Line>

            <BannerLabel icon={GraduationCap} bg="#1E3A54">Educations</BannerLabel>
            {["2015", "2017"].map((y) => (
              <div key={y} className="flex items-center justify-between">
                <Line size={4} color="#B9C6D6">{LOREM_TINY}</Line>
                <span className="text-[3.5px] font-bold text-[#22C55E]">{y}</span>
              </div>
            ))}

            <BannerLabel icon={BriefcaseIcon} bg="#1E3A54">Employment</BannerLabel>
            {["2015", "2018"].map((y) => (
              <div key={y} className="flex items-center justify-between">
                <span className="text-[4px] font-semibold text-white">Job Title Here</span>
                <span className="text-[3.5px] font-bold text-[#22C55E]">{y}</span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-1.5 left-2">
            <HobbyIcons color="#22C55E" />
          </div>
        </div>
      );

    /* ---------------- 5. Navy / teal blob photo (Ben K Obler) ---------------- */
    case "navy-teal-blob":
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#0F1B27]">
          <div className="absolute right-2 top-2 h-9 w-9 rounded-full bg-[#2DB5A3]/85" />
          <div className="absolute left-2 top-2 flex flex-col">
            <span className="text-[6.5px] font-extrabold leading-none text-white">
              BEN <span className="text-[#2DB5A3]">K OBLER</span>
            </span>
            <span className="mt-[2px] text-[4px] font-semibold uppercase tracking-wide text-[#7E93A6]">
              Graphics &amp; Web Designer
            </span>
          </div>

          <div className="absolute left-2 top-[18%] flex w-[56%] flex-col gap-1">
            <Label color="#2DB5A3">Work Experience</Label>
            {[1, 2].map((n) => (
              <div key={n} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[4.5px] font-bold text-white">Job Position / Title Here</span>
                  <span className="text-[3.5px] font-semibold text-[#2DB5A3]">2010–2014</span>
                </div>
                <Line size={4} color="#7E93A6">
                  {LOREM_TINY}
                </Line>
              </div>
            ))}

            <Label color="#2DB5A3">Education</Label>
            {[1, 2].map((n) => (
              <Line key={n} size={4} color="#7E93A6" weight="font-semibold">
                Master&rsquo;s Degree — University Name
              </Line>
            ))}
          </div>

          <div className="absolute right-2 top-[18%] flex w-[36%] flex-col gap-1">
            <Label color="#2DB5A3">Contacts</Label>
            <ContactRow icon={MapPin} text="Washington DC" color="#7E93A6" iconColor="#2DB5A3" />
            <ContactRow icon={Phone} text="+123 4567 890" color="#7E93A6" iconColor="#2DB5A3" />
            <ContactRow icon={Mail} text="mail@domain.com" color="#7E93A6" iconColor="#2DB5A3" />

            <Label color="#2DB5A3">Profile</Label>
            <Line size={4} color="#7E93A6">
              {LOREM_TINY}
            </Line>

            <Label color="#2DB5A3">Reference</Label>
            <Line size={4} color="#7E93A6" weight="font-semibold">
              Person Full Name
            </Line>
            <Line size={4} color="#7E93A6">
              General Manager
            </Line>
          </div>

          <div className="absolute inset-x-2 bottom-2 flex flex-col gap-[3px]">
            <Label color="#2DB5A3">Skills</Label>
            <div className="grid grid-cols-3 gap-x-2 gap-y-[2px]">
              <RatedItem label="Creativity" filled={5} color="#2DB5A3" textColor="#7E93A6" />
              <RatedItem label="Teamwork" filled={4} color="#2DB5A3" textColor="#7E93A6" />
              <RatedItem label="Leadership" filled={4} color="#2DB5A3" textColor="#7E93A6" />
            </div>
          </div>
        </div>
      );

    /* ---------------- 6. Navy / oval photo top, yellow accent (variant of 4) ---------------- */
    case "navy-white-circle-2":
    default:
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#13233A]">
          <div className="absolute left-1/2 top-2 h-9 w-11 -translate-x-1/2 rounded-[50%] bg-white" />
          <div className="absolute left-1/2 top-[19%] -translate-x-1/2 whitespace-nowrap text-center">
            <span className="text-[6.5px] font-extrabold tracking-wide text-white">
              NAME <span className="text-[#F5B32C]">SURNAME</span>
            </span>
            <div className="mt-[1px] text-[4px] font-semibold uppercase tracking-wide text-[#9FB0C3]">
              Graphics &amp; Web Designer
            </div>
          </div>

          <div className="absolute left-2 top-[28%] flex w-[42%] flex-col gap-1">
            <Label color="#FFFFFF">Contacts</Label>
            <ContactRow icon={MapPin} text="City, Country" color="#9FB0C3" />
            <ContactRow icon={Phone} text="+000 0000 000" color="#9FB0C3" />
            <ContactRow icon={Mail} text="example@mail.com" color="#9FB0C3" />

            <Label color="#FFFFFF">Languages</Label>
            <RatedItem label="Spanish" filled={4} color="#F5B32C" textColor="#9FB0C3" />
            <RatedItem label="English" filled={5} color="#F5B32C" textColor="#9FB0C3" />

            <Label color="#FFFFFF">Skills</Label>
            <RatedItem label="Management" filled={4} color="#F5B32C" textColor="#9FB0C3" />
            <RatedItem label="Communication" filled={5} color="#F5B32C" textColor="#9FB0C3" />
          </div>

          <div className="absolute right-2 top-[28%] flex w-[46%] flex-col gap-1">
            <BannerLabel icon={Award} bg="#274058">Awards</BannerLabel>
            {["2015", "2017"].map((y) => (
              <div key={y} className="flex items-center justify-between">
                <Line size={4} color="#B9C6D6">{LOREM_TINY}</Line>
                <span className="text-[3.5px] font-bold text-[#F5B32C]">{y}</span>
              </div>
            ))}

            <BannerLabel icon={BriefcaseIcon} bg="#274058">Employment</BannerLabel>
            {["2015", "2018"].map((y) => (
              <div key={y} className="flex items-center justify-between">
                <span className="text-[4px] font-semibold text-white">Job Title Here</span>
                <span className="text-[3.5px] font-bold text-[#F5B32C]">{y}</span>
              </div>
            ))}

            <BannerLabel icon={GraduationCap} bg="#274058">Educations</BannerLabel>
            <Line size={4} color="#B9C6D6">
              {LOREM_TINY}
            </Line>
          </div>

          <div className="absolute bottom-1.5 left-2">
            <HobbyIcons color="#F5B32C" />
          </div>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Page component                                                       */
/* ------------------------------------------------------------------ */
export default function SampleCVPage() {
  return (
    <div className={`${inter.className} min-h-screen`} style={{ backgroundColor: COLORS.bg }}>
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-7">
        {/* Top row: breadcrumb tag + back button */}
        <div className="flex flex-col gap-3">
          <span
            className="w-fit rounded-full px-3 py-1 text-[11px] font-bold"
            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          >
            Sample CV
          </span>
          <button
            type="button"
            className="flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-sm transition hover:brightness-95"
            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
          >
            <ChevronLeft size={14} strokeWidth={3} />
            BACK
          </button>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm sm:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 border-b border-[#EEF1F6] pb-4 sm:w-36 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <p className="mb-3 text-[10px] font-bold tracking-wider text-[#B7BFCC]">
              MAIN MENU
            </p>
            <nav className="flex flex-row flex-wrap gap-x-4 gap-y-2.5 sm:flex-col sm:flex-nowrap">
              {NAV_ITEMS.map(({ label, icon: Icon }) => {
                const isActive = label === ACTIVE_LABEL;
                return (
                  <button
                    key={label}
                    type="button"
                    className="flex items-center gap-2 text-left text-[11px] transition"
                    style={{
                      color: isActive ? COLORS.yellow : "#9AA3B2",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <Icon size={14} strokeWidth={2} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* CV thumbnail grid */}
            <div className="grid grid-cols-2 gap-4">
              {SAMPLE_CVS.map((cv) => (
                <div
                  key={cv.id}
                  className="aspect-[3/4] w-full overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 transition hover:shadow-lg"
                >
                  <CVThumbnail theme={cv.theme} />
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div
              className="relative mt-6 overflow-hidden rounded-3xl px-6 pb-6 pt-5"
              style={{ backgroundColor: COLORS.yellow }}
            >
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-white/90">
                Get Best Employee
              </span>
              <h2 className="text-xl font-extrabold leading-tight" style={{ color: COLORS.green }}>
                Apply Now!
              </h2>
              <p className="text-base font-extrabold leading-tight text-white">
                520+ company searching for you
              </p>
              <p className="mt-2 max-w-[65%] text-[11px] leading-snug text-white/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etsi
                elit lacus faucibus vulputate viverra pulvinar id non quisque.
              </p>

              {/* People image mock */}
              <div
                className="pointer-events-none absolute -right-4 bottom-0 h-36 w-36 overflow-hidden rounded-full border-4 border-white/40"
                style={{
                  background:
                    "linear-gradient(160deg, #1A2E44 0%, #2E4258 55%, #22C55E 100%)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[10px] font-semibold text-white/70">
                    photo
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-start gap-2">
                <button
                  type="button"
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-95"
                  style={{ backgroundColor: COLORS.green }}
                >
                  Upload CV
                </button>
                <a
                  href="#"
                  className="text-[11px] font-semibold text-white underline underline-offset-2"
                >
                  looking for us employee?
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}