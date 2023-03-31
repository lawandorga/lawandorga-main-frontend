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
          image = "${data.terraform_remote_state.cluster.outputs.registry_endpoint}/lawandorga-main-frontend:${var.image_version}"
          name  = "lawandorga-frontend-container"


          port {
            container_port = 8080
          }

          readiness_probe {
            http_get {
              port = 80
              http_header {
                name  = "Host"
                value = "www.law-orga.de"
              }
            }
          }
        }
      }
    }
  }
}
