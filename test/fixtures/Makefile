FTL_FIXTURES := $(wildcard *.ftl)
AST_FIXTURES := $(FTL_FIXTURES:%.ftl=%.json)

all: $(AST_FIXTURES)

.PHONY: $(AST_FIXTURES)
$(AST_FIXTURES): %.json: %.ftl
	@node --experimental-modules ../../bin/parse.mjs $< \
		2> /dev/null \
		1> $@;
	@echo "$< → $@"
