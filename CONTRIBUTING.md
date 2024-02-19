# Contributing

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Style Guide](#style-guide)

## Requirements

- [Kubectl]()
- [Minikube]()
- [Kustomize]()

## Getting Started

The repository makes use of [Minikube](https://minikube.sigs.k8s.io/docs/start/) to run the application stack locally. The `packages/orchestration` folder defines the [Kustomize](https://kubectl.docs.kubernetes.io/) _'Kubernetes Resource Object (KRO)'_ files to orchestrate the _k8's_ application.

See this [guide](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/helloWorld/README.md) to get started creating the _k8's_ resources.

### Running Minikube

This repository makes use of the [podman](https://podman.io/docs/installation) containerization tooling. You can initialize the _Podman_ virtual machine like so:

Running _Minikube_ using the [qemu driver](https://minikube.sigs.k8s.io/docs/drivers/qemu/) requires the installation and running of the [socket_vmnet](https://github.com/lima-vm/socket_vmnet) service.

```bash
brew install socket_vmnet
sudo brew service start socket_vmnet
```

```bash
podman machine init --cpus 2 --disk-size 20 --memory 2048 --rootful
podman machine start
```

Once you have _Podman_ installed you can should start minikube like so:

> Note: there is an issue using the experimental driver _Podman_. A solution that has worked for me is described in issue [#15021](https://github.com/kubernetes/minikube/issues/15021#issuecomment-1261499686)

```bash
minikube start --driver=qemu --container-runtime=containerd --network socket_vmnet
```

## Style Guide

The repository follows the [conventional-commits](https://www.conventionalcommits.org/) specification. This commit syntax in enforced through git hooks registered with [Husky](https://github.com/typicode/husky/).
