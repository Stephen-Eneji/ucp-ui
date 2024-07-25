#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');

const templateFilePath = path.join(__dirname, 'template.tsx');
const reactWidgetPath = path.join(__dirname, '../react/widgets');
const sassPath = path.join(__dirname, '../assets/styles/sass');

const argv = yargs
    .command('create', 'Create a new React component and SASS file', {
        name: {
            description: 'The name of the component',
            alias: 'n',
            type: 'string',
        }
    })
    .demandOption(['name'], 'Please provide a name for the component')
    .help()
    .alias('help', 'h')
    .argv;

const isValidName = (name) => /^[a-zA-Z0-9-]+$/.test(name);

if (!isValidName(argv.name)) {
    console.error('Invalid name. Only numbers, letters, and hyphens are allowed.');
    process.exit(1);
}

const componentName = argv.name;

const createComponent = async (name) => {
    const componentDir = path.join(reactWidgetPath, name);
    const componentFilePath = path.join(componentDir, 'index.tsx');
    const sassFilePath = path.join(sassPath, `${name}.scss`);

    try {
        await fs.ensureDir(componentDir);

        const templateContent = await fs.readFile(templateFilePath, 'utf-8');
        const componentContent = templateContent.replace(/{the-name-passed}/g, name);

        await fs.writeFile(componentFilePath, componentContent, 'utf-8');
        await fs.writeFile(sassFilePath, `/* Styles for ${name} */\n`, 'utf-8');

        console.log(`Component ${name} created successfully.`);
    } catch (error) {
        console.error(`Error creating component: ${error.message}`);
    }
};

createComponent(componentName);
