variable "cidr" {}
variable "public_subnets_cidrs" { type = list(string) }
variable "private_subnets_cidrs" { type = list(string) }
variable "project" { default = "fullstack-devops-project" }
variable "azs" { type = list(string) }
