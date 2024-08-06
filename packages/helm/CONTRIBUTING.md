# Contributing

## Table of Contents

- [Dependencies](#dependencies)
- [Helm](#helm)
- [Nginx](#nginx-ingress)
- [FAQ](#faq)

## Dependencies

- [Helm](https://helm.sh/)
- [Ingress-Nginx](https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx)

## Helm

Install [Helm](https://helm.sh/docs/intro/install/).

Checkout the getting started guide inside the _Helm_ [docs](https://helm.sh/docs/chart_template_guide/getting_started/).

### Bootstrapping

You can boostrap this _Helm_ chart like so

```bash
helm install [release-name] .
```

> See cheat sheet: https://helm.sh/docs/intro/cheatsheet/

## Nginx Ingress

Bootstrap [nginx-ingress](https://github.com/kubernetes/ingress-nginx) installation using helm

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

## FAQ

### K8s does not find locally built images

This might be apparent by a pod constantly running into a _CrashBackoffLoop_. There are a lot of moving parts but the main points are the fact that `nerdctl` make use of namespaces. Locally you are likely building the image to the default namespace and a lot of the _Kubernetes_ images are built to the `k8s.io` namespace.

Another thing to consider is that your images might be built on your machine and saved to some registry locally. The virtual machines might have some filesystem immediate sharing but if you inspect the image list in the virtual machine once you `ssh` into it; you will notice the image does not exist.

A copying procedure has to be performed:

```bash
nerdctl image save [IMAGE_NAME] -o [FILENAME.tar]
~ssh:vm docker image load -i [FILENAME.tar]
```

This is particularly troublesome considering updates to the `:latest` tag of a container image build will not be cascaded to the kubernetes node/VM; potentially causing headaches.
