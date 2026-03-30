import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const BodyImage = Image.extend({
  name: "bodyImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      display: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-display") || "center",
      },
      widthPreset: {
        default: "wide",
        parseHTML: (element) => element.getAttribute("data-width") || "wide",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const display = HTMLAttributes.display || "center";
    const widthPreset = HTMLAttributes.widthPreset || "wide";

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-display": display,
        "data-width": widthPreset,
        class: `content-body-image content-body-image--${display} content-body-image--${widthPreset}`,
      }),
    ];
  },
});