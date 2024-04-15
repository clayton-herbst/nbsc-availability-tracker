// bastion proxy

resource "random_id" "random_role_id_suffix" {
  byte_length = 2
}

locals {
  base_role_id          = "osLoginProjectGet"
  service_account_email = var.service_account_email == "" ? try(google_service_account.bastion_host[0].email, "") : var.service_account_email
  service_account_roles = var.service_account_email == "" ? toset(compact(concat(
    var.service_account_roles,
    var.service_account_roles_supplemental,
  ))) : []
  temp_role_id = var.random_role_id ? format(
    "%s_%s",
    local.base_role_id,
    random_id.random_role_id_suffix.hex,
  ) : local.base_role_id
}


resource "google_service_account" "bastion_host" {
  count        = var.service_account_email == "" ? 1 : 0
  account_id   = var.service_account_name
  project      = var.project
  display_name = "Service account for bastion VM Instance"
}

module "instance_template" {
  source  = "terraform-google-modules/vm/google//modules/instance_template"
  version = "~> 11.0"

  name_prefix         = var.name_prefix
  project_id          = var.project
  machine_type        = var.machine_type
  disk_size_gb        = var.disk_size_gb
  disk_type           = var.disk_type
  disk_labels         = var.disk_labels
  subnetwork          = var.subnet
  subnetwork_project  = var.host_project
  additional_networks = var.additional_networks
  region              = var.region

  service_account = {
    email  = local.service_account_email
    scopes = var.scopes
  }

  enable_shielded_vm   = var.shielded_vm
  source_image         = var.image
  source_image_family  = var.image_family
  source_image_project = var.image_project
  startup_script       = var.startup_script
  preemptible          = var.preemptible
  can_ip_forward       = var.can_ip_forward ? "true" : "false"

  tags   = var.tags
  labels = var.labels

  metadata = merge(
    var.metadata,
    {
      enable-oslogin = "TRUE"
    }
  )
}

resource "google_compute_instance_from_template" "bastion_vm" {
  count   = var.create_instance_from_template ? 1 : 0
  name    = var.name
  project = var.project
  zone    = var.zone
  labels  = var.labels

  network_interface {
    subnetwork         = var.subnet
    subnetwork_project = var.host_project != "" ? var.host_project : var.project
    access_config      = var.external_ip ? var.access_config : []
  }

  source_instance_template = module.instance_template.self_link

  metadata_startup_script = "echo hi > /test.txt"

}

resource "google_service_account_iam_binding" "bastion_sa_user" {
  count              = var.service_account_email == "" ? 1 : 0
  service_account_id = google_service_account.bastion_host[0].id
  role               = "roles/iam.serviceAccountUser"
  members            = var.members
}
