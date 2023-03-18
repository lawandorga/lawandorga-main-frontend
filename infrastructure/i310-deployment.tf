resource "kubernetes_deployment_v1" "lawandorga_frontend" {
  metadata {
    name = "lawandorga-frontend"
    labels = {
      app = "lawandorga-frontend"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "lawandorga-frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "lawandorga-frontend"
        }
      }

      spec {
        image_pull_secrets {
          name = data.terraform_remote_state.cluster.outputs.image_pull_secret_name
        }

        container {
          image = "${data.terraform_remote_state.cluster.outputs.registry_endpoint}/lawandorga-main-frontend:5a6b784659251ac02c7e7dac032356a4a303163e"
          name  = "lawandorga-frontend-container"


          port {
            container_port = 8080
          }
        }
      }
    }
  }
}
