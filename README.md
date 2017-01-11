# Atom-JSON-Generator

## Todo

- [ ] Generate custom schema extending JSON with transformation methods
- [ ] Build Atom plugin with the following functional specifications:
  - [ ] Detect `*.liquid.json` files as being the files to interpret
  - [ ] Execute interpretation on file save
  - [ ] Export result of interpretation into `*.json` file
  - [ ] Throw errors if:
    - [ ] `*.liquid.json` is invalid syntax, following custom schema
    - [ ] Tokens or functions are undefined
    
## Functional Requirements

- [ ] Schema rules must be provided the following parameters:
  - [ ] Reference to the methods library in order to execute other schema rules as needed to compute a truthy/falsy answer on its string parsing
  - [ ] Next node object (uncomputed) or callback that will run once the next node is found.
  - [ ] Previous node object ( no need to be able to manipulate this) _(Optional)_
