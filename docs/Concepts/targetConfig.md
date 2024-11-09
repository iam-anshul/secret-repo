---
sidebar_position: 1
---

# Target Config

Target Config is the yaml files which resides in the git repository and gets monitored by AtomicCD.

The following is an example of Target Config

```yaml
targetConfig:
  - targetName: example-1
    containers:
    - containerName: "gocontainer"
      containerImage: "golang"
      containerTag: "latest"
    name: app-deploy
    type: deployment
    namespace: default
    scope: nameScoped
```

The following is the deployment manifest this Target Config applies to:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deploy
spec:
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
      - name: gocontainer
        image: golang:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
```

In the above Target Config example:
- Provide Identity to a target with `targetName`. This is the block under which Image and 
  Image versions gets specified for deployments or statefulsets.

- The `containers` field specifies the container name, container image and container tag. 
  - Update image by changing the value of `containerImage`.
  - Update image version or image tag by changing the value of `containerTag` field.
  - The value of `containerName` specifies the name of container in which `containerImage`  and `containerTag` spec will get applied to.

- The `name` field sets the name of deployment or statefulset that has the containers 
  specifiend in `containers` field

- The `type` field specifies whether the name of the resource defined in `name` field is a 
  deployment or a statefulset. The following are the two values that `type` field can have:
   - If the `name` field is a statefulset, `type` should have `statefulset` as its value.
   - If the `name` field is a deployment, `type` should have `deployment` as its value.

- The `namespace` field specifies the namespace where the resource defined in `name` filed 
  lies.

- The `scope` field specifies the scope of the configurations of the Target Config. If there 
  is a certain Image that is being used by multiple resources whether deployments or statefulsets in a namespace, there is no need to make multiple targets in Target Config, instead set the `scope` field value to `namespaceScoped` and all the deployments and statefulsets that contains the image specified in `containerImage` field will get synced to the image version specified in `containerTag` field within the namepsace. If there is no such use case, setting `scope` field value to `nameScoped` will make the config applied to a certain deployment or statefulset defined in `name` field.
  #### Note:
   - When scope is set to `namespaceScoped`, `name` and `type` fields are not allowed along 
     with `containerName` field within `containers`.
   - For AtomicCD to work properly image tag must needed to be explicitly specified in the  deployment or statefulset configuration.

The following is an example of Target Config with `scope` set to `namespaceScoped`:

```yaml
targetConfig:
  - targetName: example-2
    containers:
    - containerImage: "python"
      containerTag: "latest"
    namespace: default
    scope: namespaceScoped
```

## Multiple Container in Target Config
#### The following example shows Target Config for multiple container deployment manifest.

**Deployment Manifest:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multiple-containers
  namespace: multideploy
spec:
  selector:
    matchLabels:
      app: multiple-containers
  template:
    metadata:
      labels:
        app: multiple-containers
    spec:
      containers:
      - name: python-img
        image: python:3.10
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 5000
      - name: nginx-img
        image: nginx:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
```
For the above deployment manifest, Target Config will be the following:

```yaml
targetConfig:
  - targetName: example-3
    containers:
    - containerName: "nginx-img"
      containerImage: "nginx"
      containerTag: "latest"
    - containerName: "python"
      containerImage: "python"
      containerTag: "3.10"
    name: multiple-containers
    type: statefulset
    namespace: multideploy
    scope: nameScoped
```

 The `containers` field can have multiple configs containing `containerName`, `containerImage` and `containerTag` field. This is for the case where a deployment or a statefulset resource runs multiple container within the pod. For such cases the containers which are to be tracked can be mentioned in `containers` field and if there are containers that are not needed to be tracked can be left out.

 **The following example shows Target Config for a multiple container deployment where some containers are being tracked and those not needed to be tracked being left out in Target Config**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multi-container
  namespace: multideploy
spec:
  selector:
    matchLabels:
      app: multi-container
  template:
    metadata:
      labels:
        app: multi-container
    spec:
      containers:
      - name: python-img
        image: python:3.9
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 5000
      - name: nginx-img
        image: nginx:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
      - name: helloworld-img
        image: hello-world:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 6000
``` 

For the above deployment, the Target Config will be the following:

```yaml
targetConfig:
  - targetName: example-4
    containers:
    - containerName: "python-img"
      containerImage: "python"
      containerTag: "3.9"
    - containerName: "nginx-img"
      containerImage: "nginx"
      containerTag: "latest"
    name: multi-container
    type: deployment
    namespace: multideploy
    scope: nameScoped
    
```

Here only **python-img** and **nginx-img** containers are being tracked in the Target Config and the **helloworld-img** is being left out in Target Config, so while it is running in deployment, it is not being tracked by AtomicCD.

## Multiple Targets in Target Config

TargetConfig can have multiple target for multiple deployment and statefulset resources.

#### The following example shows Target Config tracking two resources

**Deployment manifest:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  selector:
    matchLabels:
      app: nginx-deploy
  template:
    metadata:
      labels:
        app: nginx-deploy
    spec:
      containers:
      - name: reverse-proxy
        image: nginx:latest
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
```

**Statefulset manifest:**

````yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: python-sts
spec:
  selector:
    matchLabels:
      app: python-app
  serviceName: python-svc
  replicas: 2
  template:
    metadata:
      labels:
        app: python-app
    spec:
      containers:
      - name: app
        image: python:3.11
        ports:
        - containerPort: 5000
          name: web
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
````

For the above two manifest, Track Config will be the following:

```yaml
targetConfig:
  - targetName: example-5
    containers:
    - containerName: "reverse-proxy"
      containerImage: "nginx"
      containerTag: "latest"
    name: nginx-deploy
    type: deployment
    namespace: default
    scope: nameScoped

  - targetName: example-6
    containers:
    - containerName: "app"
      containerImage: "python"
      containerTag: "3.11"
    name: python-sts
    type: statefulset
    namespace: default
    scope: nameScoped
```

## Sync Frequency
AtomicCD look up the Target Cing in git repository at every 3 minutes, meaning every sync happens at 3 minutes interval.

AtomicCD provides sync triggers with webhooks (explained in Track Config section).

---
For help and support you can reach to me at my socials:

**[GitHub](https://github.com/iam-anshul)
[LinkedIn](https://twitter.com/anshulsingh142)
[Twitter](https://twitter.com/anshulsingh142)**

---
