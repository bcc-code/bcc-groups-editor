data "google_service_account" "github_actions" {
  account_id = "sa-gha-cicd"
}

resource "google_service_account_iam_member" "github_actions_sa_binding" {
  service_account_id = data.google_compute_default_service_account.default.name
  role               = "roles/iam.serviceAccountUser"
  member             = data.google_service_account.github_actions.member
}

resource "google_storage_bucket_iam_member" "public_cicd_storage_bucket_access" {
  bucket = google_storage_bucket.public.name
  role   = "roles/storage.objectUser"
  member = data.google_service_account.github_actions.member
}
