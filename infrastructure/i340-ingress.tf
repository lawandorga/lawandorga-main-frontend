resource "kubernetes_ingress_v1" "lawandorga_frontend_ingress" {
  metadata {
    name = "lawandorga-frontend"
    annotations = {
      "traefik.ingress.kubernetes.io/router.tls" = true
    }
  }

  spec {
    default_backend {
      service {
        name = kubernetes_service_v1.lawandorga_frontend_service.metadata.0.name
        port {
          number = 80
        }
      }
    }
    tls {
      hosts       = ["www.law-orga.de"]
      secret_name = var.certificate_name
    }
  }
}

resource "kubernetes_ingress_v1" "non_www_redirect" {
  metadata {
    name = "non-www-redirect"
    annotations = {
      "traefik.ingress.kubernetes.io/router.tls" = true
      "traefik.ingress.kubernetes.io/redirect-replacement" : "https://www.law-orga.de/$1"
    }
  }

  spec {
    default_backend {
      service {
        name = kubernetes_service_v1.lawandorga_frontend_service.metadata.0.name
        port {
          number = 80
        }
      }
    }
    tls {
      hosts       = ["www.law-orga.de"]
      secret_name = var.certificate_name
    }
  }
}
