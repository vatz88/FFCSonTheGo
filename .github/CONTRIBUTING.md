# Contributing to FFCS On The Go

Thank you for considering contributing to FFCS On The Go - VIT University! Whether you're a seasoned developer or new to open-source, we appreciate your involvement.

## Table of Contents

1. [Installing the Application Locally](#installing-the-application-locally)
2. [Before You Start](#before-you-start)
3. [Where to Look for Code or Add New Code](#where-to-look-for-code-or-add-new-code)
4. [Naming Scheme and Rules](#naming-scheme-and-rules)

## Installing the Application Locally

To get started with contributing, you need to set up the application on your local machine.

### Prerequisites

Ensure you have the following installed:

-   [Git](https://git-scm.com/downloads)
-   [Node.js and yarn](https://classic.yarnpkg.com/lang/en/docs/install)

### Steps

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:
    ```sh
    git clone https://github.com/vatz88/FFCSonTheGo.git
    ```
3. **Navigate to the project directory**:
    ```sh
    cd FFCSonTheGo
    ```
4. **Install the dependencies**:
    ```sh
    yarn install
    ```
5. **Run the application**:
    ```sh
    yarn start
    ```
6. **Open your browser** and navigate to `http://localhost:1234` to see the application running.

## Before You Start

### Working on an Issue

1. **Look for existing issues**: Check if the issue you want to work on is already reported.
2. **Comment on the issue**: Let us know if you're working on it to avoid duplication.
3. **Create a new branch** for your work:
    ```sh
    git checkout -b issue-<issue-number>-description
    ```

### Opening an Issue or Requesting a Feature

1. **Search existing issues** to avoid duplicates.
2. **Open a new issue**: Provide a detailed description, steps to reproduce (if applicable), and any other relevant information.
3. **Label your issue**: Use appropriate labels like `bug`, `enhancement`, `question`, etc.

## Where to Look for Code or Add New Code

-   **Code** is located in the `src` directory.
-   **Tests** are located in the `tests` directory.
-   **Schemas** are located in the `schemas` directory.
-   **Data** is located in the `util` directory.

### Adding New Code

1. **Identify the appropriate directory**: Follow the existing project structure.
2. **Follow the naming schemes and rules** (see below).
3. **Write tests** for your new code.

## Naming Scheme and Rules

### File and Directory Names

-   Use **lowercase** letters.
-   Use **hyphens** to separate words (e.g., `user-profile`, `dashboard-widget`).

### Variables and Functions

-   Use **camelCase** for variable and function names (e.g., `getUserName`, `fetchData`).
-   Use **PascalCase** for component and class names (e.g., `UserProfile`, `DataFetcher`).

### DOM Element Class Names and IDs

-   Use **hyphens** to separate words (e.g., `user-profile`, `main-header`).

### Commits and Pull Requests

-   Write **clear and concise commit messages**.
-   Use the following format for commit messages:

    ```
    [Type]: Description

    [Optional body explaining what and why]
    ```

    Example:

    ```
    fix: resolve issue with user login

    Fixed the authentication bug that caused login failures.
    ```

-   Ensure **pull requests** are focused: Only address one issue or feature per pull request.

### Code Style

-   Follow the coding standards.
-   Maintain consistency with the existing codebase.
-   Write **clear and understandable code**.
-   Add **comments** where necessary to explain complex logic.

## Additional Coding Guidelines

### Use of CSS

-   Use Bootstrap 5 CSS classes for styling.
-   Refrain from using custom CSS unless absolutely necessary.

## Code Comments

-   Comment your code in places where understanding it is not straightforward.
-   Do not overdo it; only comment where necessary.

## Code Cleanup

-   Remove all unused code.
-   Do not leave commented-out code in the codebase unless it is necessary to keep for future reference.

By following these guidelines, you'll help keep our project consistent and maintainable.
