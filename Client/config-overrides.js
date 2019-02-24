const { addLessLoader, override } = require("customize-cra");

module.exports = override(addLessLoader({ 
  javascriptEnabled: true,
  modifyVars: {   
    'layout-footer-background': '#C1BBBC',
    'layout-body-background': '#F2F2F2',
    'layout-header-background': '#FF183C',
    'primary-color': '#FF183C',
    'collapse-header-padding': '5px 0 5px 40px' 
  }
}))
  