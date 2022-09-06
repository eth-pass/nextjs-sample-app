#!/usr/bin/env node

/***
 * NPX SCRIPT
 * This script is deployed to npm, and allows the user to clone this repository by running `npx @ethpass/create-ethpass-nextjs-app`
 * To re-publish the script to npm, run `npm publish --access=public`
 */
const { execSync } = require('child_process')

const runCommand = command => {
    try {
        // runs command, and waits for it to complete
        // stdio inherit: prints command output to the terminal
        execSync(`${command}`, { stdio: 'inherit' })
    } catch (e) {
        console.error(`Failed to execute ${command}`, e)
        return false
    }
    return true
}

const repoName = process.argv[2] ?? 'ethpass-nextjs-app'
const gitCloneCommand = `git clone --depth 1 https://github.com/eth-pass/nextjs-sample-app ${repoName}`


console.log(`Cloning the repository with name ${repoName}`)
const cloned = runCommand(gitCloneCommand)
if (!cloned) process.exit(-1)

console.log('Successfully cloned the ethpass sample app!')
console.log(`To get started: cd ${repoName} && yarn install`)
console.log(`Start the app with: yarn dev`)


