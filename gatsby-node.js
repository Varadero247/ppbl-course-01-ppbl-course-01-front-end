exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        experiments: {
            asyncWebAssembly: true,
        },
    });
  };