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
