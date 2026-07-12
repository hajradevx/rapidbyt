import { defineAppConfig } from "nuxt/app";

export default defineAppConfig({
  ui: {
    colors: {
      primary: "sky",
      neutral: "zinc",
    },
    button: {
      defaultVariants: {
        color: "primary",
      },
    },
  },
});
