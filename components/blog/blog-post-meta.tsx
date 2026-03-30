type BlogPostMetaProps = {
  authorName: string | null;
  authorRole: string | null;
  authorAvatarUrl?: string | null;
  publishedAt: string;
  categoryLabel: string;
  subcategoryLabel: string;
};

export function BlogPostMeta({
  authorName,
  authorRole,
  authorAvatarUrl,
  publishedAt,
  categoryLabel,
  subcategoryLabel,
}: BlogPostMetaProps) {
  const authorLabel = authorName || "Equipe Preventec";
  const authorInitial = authorLabel.charAt(0).toUpperCase();

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
      <div className="flex items-start gap-3">
        {authorAvatarUrl ? (
          <img
            src={authorAvatarUrl}
            alt={authorLabel}
            className="mt-0.5 h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
            {authorInitial}
          </div>
        )}

        <div className="leading-tight">
          <div className="font-medium text-slate-700">{authorLabel}</div>
          {authorRole ? (
            <div className="text-xs text-slate-500">{authorRole}</div>
          ) : null}
        </div>
      </div>

      <div className="text-xs text-slate-500">{publishedAt}</div>

      <div className="flex flex-wrap gap-2">
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {categoryLabel}
        </div>
        <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          {subcategoryLabel}
        </div>
      </div>
    </div>
  );
}