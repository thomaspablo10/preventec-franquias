import { getYoutubeThumbnailUrl } from "@/lib/public-blog";

type BlogCardMediaProps = {
  mediaType: "IMAGE" | "YOUTUBE" | null;
  mediaUrl: string | null;
  title: string;
};

export function BlogCardMedia({
  mediaType,
  mediaUrl,
  title,
}: BlogCardMediaProps) {
  if (!mediaType || !mediaUrl) {
    return (
      <div className="h-full w-full bg-slate-100" />
    );
  }

  if (mediaType === "IMAGE") {
    return (
      <img
        src={mediaUrl}
        alt={title}
        className="h-full w-full object-cover"
      />
    );
  }

  if (mediaType === "YOUTUBE") {
    const thumbnail = getYoutubeThumbnailUrl(mediaUrl);

    if (!thumbnail) {
      return <div className="h-full w-full bg-slate-100" />;
    }

    return (
      <div className="relative h-full w-full">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            Vídeo
          </div>
        </div>
      </div>
    );
  }

  return <div className="h-full w-full bg-slate-100" />;
}