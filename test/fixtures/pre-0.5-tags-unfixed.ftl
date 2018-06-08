// In Syntax 0.4 and earlier, we had tags to denote grammatical properties.
// Not supported in archaelogy as we're parsing them as part of
// Value or Attribute values in 0.5+.
// Documenting that with a test.

// Just Value and Tag
key01 = Value
    #masculine

// Both Attribute and Tag used to be supported.
key02 = Value
    .label = Foo
    #masculine
