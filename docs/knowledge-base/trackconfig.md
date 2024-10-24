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
    - containerName: "cd-deploy"
      containerImage: "python"
      containerTag: "3.9"
    namespace: default
    type: statefulset
    scope: nameScoped
    name: cd-deploy
```
In this example:
- Provide Identity to a target with **_targetName_**. This is the block under which Image and 
  Image versiions gets specified for deployments or statefulsets.

- The **_containers_** field specifies the container name, container image and container tag. 
  - You have the option to update image by changing the value of **_containerImage___**.
  - You have the option to update image version or image tag by changing the the value of       **_containerTag___**

---
