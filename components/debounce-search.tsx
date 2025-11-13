"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

function DebounceSearch() {
  const [text, setText] = useState<string>("");
  const [debouncedValue] = useDebounce(text, 1000);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set("q", debouncedValue);
      params.set("page", "1"); // Reset page when searching
    } else {
      params.delete("q"); // Remove query parameter if input is empty
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedValue, pathname, router, searchParams]);

  return (
    <Input
      className="w-[100%] border-[#00000048] shadow-[0_0_0.2rem_0_rgba(0,0,0,0.2)]"
      placeholder="Cari NIM"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

export default DebounceSearch;
