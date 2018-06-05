# Sapper Studio

*This is highly experimental, highly incomplete, and completely undocumented. Expect bugs! For now, a traditional development setup will be more productive. That will change.*


## Rethinking web development

It's a little weird that the process of creating websites — which are inherently visual and interactive — is so heavily centered on the command-line and on [blindly manipulating symbols](https://vimeo.com/66085662). Previous attempts to improve programming workflows have focused on novel languages and editing paradigms, but they have not become mainstream.

The hypothesis behind Sapper Studio is twofold:

* we already have all the pieces to create a more modern development workflow, but we haven't quite put them together
* a developer environment that is deeply integrated with a particular framework allows novel features that aren't possible in the context of a general-purpose IDE


## Running

Sapper Studio is an Electron app. For now, you'll need to clone this repo and run it locally; there is no pre-packaged version.

```bash
git clone https://github.com/sveltejs/sapper-studio.git
cd sapper-studio
yarn
yarn build
yarn start
```

This will open the launcher window, where you can select an existing Sapper project on your machine, or create a new one.


## Using

Sapper Studio uses [svelte-subdivide](https://github.com/sveltejs/svelte-subdivide) for layout. While pressing the Cmd key, drag from the edge of a 'pane' to create a new one. (TODO demo this with gifs, and improve the interface itself.) Select a new pane type from the dropdown in the pane's top-left corner.


## Roadmap/ideas

* Integrated devtools
* Responsive design mode, with browsersync between panes
* Integrated server profiler/debugger
* Webpack bundle analysis
* Auto-fixes ("it looks like you mistyped 'oncreate'. __Click here__ to fix")
* WYSIWYG editing
* Automated testing
* Integrated component marketplace
* Isolated component editor
* Design improvements
* and lots more


## License

[LIL](LICENSE)
