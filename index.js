"use strict"

const path       = require("path")
	, { exec }   = require("child_process")
	, fs         = require("fs")
	, simpleGit  = require("simple-git")

module.exports = async () => {

	try {

		const rootDir = path.resolve(path.dirname(require.main.filename))
		const reactDir = path.join(rootDir, "import-react-app-tmp")
		const pkg = require(path.join(rootDir, "package.json"))

		if (!pkg || !pkg["import-react-app-apps"] || !pkg["import-react-app-apps"][0]) {

			console.error("You need to have the react app repo defined in your package.json!")
			process.exit(1)

		}

		await makeDir(reactDir)

		console.log(`Cloning ${pkg["import-react-app-apps"][0]}...`)
		await gitClone(pkg["import-react-app-apps"][0], reactDir)

		setTimeout(async () => {
			console.log("Installing dependencies...")
			await npmInstall(reactDir)
		}, 5000)

	} catch (e) {

		console.error("An unexpected error has occurred!")
		console.error(e)

	}

}

async function makeDir(path, mode = 0o777) {

	fs.mkdir(path, mode, (err, result) => {

		if (err) {

			throw err

		} else {

			return result

		}

	})

}

async function gitClone(gitRepo, destinationPath, options = []) {

	const git = simpleGit(destinationPath)

	//noinspection JSUnresolvedFunction
	git.clone(gitRepo, ".", options, (err, response) => {

		if (err) {

			throw err

		} else {

			return response

		}

	})

}

async function npmInstall(path) {

	process.chdir(path)

	exec("npm install", (err, stdOut) => {

		if (err) {

			throw err

		} else {

			return stdOut

		}

	})

}