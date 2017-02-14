build:
	@mkdir -p build/syntax
	@cp syntax/diagram.xhtml build/syntax
	@gitbook build guide build/guide

deploy:
	@gh-pages -d build

clean:
	@rm -rf build

.PHONY: build
