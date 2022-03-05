exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@material-ui/styled-engine': '@material-ui/styled-engine-sc',
      },
    },
  })
}
