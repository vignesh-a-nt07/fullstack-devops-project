terraform {
  required_version = ">= 1.4"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }

  backend "s3" {
    bucket         = var.tfstate_bucket
    key            = "${var.project}/terraform.tfstate"
    region         = var.aws_region
    dynamodb_table = var.tfstate_lock_table
  }
}

provider "aws" {
  region = var.aws_region
}
