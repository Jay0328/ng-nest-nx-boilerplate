module.exports = {
  '*.@(js|ts)': ['prettier --write', 'eslint --fix'],
  '*.@(json|md)': ['prettier --write']
};
