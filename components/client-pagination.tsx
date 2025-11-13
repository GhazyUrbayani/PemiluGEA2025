"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface ClientPaginationProps {
  total: number; // Length of filtered data
  totalPerPage: number; // Total data per page
  animate?: boolean;
}

const ClientPagination = ({
  total,
  totalPerPage,
  animate,
  ...props
}: ClientPaginationProps) => {
  // Search params
  const searchParams = useSearchParams();

  // Path name
  const pathname = usePathname();

  // If there's no data, don't render pagination
  if (total == 0) return <></>;

  // Get page from search params
  const page = parseInt(searchParams.get("page") ?? "1") ?? 1;

  // Calculate previous and next page
  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(Math.ceil(total / totalPerPage), page + 1);

  // Check if previous and next page is disabled
  const isPreviousDisabled = page === 1;
  const isNextDisabled = page === Math.ceil(total / totalPerPage);

  // Number mapper
  const pageMapper: number[] = [];
  const totalPage = Math.ceil(total / totalPerPage);
  if (totalPage <= 5) {
    for (let i = 0; i < totalPage; i++) {
      pageMapper.push(i);
    }
  } else {
    if (page <= 3) {
      for (let i = 0; i < 5; i++) {
        pageMapper.push(i);
      }
    } else if (page >= totalPage - 2) {
      for (let i = totalPage - 5; i < totalPage; i++) {
        pageMapper.push(i);
      }
    } else {
      for (let i = page - 3; i < page + 2; i++) {
        pageMapper.push(i);
      }
    }
  }

  // URL Creator
  const getTargetURL = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    return `${pathname}?${newSearchParams.toString()}`;
  };

  return (
    <Pagination data-aos={animate ? "fade-up" : undefined} {...props}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem
          className={
            isPreviousDisabled ? "pointer-events-none opacity-50" : undefined
          }
        >
          <PaginationPrevious
            href={getTargetURL(previousPage)}
            aria-disabled={isPreviousDisabled}
            tabIndex={isPreviousDisabled ? -1 : undefined}
            className="text-white"
          />
        </PaginationItem>

        {/* Page numbers */}
        {pageMapper.map((num, idx) => (
          <PaginationItem key={`${num}_${idx}`}>
            <PaginationLink
              href={getTargetURL(num + 1)}
              isActive={page === num + 1}
              className="bg-[#151515] text-white"
            >
              {num + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem
          className={
            isNextDisabled ? "pointer-events-none opacity-50" : undefined
          }
        >
          <PaginationNext
            href={getTargetURL(nextPage)}
            aria-disabled={isNextDisabled}
            tabIndex={isNextDisabled ? -1 : undefined}
            className="text-white"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export { ClientPagination };
