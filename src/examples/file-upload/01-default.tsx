/**
 * @title File Upload
 * @description Drop files or choose them. Accepted types and size are shown up front; each file shows its progress or error.
 */
"use client";
import { useEffect, useState } from "react";
import { FileUpload, type UploadItem } from "@/components/ui/inputs-advanced";

export default function Example() {
  const [items, setItems] = useState<UploadItem[]>([]);
  // Fake upload progress for the demo.
  useEffect(() => {
    if (!items.some((i) => i.progress !== undefined && i.progress < 100)) return;
    const t = setTimeout(() => setItems((l) => l.map((i) => (i.progress !== undefined && i.progress < 100 ? { ...i, progress: Math.min(100, i.progress + 20) } : i))), 300);
    return () => clearTimeout(t);
  }, [items]);
  return (
    <div className="max-w-xl">
      <FileUpload
        accept=".pdf,.png,.jpg"
        maxSize="10MB"
        items={items}
        onFiles={(ok, bad) => setItems((l) => [...l, ...ok.map((file) => ({ file, progress: 0 })), ...bad])}
        onRemove={(f) => setItems((l) => l.filter((i) => i.file !== f))}
      />
    </div>
  );
}
