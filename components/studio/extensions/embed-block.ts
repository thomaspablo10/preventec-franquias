import { mergeAttributes, Node } from "@tiptap/core";

export const EmbedBlock = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      provider: {
        default: "youtube",
        parseHTML: (element) => element.getAttribute("data-provider") || "youtube",
      },
      url: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-url") || "",
      },
      embedUrl: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-embed-url") || "",
      },
      mode: {
        default: "horizontal",
        parseHTML: (element) => element.getAttribute("data-mode") || "horizontal",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed-block="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const provider = HTMLAttributes.provider || "youtube";
    const mode = HTMLAttributes.mode || "horizontal";
    const embedUrl = HTMLAttributes.embedUrl || "";
    const originalUrl = HTMLAttributes.url || "";

    const wrapperAttrs = mergeAttributes(HTMLAttributes, {
      "data-embed-block": "true",
      "data-provider": provider,
      "data-url": originalUrl,
      "data-embed-url": embedUrl,
      "data-mode": mode,
      class: `content-embed content-embed--${provider} content-embed--${mode}`,
    });

    if (provider === "instagram") {
      return [
        "div",
        wrapperAttrs,
        [
          "blockquote",
          {
            class: "instagram-media",
            "data-instgrm-permalink": originalUrl,
            "data-instgrm-version": "14",
            style:
              "background:#FFF; border:0; border-radius:12px; box-shadow:none; margin:0; max-width:540px; min-width:280px; width:100%;",
          },
          ["a", { href: originalUrl, target: "_blank", rel: "noopener noreferrer" }, "Ver no Instagram"],
        ],
      ];
    }

    return [
      "div",
      wrapperAttrs,
      [
        "div",
        { class: "content-embed__inner" },
        [
          "iframe",
          {
            src: embedUrl,
            title: `Embed ${provider}`,
            class: "content-embed__iframe",
            loading: "lazy",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            referrerpolicy: "strict-origin-when-cross-origin",
            allowfullscreen: "true",
          },
        ],
      ],
    ];
  },
});