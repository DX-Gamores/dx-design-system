/** Stand-in content for a page. Replace it with your own. */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <h1 className="text-heading-h2">{title}</h1>
      <div aria-hidden className="grid gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-container bg-surface-subtle" />
        <div className="aspect-video rounded-container bg-surface-subtle" />
        <div className="aspect-video rounded-container bg-surface-subtle" />
      </div>
      <div aria-hidden className="min-h-96 flex-1 rounded-container bg-surface-subtle" />
    </div>
  );
}
