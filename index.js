#! /usr/bin/env node
"use strict"

if (!process.env.ROOT_DIRECTORY) {

	console.error("You need to define the ROOT_DIRECTORY environment variable to run this!")
	console.error("In order to do that, run:")
	console.error(`ROOT_DIRECTORY=. ${process.argv[0]} ${process.argv[1]}`)
	process.exit(1)

}

const path       = require("path")
	, { exec }   = require("child_process")
	, fs         = require("fs")
	, ncp        = require("ncp")
	, rimraf     = require("rimraf")
	, simpleGit  = require("simple-git")

const rootDir = path.resolve(process.env.ROOT_DIRECTORY)
const reactDir = path.join(rootDir, "import-react-app-tmp")

async function buildApp(appName, repo) {

	try {

		if ( !( await directoryExists(path.join(rootDir, "static")) ) ) {

			await makeDir(path.join(rootDir, "static"))

		}

		if ( !( await directoryExists(path.join(rootDir, "views")) ) ) {

			await makeDir(path.join(rootDir, "views"))

		}

		await makeDir(reactDir)

		console.log(`Cloning ${repo}...`)
		await gitClone(repo, reactDir)

		await wait(2500)

		process.chdir(reactDir)

		console.log("Installing dependencies... Please wait.")
		await execCommand("npm install")

		console.log("Building the react app... Please wait.")
		await execCommand("npm run build")

		await Promise.all([
			copy(
				path.join(reactDir, "build/static"),
				path.join(rootDir, "static")
			),
			copy(
				path.join(reactDir, "build/favicon.ico"),
				path.join(rootDir, "static/favicon.ico")
			),
			copy(
				path.join(reactDir, "build/index.html"),
				path.join(rootDir, `views/${appName}.html`)
			)
		])

		await removeDir(reactDir)

		console.log("Done! You can find your react-app in the folders 'static' and 'views'.")

	} catch (e) {

		console.error("An unexpected error has occurred!")
		console.error(e)

	}

}

const makeDir = (dirPath, mode = 0o777) => new Promise((resolve, reject) => {

	fs.mkdir(dirPath, mode, (err, result) => {

		if (err) {

			reject(err)

		} else {

			resolve(result)

		}

	})

})

const gitClone = (gitRepo, destinationPath, options = []) => new Promise((resolve, reject) => {

	//noinspection JSUnresolvedFunction
	simpleGit(destinationPath).clone(gitRepo, ".", options, (err, response) => {

		if (err) {

			reject(err)

		} else {

			resolve(response)

		}

	})

})

const execCommand = command => new Promise((resolve, reject) => {

	exec(command, (err, stdOut) => {

		if (err) {

			reject(err)

		} else {

			resolve(stdOut)

		}

	})

})

const wait = time => new Promise(resolve => {

	setTimeout(() => resolve(), time)

})

const copy = (sourceDir, targetDir) => new Promise((resolve, reject) => {

	ncp(sourceDir, targetDir, err => {

		if (err) {

			reject(err)

		} else {

			resolve()

		}

	})

})

const directoryExists = dirPath => new Promise((resolve, reject) => {

	fs.stat(dirPath, err => {

		if (err) {

			if (err.code === "ENOENT") {

				resolve(false)

			} else {

				reject(err)

			}

		} else {

			resolve(true)

		}

	})

})

const removeDir = dirPath => new Promise((resolve, reject) => {

	rimraf(dirPath, [], err => {

		if (err) {

			reject(err)

		} else {

			resolve()

		}

	})

})

let pkg

try {

	pkg = require(path.join(rootDir, "package.json"))

} catch(e) {

	console.error("You don't have a package.json file!")
	process.exit(1)

}

(async () => {

	if (!pkg || !pkg["import-react-app-apps"]) {

		console.error("You need to have the react app repo defined in your package.json!")
		process.exit(1)

	}

	for (let name in pkg["import-react-app-apps"]) {

		console.log(`Importing app '${name}'...`)
		await buildApp(name, pkg["import-react-app-apps"][name])
		console.log("")

	}

	console.log("All done!")

})()
