resource "kubernetes_ingress_v1" "lawandorga_frontend_ingress" {
  metadata {
    name = "lawandorga-frontend"
  }

  spec {
    rule {
      host = "law-orga.de"
      http {
        path {
          backend {
            service {
              name = kubernetes_service_v1.lawandorga_frontend_service.metadata.0.name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
    rule {
      host = "www.law-orga.de"
      http {
        path {
          backend {
            service {
              name = kubernetes_service_v1.lawandorga_frontend_service.metadata.0.name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
    tls {
      hosts       = ["www.law-orga.de", "law-orga.de"]
      secret_name = var.certificate_name
    }
  }
}
