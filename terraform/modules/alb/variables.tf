variable "vpc_id" {}
variable "public_subnets" { type = list(string) }
variable "backend_private_ip" {}
variable "project" { default = "fullstack-devops-project" }
