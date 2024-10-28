---
sidebar_position: 1
---

# Deploy AtomicCD On Kubernetes Cluster (Public Repo)

This tutorial shows how to deploy AtomicCD a Kubernetes Cluster.

### Pre-requisites:

- A Kubernetes cluster with admin privileges.
- A Github public repository to place Target Config file.

### Below are the steps to setup AtomicCD to implement continuous delivery for a python application:

1. Create Cluster Role for AtomicCD:
    - Make a file named `cluster-role.yaml` and copy the contents of the below cluster role   file in it.

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

    - Apply the file using `kubectl apply -f cluster-role.yaml` command.

2. Create a Service Account for AtomicCD
    - Make a file named `sa.yaml` and copy the contents of the below service account file in it.

    ```yaml
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: sa
      namespace: default
    ```

    - Apply the file using `kubectl apply -f sa.yaml` command.

3. Create a Cluster Role Binding to bind the above Service Account and Cluster Role with each other.
    - Make a Cluster Role Binding file name `cluster-role.yaml` and copy the contents of the below cluster role binding file in it.

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

    - Apply the file using `kubectl apply -f cluster-role.yaml` command.

4. In your Github repository make a target config file named `targetConfig.yaml` at root directory and copy the below target config files in it.
```yaml
targetConfig:
  - targetName: python-cd
    containers:
    - containerName: "python-container"
      containerImage: "python"
      containerTag: "3.9"
    name: python-deployment
    type: deployment
    namespace: default
    scope: nameScoped
```

5. Deploy a python deployment in your Kubernetes Cluster.

    - Create a file named `python-deployment.yaml` and copy the python deployment manifest below in it.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: python-deployment
    spec:
      selector:
        matchLabels:
          app: python-deployment
    template:
        metadata:
          labels:
            app: python-deployment
        spec:
          containers:
          - name: python-container
            image: python:3.9
            resources:
              limits:
                memory: "128Mi"
                cpu: "50m"
            ports:
            - containerPort: 80
    ```

    - Apply the file with `kubecyl apply -f python-deployment.yaml` command.

6. Create a Configmap name with a Track Config file

    - Make a file named `configmap.yaml`. Below in the track config configmap, replace "your github repository url" with your actual repository URL. Copy the final contents in your `configmap.yaml` file.

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
        name: atomic-cd-cm
    data:
        trackConfig.yaml: |
            trackConfig:
              repoURL: your github repository url
              path: /targetConfig.yaml
    ```

    - Apply the file with `kubectl apply -f configmap.yaml` command.

7. Deploy AtomicCD

   - Make a file named `deploy.yaml` and copy the contents of the below AtomicCD deployment manifest in it.

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: atomic-cd
    spec:
      selector:
        matchLabels:
          app: atomic-cd
    template:
        metadata:
          labels:
            app: atomic-cd
        spec:
        serviceAccountName: sa
        containers:
        - name: atomic-cd
          image: iamanshul14/atomic-cd:latest
          volumeMounts:
          - name: config-vol
            mountPath: /AtomicCD/config
            resources:
              limits:
                memory: "50Mi"
                cpu: "30m"
            ports:
            - containerPort: 8080
        volumes:
        - name: config-vol
          configMap:
            name: atomic-cd-cm
    ```
    
    - Apply the file using `kubectl apply -f deploy.yaml` command.


### Trigger CD for the python application.

- Get the name of AtomicCD pod by running the `kubectl get pods` command. Copy the pod name with `atomic-cd` prefix.

- In the command: `kubectl logs your-atomiccd-pod-name --follow`, change **"your-atomiccd-pod-name"** with the AtomicCD pod name you copied above. Run the command.

- If everything goes fine you will see `running` output in the container log of AtomicCD. Do not close this terminal tab and keep tracking the logs.

- Go to your Github repository and change the value of `containerTag` field to `3.10` and commit the change.

- AtomicCD scans for Track Config in github repo every 3 minutes, so wait for around 3 minutes and keep a track on AtomicCD container logs, you will the log `Out of sync Deployment: python-deployment with Container Name python-container` and `Sync Successfull!`. This means AtomicCD have succefully executed CD for python app and change the python app version from `3.9` to `3.10`.

- You can confirm the changed python app version by first getting the pod name from the command: `kubectl get pods` and copying the pod name with prefix `python-deployment` and then finally running the command `kubectl describe pod python-deployment-pod-name` **(change python-deployment-pod-name with the actual podname of python-deployment)**.

- In the result of above command you can check the container verson in `image` field.

---
