#!/usr/bin/env node

const args = require('args');

const DEFAULT_COMPILE_DIR = 'contracts/';

args
.option('output', 'The directory to compile the contracts into', DEFAULT_COMPILE_DIR)

const flags = args.parse(process.argv)

const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

const saveToFile = (data, filename, dir = 'data/') => {
  const projectRoot = path.resolve(process.cwd());
  const dirpath = path.resolve(projectRoot, dir);
  fs.ensureDirSync(dirpath);

  const outputPath = path.resolve(dirpath, filename);
  console.log(`Writing json contract to ${dir}/${filename}`);
  return fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
};

const pathGlob = args.sub[0] || '**/*.contract.js';
const outputDir = args.output || DEFAULT_COMPILE_DIR;
const options = {
  ignore: [
    'node_modules/**/*',
    `${outputDir}**/*`,
  ],
};

glob(pathGlob, options, function (err, files) {
  files.forEach(function (file) {
    const { dir, name } = path.parse(file);
    const data = require(path.resolve(process.cwd(), file));
    saveToFile(data, `${name}.js`, path.join(outputDir, dir));
  });
});
