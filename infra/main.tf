terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.0.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)

  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  credentials = file(var.credentials_file)
}

module "iap_bastion" {
  source                = "./modules/iap_bastion"
  project               = var.project_id
  network               = google_compute_network.network.self_link
  subnet                = google_compute_subnetwork.subnet.self_link
  service_account_email = "terraform-tutorial@terraform-gcp-tutorial-415108.iam.gserviceaccount.com"
}

resource "google_compute_network" "network" {
  project                 = var.project_id
  name                    = "test-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  project                  = var.project_id
  name                     = "test-subnet"
  region                   = var.region
  ip_cidr_range            = "10.127.0.0/20"
  network                  = google_compute_network.network.self_link
  private_ip_google_access = true
}

resource "google_compute_firewall" "allow_access_from_bastion" {
  project = var.project_id
  name    = "allow-bastion-ssh"
  network = google_compute_network.network.self_link

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # Allow SSH only from IAP Bastion
  source_service_accounts = [module.iap_bastion.service_account_email]
}
