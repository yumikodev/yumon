# Yumon

The minimalist task CLI executor.

## Table of content

- [Install](#install)
- [Usage](#usage)
  - [Init command](#init)
  - [Select command](#select)
    - [Custom config](#custom-config)
  - [Help](#help)
- [Example config](#example-config)

## Install

Global:

```sh
$ npm i -g yumon
```

Or locally:

```sh
$ npm i -D yumon
```

## Usage

Yumon will always look for a [`yumonrc.yaml`](#example-config) file (by default) in the directory where it is run:

### Init

To initialize a default configuration file run the following command:

```sh
$ yumon init
```

### Select

To select a task and execute it use the following command:

```sh
$ yumon select
```

Or for quick access simply:

```sh
$ yumon
```

#### Custom config

If your configuration file is located in another location, use the following option:

```sh
$ yumon --config path/to/config.yaml
```

### Help

For help on all other commands run:

```sh
$ yumon --help
```

## Example config

```yaml
tasks:
  - name: Hello world
    alias:
      - greet
    description: Show a "Hello world"
    action: echo "Hello world"
```

# License

This project is under the [MIT](LICENSE) license.
