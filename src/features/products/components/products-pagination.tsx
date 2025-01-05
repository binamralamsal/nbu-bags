"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductsPagination({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  const searchParams = useSearchParams();

  function getUpdatedHref(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  }

  const paginationRange = generatePagination(currentPage, pageCount, 5);

  if (pageCount === 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={getUpdatedHref(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>
        )}
        {paginationRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getUpdatedHref(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pageCount > (paginationRange[paginationRange.length - 1] || 1) && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < pageCount && (
          <PaginationItem>
            <PaginationNext href={getUpdatedHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

function generatePagination(
  currentPage: number,
  totalPages: number,
  maxPages = 10,
) {
  let startPage, endPage;

  if (maxPages > totalPages) {
    maxPages = totalPages;
  }

  const halfWindow = Math.floor(maxPages / 2);

  if (currentPage <= halfWindow) {
    startPage = 1;
    endPage = Math.min(totalPages, maxPages);
  } else if (currentPage > totalPages - halfWindow) {
    startPage = totalPages - maxPages + 1;
    endPage = totalPages;
  } else {
    startPage = currentPage - halfWindow;
    endPage = currentPage + halfWindow - 1;
  }

  if (startPage < 1) {
    startPage = 1;
  }
  if (endPage > totalPages) {
    endPage = totalPages;
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}
