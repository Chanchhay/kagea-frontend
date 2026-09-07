"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { locales, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

const LOCALE_LABELS: Record<Locale, { short: string; full: string; flag: string }> = {
    en: { short: "EN", full: "English", flag: "/images/language/english-flag1.png" },
    km: { short: "KH", full: "ខ្មែរ", flag: "/images/language/cambodia-flag.png" },
};

export function LanguageToggle({ className }: { className?: string }) {
    const { locale, setLocale, t } = useLocale();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                data-language-switch
                className={cn(
                    "group flex h-11 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-heading transition-colors hover:border-brand/20 hover:bg-brand-tint hover:text-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                    className,
                )}
                aria-label={t("language.switch")}
            >
                <Image
                    src={LOCALE_LABELS[locale].flag}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={14}
                    unoptimized
                    className="size-4.5 rounded-[3px] object-cover ring-1 ring-black/10"
                />
                <span>{LOCALE_LABELS[locale].short}</span>
                <ChevronDown
                    aria-hidden="true"
                    className="size-3.5 text-muted-fg transition-transform group-aria-expanded:rotate-180"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5">
                {locales.map((code) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setLocale(code)}
                        className="justify-between text-body focus:bg-surface-muted focus:text-heading"
                    >
                        <span className="flex items-center gap-2.5">
                            <Image
                                src={LOCALE_LABELS[code].flag}
                                alt=""
                                aria-hidden="true"
                                width={20}
                                height={14}
                                unoptimized
                                className="size-4.5 rounded-[3px] object-cover ring-1 ring-black/10"
                            />
                            {LOCALE_LABELS[code].full}
                        </span>
                        {locale === code ? (
                            <Check aria-hidden="true" className="size-4 text-brand" />
                        ) : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
