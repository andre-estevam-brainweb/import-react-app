# import-react-app

`import-react-app` is an easy way to automate the process of copying your built React App to your
backend. Generally, this isn't a hard process; it's just inconvenient. The simplest way to solve it
is manually, like so:

```shell
~              $ ls
my-backend my-react-app
~              $ cd my-react-app
~/my-react-app $ git pull
~/my-react-app $ yarn build
~/my-react-app $ cp build/static ../my-backend/static
~/my-react-app $ cp build/favicon.ico ../my-backend/static/favicon.ico
~/my-react-app $ cp build/index.html ../my-backend/views/react-app.html
```

Now, you have to do that every time you update your React App. What about your team? Does everyone
do it manually? You may check it into source control...

```shell
~/my-react-app $ cd ../my-backend
~/my-backend   $ git add -A && git commit -m "Added the react app" && git push
```

...However, it doesn't feel right to commit it. After all, the React App is not part of your
backend.

This is the problem that `import-react-app` aims to solve. It reads a git repository from your
backend's `package.json`:

```json
{
	"scripts": {
		"react-import": "import-react-app"
	},
	"import-react-app-apps": {
		"myApp": "git@github.com:<your_username>/<your_react_app>.git"
	}
}
```

After you run `yarn react-import` or `npm run react-import`, `import-react-app` will clone the
repository on a temporary folder, install the dependencies, build the app by running the `build`
script, and will copy the result to the `views` and `static` folders.

Although this process takes a significant amount of time, it is a convenient way to do it and easy
to integrate with your build process.

## Usage

First install the package:

```shell
$ yarn add --dev import-react-app
# or
$ npm install --save-dev import-react-app
```

Then add the following section to your `package.json`:

```json
{
	"import-react-app-apps": {
		"appName": "git@github.com:<your_username>/<your_react_app>.git"
	}
}
```

*Note: you may use the HTTP version of the git repository url as well.*

If you want, you can add a script to your `package.json` as well:

```json
{
	"scripts": {
		"react-import": "import-react-app"
	}
}
```

Otherwise you can run it with `node ./node_modules/import-react-app/index.js`.

## Why not commit the built react app

Indeed, committing it is easier, since you only need to clone the repository, and don't need an
extra step. However, the same can be said about committing `node_modules`. It would be easier to
simply clone, instead of cloning and installing. But on larger projects it isn't right to commit it;
it just doesn't belong in source control.

You might argue that this is just personal preference, and you'd be right. But the great thing about
`import-react-app` is that you can still use the method you've been using until now! :)