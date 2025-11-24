variable "vpc_id" {}
variable "public_subnets" { type = list(string) }
variable "backend_instance_id" {}
variable "project" { default = "fullstack-devops-project" }
