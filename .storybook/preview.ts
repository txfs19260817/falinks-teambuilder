import type { Preview } from "@storybook/react";
import "@/styles/global.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      router: {
        basePath: "",
      },
    },
  },
};

export default preview;
