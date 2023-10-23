data "google_service_account" "github_actions" {
  account_id = "sa-gha-cicd"
}

resource "google_service_account_iam_member" "github_actions_sa_binding" {
  service_account_id = data.google_compute_default_service_account.default.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${data.google_service_account.github_actions.email}"
}
