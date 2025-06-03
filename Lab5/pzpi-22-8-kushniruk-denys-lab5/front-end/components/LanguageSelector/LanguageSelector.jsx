"use client";

import { Fragment, useState, useTransition } from "react";
import { Listbox, Transition } from "@headlessui/react";
import FlagIcon from "./FlagIcon";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

const languages = [
  { code: "ua", label: "UA", flag: "ua" },
  { code: "en", label: "EN", flag: "gb" },
];

const LanguageSelector = () => {
  const [selected, setSelected] = useState(
    languages.find((l) => l.code === useLocale()) || languages[0]
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (lang) => {
    startTransition(() => {
      setSelected(lang);
      router.replace({ pathname }, { locale: lang.code });
    });
  };

  return (
    <div className="w-28">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#242424] py-2 pl-10 pr-8 text-left shadow focus:outline-none">
            <span className="absolute left-2 top-1/2 -translate-y-1/2">
              <FlagIcon countryCode={selected.flag} />
            </span>
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              &#9662;
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white dark:bg-[#242424] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {languages.map((lang) => (
                <Listbox.Option
                  key={lang.code}
                  value={lang}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-blue-100 text-blue-900 dark:bg-[#363636] dark:text-white"
                        : "text-gray-900 dark:text-white"
                    }`
                  }
                >
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    <FlagIcon countryCode={lang.flag} />
                  </span>
                  <span className="block truncate">{lang.label}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default LanguageSelector;
