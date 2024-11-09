---
sidebar_position: 2
---

# Track Config
Track Config is just a config file that gets mounted to AtomicCD as a Kubernetes Configmap or Secret. Track Config contains config about the git repository where the Target Config file resides.

Below is the example of a Track Config file:

```yaml
trackConfig:
  repoURL: https://github.com/username/reponame
  path: /target.yaml
  branch: main
  webhookSecret: secretwebhook
  token: github_pat_gidatvcjA0TcqVj0OhHPAX_APdlzMgdasdyubbkjadhefuzWRsTQANNMT7WSSRMfKhYewS
```

In the Track Config file:

- The `repoURL` field takes the URL of the git repository where the Target Config file resides.
- The `path` field takes the path in the git repository where the Target Config file resides.
- The `branch` is an **optional** field that takes the branch where the Target Config file resides. Not mentioning this field will make AtomicCD to default to look for the Target Config file in the `main` branch.
- The `webhookSecret` is an **optional** field that takes a secret as its value, AtomicCD uses this secret to authenticate with webhook triggers. Not mentioning this field will make AtomicCD to not authenticate webhook triggers.
- The `token` field is an **optional** field and it takes a token for examle a github personal access token as its value. This token is required if the repository where Target Config resides is a private repository. Not mentioning this field will make AtomicCD to look for a public repository.

## Mount Track Config as Configmap

Below is an example of a configmap that has Track Config file:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubecd-cm
data:
  trackConfig.yaml: |
    trackConfig:
      repoURL: https://github.com/username/repo
      path: /targetConfig.yaml
      branch: dev
      token: your github personal access token
      webhookSecret: your secret webhook
```

**Note:** The name of Track Config in the configmap must be `trackConfig.yaml`.

---
For help and support you can reach to me at my socials:

**[GitHub](https://github.com/iam-anshul)
[LinkedIn](https://twitter.com/anshulsingh142)
[Twitter](https://twitter.com/anshulsingh142)**

---