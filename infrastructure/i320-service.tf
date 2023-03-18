resource "kubernetes_service_v1" "lawandorga_frontend_service" {
  metadata {
    name = "lawandorga-frontend"
  }
  spec {
    selector = {
      app = kubernetes_deployment_v1.lawandorga_frontend.spec.0.selector.0.match_labels.app
    }
    port {
      name        = "http"
      port        = 80
      target_port = 8080
    }
  }
}
