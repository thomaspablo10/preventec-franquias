import { getYoutubeEmbedUrl } from "@/lib/public-blog";

type BlogPostMediaProps = {
  mediaType: "IMAGE" | "YOUTUBE" | null;
  mediaUrl: string | null;
  title: string;
};

export function BlogPostMedia({
  mediaType,
  mediaUrl,
  title,
}: BlogPostMediaProps) {
  if (!mediaType || !mediaUrl) {
    return null;
  }

  if (mediaType === "IMAGE") {
    return (
      <div className="overflow-hidden rounded-2xl">
        <img
          src={mediaUrl}
          alt={title}
          className="h-auto w-full object-cover"
        />
      </div>
    );
  }

  if (mediaType === "YOUTUBE") {
    const embedUrl = getYoutubeEmbedUrl(mediaUrl);

    if (!embedUrl) {
      return null;
    }

    return (
      <div className="overflow-hidden rounded-2xl bg-black">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return null;
}