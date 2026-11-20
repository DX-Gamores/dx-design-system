/**
 * @title Pagination
 * @description Move between pages of a long list, with a summary of what is shown.
 */
"use client";
import { useState } from "react";
import { Pagination } from "@/components/ui/nav-extra";

export default function Example() {
  const [page, setPage] = useState(1);
  const from = (page - 1) * 10 + 1;
  return <Pagination page={page} pageCount={5} onPageChange={setPage} summary={`Showing ${from}–${Math.min(page * 10, 48)} of 48`} />;
}
