module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "demo",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "@chakra-ui/gatsby-plugin",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
