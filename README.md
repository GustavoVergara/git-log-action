# Git Log action

Get log using GitHub API.

## Inputs

### `baseRef`

**Required** Point of reference to the start of the log. Default `"World"`.

### `headRef`

**Required** Point of reference to the end of the log. Default `"HEAD"`.

## Outputs

### `log`

The log received from GitHub's API.

## Example usage

uses: GustavoVergara/git-log-action@v1.0.0
with:
  baseRef: 'v0.0.5'
