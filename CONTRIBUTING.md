# Contributing

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Style Guide](#style-guide)

## Requirements

- [Kubectl](https://kubectl.docs.kubernetes.io/)
- [Colima](https://github.com/abiosoft/colima)
- [Kustomize](https://kubectl.docs.kubernetes.io/)

## Getting Started

The `packages/orchestration` folder defines the [Kustomize](https://kubectl.docs.kubernetes.io/) _'Kubernetes Resource Object (KRO)'_ files to orchestrate the _k8's_ application.

See this [guide](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/helloWorld/README.md) to get started creating the _k8's_ resources.

### Running with Colima

> Note: for MacOS users

Install [Colima](https://github.com/abiosoft/colima) which makes use of [Lima](https://lima-vm.io/) to run a linux virtual machines running [containerd](https://containerd.io/) containers.

```bash
brew install colima
```

Start your _Colima_ server instance making sure you have the [nerdctl](https://github.com/containerd/nerdctl) tooling installed.

```bash
colima nerdctl install
colima start --runtime=containerd --kubernetes
```

You should be able to interact with [kubectl](https://kubectl.docs.kubernetes.io/) to create a deployment.

### Kubernetes

We make use of [Kustomize](https://kubectl.docs.kubernetes.io/) to describe kubernetes resources. To build the development stack use a command similar to:

```bash
kustomize build ./packages/orchestration/overlays/dev | kubectl apply -f -
```

## Style Guide

The repository follows the [conventional-commits](https://www.conventionalcommits.org/) specification. This commit syntax in enforced through git hooks registered with [Husky](https://github.com/typicode/husky/).
