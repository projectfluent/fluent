export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

build:
	@mkdir -p build/spec
	@cp spec/diagram.xhtml build/spec
	@gitbook build guide build/guide

serve:
	@serve build

deploy: build
	@gh-pages -d build

clean:
	@rm -rf build

.PHONY: build
