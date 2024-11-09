---
sidebar_position: 3
---

# Authenticate AtomicCD with Kubernetes Cluster

AtomicCD needs to authenticate with K8s cluster to implement continuous delivery for applications. AtomicCD uses Kubernetes RBAC (Role-Based Access Control) with a Kubernetes `Service Account` to authenticate with K8s API Server.

## Cluster Role, Service Account and Cluster Role Binding

Below is an example of Cluster Role required by AtomicCD:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: sa-role
rules:
- apiGroups: ["apps"]
  resources: ["deployments", "statefulsets"]
  verbs: ["list", "patch"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["list"]
```

AtomicCD needs `list` and `patch` permissions for deployments and statefulsets and `list` permission for pods.

Below is an example of Service Account for AtomicCD:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa
  namespace: default
```


Below is an example of Cluster Role Binding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: sa-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: sa-role
subjects:
- kind: ServiceAccount
  name: sa
  namespace: default
```

---
For help and support you can reach to me at my socials:

**[GitHub](https://github.com/iam-anshul)
[LinkedIn](https://twitter.com/anshulsingh142)
[Twitter](https://twitter.com/anshulsingh142)**

---