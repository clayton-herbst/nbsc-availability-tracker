# Contributing

## Table of Contents

- [Kustomization](#kustomization)
- [Nginx-Ingress](#nginx-ingress)
- [Kubectl Cheat Sheet](#kubectl-cheat-sheet)

## Kustomization

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

## Nginx Ingress

You need to install the [nginx-ingress](https://github.com/kubernetes/ingress-nginx) controller separately to the stack.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

> Note: this cannot be included in the `kustomization.yaml` file at the moment due to the inclusion of prefix overwrites causing a reference error between the `nginx-ingress-controller` _deployment_ and _service_.

### Debugging

> See common pitfalls here: https://docs.nginx.com/nginx-ingress-controller/troubleshooting/

Listing the _Nginx_ `.conf`

```bash
kubectl exec <nginx-ingress-pod> -n ingress-nginx -- nginx -T
```

Accessing the _Nginx_ logs

```bash
kubectl logs <nginx-ingress-pod> -n ingress-nginx
```

## Kubectl Cheat Sheet

### Get resources

```bash
kubectl get (pod|service|deployment|ingressclass|ingress) \
    [-n <namespace>] \
    [resource-name]
```

### Describe resources

```bash
kubectl describe (pod|service|deployment|ingressclass|ingress) \
    [-n <namespace>] \
    [resource-name]
```

### Delete Resources

```bash
kubectl delete (pod|service|deployment|ingressclass|ingress \  
    [-n <namespace>|-A] \
    [--all] \
    [resource-name]
```
