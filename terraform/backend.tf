terraform {
  backend "s3" {
    bucket = var.tfstate_bucket
    key    = "${var.project}/terraform.tfstate"
    region = var.aws_region
  }
}
