# Contributing

Thank you for taking the time to contribute. Every type of contribution is welcome.

The following is a set of guidelines for contributing to this project.
These are mostly guidelines, not rules.
Also, feel free to propose changes to this document in a [pull request][pr].


## Table of contents

- **[How Can I Contribute?](#how-can-i-contribute)**
- **[Project setup](#project-setup)**
- **[Development](#development)**
    - **[Automated testing](#automated-testing)**
    - **[Committing and pushing changes](#committing-and-pushing-changes)**
- **[Style-guides](#styleguides)**
    - **[Git Commit Messages](#git-commit-messages)**
- **[Help needed](#help-needed)**


## How Can I Contribute?

- Reporting Bugs
- Suggesting Enhancements
- Pull Requests

To report bugs or suggest enhancements, please use the [issues][issues] page.

To make pull requests:

- [setup the project](#project-setup) locally.
- make your changes;
  Please try to follow the [development](#development) guidelines while making your changes.
- [commit and push](#committing-and-pushing-changes) the changes.
- [submit the pull request][pr].


## Project setup

1.  [Fork the repo][fork] to your GitHub account.
2.  Clone the repo: `git clone https://github.com/<your-github-username>/smart-form-validator`.
3.  Navigate to the repo's directory: `cd smart-form-validator`.
4.  Run `npm install` to install dependencies.
5.  Create a branch for your PR with `git checkout -b pr/your-branch-name`.

> Tip: Keep your `main` branch pointing at the original repository while still making
> pull requests from branches on your fork. To do this, run:
>
> ```bash
> git remote add upstream https://github.com/simplymichael/smart-form-validator.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This does the following:
> 1. adds the original repository as a "remote" called "upstream"
>
> 2. fetches the git information from that remote
>
> 3. sets your local `main` branch to pull the latest changes from the upstream main branch whenever you run `git pull`.
>
> Now you can make all of your pull request branches based on this local `main` branch.
>
> Whenever you want to update your local `main` branch, do a regular `git pull`.
> You can push the updated changes to your remote origin master by running `git push`.


## Development

### Automated testing
- Run all tests: `npm test`.
- Test a module: `npm test -- --<module_name>`. 
  Example: `npm test -- --SmartFormValidator`.
- Test a module method: `npm test -- --<module_name>::<method_name>`. 
  Example: `npm test -- --SmartFormValidator::addField`.
- Run all tests with coverage report: `npm run test:coverage`.

### Committing and Pushing changes
This project follows the [Conventional Commits Specification][commits] and uses [ESLint][eslint] for linting.

Before committing your changes, run `npm run lint:fix` to check and automatically fix linting errors.
If there are linting errors that cannot be automatically fixed, 
they are highlighted, so that you can manually fix them.

To commit your changes, run `npm run commit`. This will:

- generate conventional commit messages using [commitizen][commitizen] and [cz-conventional-changelog][changelog]
- check to make sure there are no linting errors
- run the tests to make sure the changes do not break existing functionality
- check that the minimum code-coverage threshold is attained
- apply the commit

Once everything checks out and the commit is applied,
you can then push your changes by running `git push -u remote pr/your-branch-name`.

You can keep making and pushing updates to your pull request branch 
until you feel ready to have your changes merged into the main project.

When you are ready to have your changes merged, you can then [open a pull request][pr].


## Style guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line (subject line) to 72 characters or less.
- Reference issues and pull requests liberally after the first line.
- Consider starting the commit message with an applicable emoji:
    - :art: `:art:` when improving the format/structure of the code
    - :racehorse: `:racehorse:` when improving performance
    - :non-potable_water: `:non-potable_water:` when plugging memory leaks
    - :memo: `:memo:` when writing docs
    - :penguin: `:penguin:` when fixing something on Linux
    - :apple: `:apple:` when fixing something on macOS
    - :checkered_flag: `:checkered_flag:` when fixing something on Windows
    - :bug: `:bug:` when fixing a bug
    - :fire: `:fire:` when removing code or files
    - :green_heart: `:green_heart:` when fixing the CI build
    - :white_check_mark: `:white_check_mark:` when adding tests
    - :lock: `:lock:` when dealing with security
    - :arrow_up: `:arrow_up:` when upgrading dependencies
    - :arrow_down: `:arrow_down:` when downgrading dependencies
    - :shirt: `:shirt:` when removing linter warnings

## Help needed

Please checkout the [the issues][issues] page for any open issues.

Also, please watch the repo and respond to questions/[bug reports][bug]/[feature requests][fr]! Thanks!







[bug]: https://github.com/simplymichael/smart-form-validator/labels/bug
[changelog]: https://npm.im/cz-conventional-changelog
[commitizen]: https://npm.im/commitizen
[commits]: https://conventionalcommits.org/
[eslint]: https://eslint.org/
[fork]: https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo
[fr]: https://github.com/simplymichael/smart-form-validator/labels/feature%20request
[issues]: https://github.com/simplymichael/smart-form-validator/issues
[pr]: https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request
