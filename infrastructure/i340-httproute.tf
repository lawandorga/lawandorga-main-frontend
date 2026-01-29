resource "kubernetes_manifest" "lawandorga_frontend_route" {
  manifest = {
    apiVersion = "gateway.networking.k8s.io/v1"
    kind       = "HTTPRoute"
    metadata = {
      name      = "lawandorga-frontend"
      namespace = "default"
    }
    spec = {
      parentRefs = [
        {
          name = "lawandorga-gateway"
          namespace = "default"
        }
      ]
      hostnames = ["law-orga.de", "www.law-orga.de"]
      rules = [
        {
          matches = [
            {
              path = {
                type  = "PathPrefix"
                value = "/"
              }
            }
          ]
          backendRefs = [
            {
              name = kubernetes_service_v1.lawandorga_frontend_service.metadata.0.name
              port = 80
            }
          ]
          filters = [
            {
              type = "ResponseHeaderModifier"
              responseHeaderModifier = {
                set = [
                  {
                    name  = "Access-Control-Allow-Origin"
                    value = "https://chat.law-orga.de"
                  },
                  {
                    name  = "Access-Control-Allow-Methods"
                    value = "GET, OPTIONS"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
}