import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "AtomicCD",
  tagline: "AtomicCD Documentation",
  favicon: "img/logo.jpg",

  // Set the production url of your site here
  url: "https://atomiccd.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  organizationName: "AtomicCD", // Usually your GitHub org/user name.
  projectName: "AtomicCD-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",

          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      // title: "My Site",
      logo: {
        alt: "AtomicCD",
        src: "img/logo.jpg",
      },
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Home",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Linkedin",
              href: "https://www.linkedin.com/in/as142000",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "AtomicCD",
              href: "https://github.com/iam-anshul/AtomicCD",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AtomicCD.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
