terraform {
  backend "s3" {
    bucket         = "tfstate-demo-bucket-vicky-12345"
    key            = "fullstack/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tfstate-lock-table"
  }
}
