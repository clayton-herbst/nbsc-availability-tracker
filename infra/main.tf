terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_compute_instance" "vm_instance" {
  name         = "terraform-tutorial-instance"
  machine_type = "f1-micro"
  tags         = ["web", "dev"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name

    access_config {
      // make instance accessible over network
    }
  }
}

resource "google_compute_firewall" "vpc_firewall" {
  name    = "internet-tcp"
  network = google_compute_network.vpc_network.name

  source_ranges = ["0.0.0.0/0"]
  source_tags   = ["web"]

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}

resource "google_compute_firewall" "default_firewall" {
  name    = "default-rule"
  project = var.project
  network = "default"

  source_ranges = ["0.0.0.0/0"]

  deny {
    protocol = "tcp"
  }
}
