# Fynance - Student Life tracker themed app

- ## Features list
1. Transaction creation
1. Budget creation
1. Currency conversion
1. Transaction listing (includes searching and sorting)
1. Budget listing (includes searching and sorting)

- ## Regex Catalog
1. ^(0|[1-9]\d*)(\.\d{1,2})?$ - For numeric keys (Valid examples: 4 or 4.99)
1. /^\S(?:.*\S)?$/ - To avoid trailing/leading spaces and collapse doubles (Invalid examples: " test " or "test ") in transaction descriptions
1. ^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$ - To validate date input (Valid example: 2026-06-25)
1. /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ - To only allow letters, spaces and hyphens only in budget names and category names (Valid examples: "test-category" or "category")
1. \b(\w+)\s+\1\b - To deny budget names from containing duplicate words (Invalid examples: "test test" or "asd asd" Valid examples: "test" or "asd test")

- ## Keyboard map
1. To focus on the next element use the "TAB" key.
1. To focus on the previous element use the "SHIFT+TAB" shortcut.
1. To click an element use "ENTER or RETURN" key

- ## Accessibility notes
1. This app uses aria-labels in the app to indicate "assertive" and "polite" statuses
1. You can use the app with only your keyboard alone

- ## How to run tests
1. To run end-to-end tests you can visit the app's link [here](https://xchlomix.github.io/)

- ## Links
1. Links to "seed.json" [here](https://drive.google.com/file/d/1IDmAL8KpvV__IzPgQ6K9SmXSrn0vNv1z/view?usp=sharing)
2. Link to assignment report [here](https://drive.google.com/file/d/157bbcCdJq0HEABiZOBfejkdhRWWQO2MM/view?usp=sharing)
3. Link to the youtube video [here](https://youtu.be/hg7oK1bM2YI)