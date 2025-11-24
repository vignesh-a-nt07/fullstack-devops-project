variable "aws_region" { 
    type = string
    default = "us-east-1"
}

variable "project" { 
    type = string
    default = "fullstack-devops-project" 
}

variable "public_key_path" { 
    type = string
    default = "~/.ssh/id_rsa.pub"
}

variable "private_key_path" { 
    type = string
    default = "~/.ssh/id_rsa"
}
variable "instance_type" { 
    type = string
     default = "t3.micro"

}
variable "ami" {
  type        = string
  description = "Ubuntu 22.04 AMI (change per region)"
}

variable "db_password" {
    type = string
    sensitive = true 
}

variable "db_username" { 
    type = string
    default = "appuser" 
}

variable "tfstate_bucket" { 
    type = string 
}

variable "tfstate_lock_table" {
    type = string
}
