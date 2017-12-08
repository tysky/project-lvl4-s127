install:
	npm install

start:
		DEBUG="app" npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- server

publish:
	npm publish

lint:
	npm run eslint src

test:
	npm test

.PHONY: test
