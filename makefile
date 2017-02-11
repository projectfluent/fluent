build:
	@mkdir -p build
	@cp docs/diagram.xhtml build
	@gitbook build guide build/guide

deploy:
	gh-pages -d build

.PHONY: build
