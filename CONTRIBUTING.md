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

## Style Guide

The repository follows the [conventional-commits](https://www.conventionalcommits.org/) specification. This commit syntax in enforced through git hooks registered with [Husky](https://github.com/typicode/husky/).
