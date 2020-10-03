const path = require('path');

module.exports = {
  '*.{js,ts,html,css,scss,json,md}': files => {
    const cwd = process.cwd();
    const relativePaths = files.map(file => path.relative(cwd, file));

    return [
      `nx format:write --files="${relativePaths.join(',')}"`,
      `nx affected:lint --files="${relativePaths.join(',')}" --fix --parallel`
    ];
  }
};
