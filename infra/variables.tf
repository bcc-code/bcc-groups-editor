variable "oauth_client_id" {
  type = string
}

variable "oauth_client_secret" {
  type      = string
  sensitive = true
}

variable "oauth_issuer" {
  type = string
}

variable "server_host" {
  type = string
}

variable "coreapi_basepath" {
  type = string
}

variable "coreapi_audience" {
  type = string
}
