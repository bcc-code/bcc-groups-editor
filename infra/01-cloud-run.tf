resource "random_uuid" "main_revision_id" {
  keepers = {
    first = timestamp()
  }
}

resource "google_cloud_run_v2_service" "main" {
  name     = "groups-editor"
  location = local.props.gcp.location
  ingress  = "INGRESS_TRAFFIC_ALL"
  template {
    revision = "groups-editor-${random_uuid.main_revision_id.result}"

    scaling {
      max_instance_count = 10
    }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      env {
        name = "OAUTH_CLIENT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.oauth_client_secret.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "OAUTH_CLIENT_ID"
        value = var.oauth_client_id
      }
      env {
        name  = "OAUTH_ISSUER"
        value = var.oauth_issuer
      }
      env {
        name  = "SERVER_HOST"
        value = var.oauth_issuer
      }
      env {
        name  = "COREAPI_BASE_PATH"
        value = var.oauth_issuer
      }
      env {
        name  = "COREAPI_AUDIENCE"
        value = var.oauth_issuer
      }

    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      annotations,
      client_version,
      client,
      labels,
      template.0.annotations,
      template.0.labels,
      template.0.containers.0.image,
    ]
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth-coreapi" {
  location = google_cloud_run_v2_service.main.location
  project  = google_cloud_run_v2_service.main.project
  service  = google_cloud_run_v2_service.main.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
