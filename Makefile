PHONY += default
default:

PHONY += setup-gh-deploy
setup-gh-deploy:
	trash public
	git worktree add public gh-pages

PHONY += gh-deploy
gh-deploy:
	gulp build
	cd public && git add --all :/
	cd public && git commit -m "Build $(shell date)"
	cd public && git push origin gh-pages

.PHONY: $(PHONY)
