resource "google_artifact_registry_repository" "main" {
  location      = local.props.gcp.location
  repository_id = "groups-editor"
  format        = "DOCKER"
}
