terraform {
  backend "azurerm" {}

  required_version = ">= 1.3.6"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.30.0"
    }
    google = {
      source = "hashicorp/google"
    }
    auth0 = {
      source  = "auth0/auth0"
      version = "1.0.0"
    }
  }
}

locals {
  props = merge(jsondecode(var.props), jsondecode(var.deployment_props))
}


provider "google" {
  region          = local.props.gcp.location
  project         = local.props.gcp.project_id
  billing_project = local.props.gcp.project_id
}

data "google_project" "main" {}

data "google_compute_default_service_account" "default" {
}


