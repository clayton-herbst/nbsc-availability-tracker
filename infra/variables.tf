variable "credentials_file" {}

variable "project_id" {
  type        = string
  description = "The ID of the seed project"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}

variable "billing_account_id" {
  type        = string
  description = "The ID of the billing account to associate this project with"
}
