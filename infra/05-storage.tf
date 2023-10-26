### Storage Bucket for Static Files (web app)
resource "google_storage_bucket" "public" {
  name                        = "sb-${data.google_project.main.project_id}-webcomponent"
  location                    = local.props.gcp.location
  public_access_prevention    = "inherited"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
  }
}

# Public Access #
resource "google_storage_bucket_iam_member" "public_rule" {
  bucket = google_storage_bucket.public.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

