-simple-identifier =
    {
       *[key] value
    }

-identifier-surrounded-by-whitespace =
    {
       *[     key     ] value
    }

-int-number =
    {
       *[1] value
    }

-float-number =
    {
       *[3.14] value
    }

# ERROR
-invalid-identifier =
    {
       *[two words] value
    }

# ERROR
-invalid-int =
    {
       *[1 apple] value
    }

# ERROR
-invalid-int =
    {
       *[3.14 apples] value
    }
