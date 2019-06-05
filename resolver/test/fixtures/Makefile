FTL_FIXTURES := $(wildcard *.ftl)
AST_FIXTURES := $(FTL_FIXTURES:%.ftl=%.json)

all: $(AST_FIXTURES)

.PHONY: $(AST_FIXTURES)
$(AST_FIXTURES): %.json: %.ftl
	@node ../../dist/bin/format.js --group $< \
		2> /dev/null \
		1> $@;
	@echo "$< → $@"
