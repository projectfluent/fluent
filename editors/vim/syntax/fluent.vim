if exists("b:current_syntax")
    finish
endif

syntax match fluentComment "\v#.*$"
syntax match fluentIdentifier "^\v[a-zA-Z-]+" nextgroup=fluentDelimiter
syntax match fluentDelimiter "\s*=\s*" contained skipnl nextgroup=fluentPattern
syntax region fluentPattern contained start="" end="\v^(( )@!|( +[\.\[\*\}])@=)" contains=fluentPlaceableExpression
syntax match fluentAttribute "\v\.[a-zA-Z-]+" nextgroup=fluentDelimiter
syntax region fluentPlaceableExpression contained matchgroup=fluentPlaceableBraces start=+{+ end=+}+ contains=@fluentExpression

syntax cluster fluentExpression contains=fluentBuiltin,fluentVariantEntry,fluentIdentifierExpression

syntax match fluentBuiltin contained "\v[A-Z]+(\()@="
syntax match fluentVariantEntry contained "\v\*?\[[a-z]+\]" nextgroup=fluentPattern
syntax match fluentIdentifierExpression contained "\v[a-zA-Z-]+"

highlight link fluentComment Comment
highlight link fluentIdentifier Identifier
highlight link fluentPattern String
highlight link fluentAttribute Keyword
highlight link fluentBuiltin Keyword
highlight link fluentVariantEntry Keyword
highlight link fluentIdentifierExpression Identifier

let b:current_syntax = "fluent"
