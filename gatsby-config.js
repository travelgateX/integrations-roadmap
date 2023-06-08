/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Travelgate Integrations Roadmap (beta)`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@arquio`,
    siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data`,
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'SERVER',
        fieldName: 'server',
        url: 'https://docs.travelgatex.com/integrations-roadmap/graphql', // Reemplaza con la URL de tu servidor GraphQL
      },
    },
  ],
};
