export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

build:
	@mkdir -p build/syntax
	@cp syntax/diagram.xhtml build/syntax
	@gitbook build guide build/guide

serve:
	@serve build

deploy: build
	@gh-pages -d build

clean:
	@rm -rf build

.PHONY: build
