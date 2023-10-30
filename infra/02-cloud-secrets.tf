resource "google_secret_manager_secret" "oauth_client_secret" {
  secret_id = "account-linking-client-secret"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "oauth_client_secret" {
  secret      = google_secret_manager_secret.oauth_client_secret.id
  secret_data = var.oauth_client_secret
}

resource "google_secret_manager_secret_iam_member" "oauth_client_secret" {
  project   = google_secret_manager_secret.oauth_client_secret.project
  secret_id = google_secret_manager_secret.oauth_client_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}
