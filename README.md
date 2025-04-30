# Welcome to LESSON 3

You can find the instructions for the lesson here:
https://jkoster.notion.site/Modern-Web-Apps-4ed40df5dab64edcb95e666155e10abc

## Local Development-Server
```shell
npx vite

# or

npx @web/dev-server --node-resolve --open  --watch
````

In case you get a "running scripts is disabled on this system ... see _Execution_Policies ..." Error
```shell
# fix execution policy error on windows when trying to execute npm scripts
# Open Windows Powershell as Administrator and run the following command
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

## SASS / SCSS
````shell
# Installing SASS compiler
npm install -D sass
# Running SASS compiler watching for changes
# sass --watch <input file> <output file>
sass --watch css/style.scss css/style.css

# modern alternative using vite
# (does same thing automatically if a scss file is linked in the index.html)
npx vite
````

## GIT - connect local git repository to GitHub
````shell
# Add a local git repository to github
git remote add origin <REMOTE-URL>
git add .
git commit -m "commit message"
git push origin main
````

## ESlint installation and usage
````shell
# Create package.json file and project configuration
npm init

# Create configuration and install packages for linting
npm init @eslint/config
# Running ESlint - check syntax, find problems, enforce code style of all JavaScript files
npx eslint "**/*.js" # detecting and linting errors as far as possible
npx eslint "**/*.js" --fix # actually fixing errors as far as possible
````

## Build and minify project for production / live system
````shell
# Run local development server with HMR and file watching (also compiles ".scss" files automatically)
npx vite

# Minifying, compiling and bundling our application for deployment on live system
# Builds project per default from "." folder to "dist" folder, uses "index.html" as entry point
npx vite build
````
