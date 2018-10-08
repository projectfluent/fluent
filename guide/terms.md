# Terms

Terms are similar to regular messages but they can only be used as references
in other messages. Their identifiers start with a single dash `-` like in the
example above: `-brand-name`. The runtime cannot retrieve terms directly.
They are best used to define vocabulary and glossary items which can be used
consistently across the localization of the entire product.

```
-brand-name = Firefox

app-title = { -brand-name }
has-updated = { -brand-name } has been updated.
```

## Terms and Variants

Values of terms may have multiple [variants](variants.html), including the
default variant marked with an asterisk (`*`). For instance, variants may
correspond to different grammatical cases.

```
-brand-name =
    {
       *[nominative] Firefox
        [accusative] Firefoxa
    }

app-title = { -brand-name }
restart-app = Zrestartuj { -brand-name[accusative] }.
```

Use variants to define different _facets_ of the term's value. Variants
are essentially the same value, just in slightly different forms to make it
grammatically correct when used inside of other messages.

## Terms and Attributes

Sometimes other translations might vary depending on some grammatical trait
of a term references in them. Terms can store this grammatical information
about themselves in [attributes](attributes.html). In the example below the
form of the past tense of _has been updated_ depends on the grammatical
gender of `-brand-name`.

```
-brand-name = Aurora
    .gender = feminine

has-updated =
    { -brand-name.gender ->
        [masculine] { -brand-name} został zaktualizowany.
        [feminine] { -brand-name } została zaktualizowana.
       *[other] Program { -brand-name } został zaktualizowany.
    }
```

Use attributes to describe grammatical traits and properties. Genders,
animacy, whether the term message starts with a vowel or not etc. Attributes
of terms are private and cannot be retrieved by the localization runtime.
They can only be used as [selectors](selectors.html).
