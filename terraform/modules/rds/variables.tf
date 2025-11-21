variable "private_subnet_ids" { type = list(string) }
variable "db_username" {}
variable "db_password" {}
variable "project" { default = "fullstack-devops-project" }
variable "db_name" { default = "appdb" }
