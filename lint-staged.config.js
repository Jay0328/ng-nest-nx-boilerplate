module.exports = {
  '*.@(js|ts)': ['prettier --write', 'npm run lint -- --fix'],
  '*.@(json|md)': ['prettier --write']
};
