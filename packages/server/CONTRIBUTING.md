## Contributing

## Table of Contents

- [Dependencies](#dependencies)
- [Building](#building-image)
- [Running](#running-image)
- [Frequently Asked Questions](#faq)

## Dependencies

Install [Colima](https://github.com/abiosoft/colima) and start the virtual machine.

```bash
colima start --runtime containerd --kubernetes
```

> Note: if you encounter issues you might want to remove the existing colima profile. See [FAQ](#faq)

Ensure [Nerdctl](https://github.com/containerd/nerdctl) is installed.

```bash
colima nerdctl install
```

## Building Image

```bash
nerdctl build -t example:latest
```

## Running Image

```bash
nerdctl run --rm -it -p 3333:3333 example:latest
```

### Testing

```bash
nerdctl run --rm -it --entrypoint="go" example:latest test ./src
```

## FAQ

#### Removing an existing Colima profile

```bash
colima stop
colima delete
```