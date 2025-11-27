module "vpc" {
  source = "./modules/vpc"

  cidr = "222.0.0.0/16"

  azs = ["us-east-1a", "us-east-1b"] 

  public_subnets_cidrs  = ["222.0.1.0/24", "222.0.3.0/24"]  # FIXED
  private_subnets_cidrs = ["222.0.2.0/24", "222.0.4.0/24"]  # FIXED

  project = var.project
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.project}-key"
  public_key = file(var.public_key_path)
}

module "ec2" {
  source = "./modules/ec2"

  vpc_id            = module.vpc.vpc_id
  public_subnet_id  = module.vpc.public_subnet_ids[0]
  private_subnet_id = module.vpc.private_subnet_ids[0]

  ami           = var.ami
  instance_type = var.instance_type
  key_name      = aws_key_pair.deployer.key_name

  project = var.project
}

module "alb" {
  source = "./modules/alb"

  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids

  backend_instance_id = module.ec2.backend_instance_id

  project = var.project
}

module "rds" {
  source = "./modules/rds"
  
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids

  db_username = var.db_username
  db_password = var.db_password

  project = var.project
}

resource "local_file" "outputs" {
  content = jsonencode({
    alb_dns_name       = module.alb.alb_dns_name
    backend_private_ip = module.ec2.backend_private_ip
    frontend_public_ip = module.ec2.frontend_public_ip
    key_name           = aws_key_pair.deployer.key_name
    rds_endpoint       = module.rds.rds_endpoint
  })
  filename = "${path.module}/terraform-outputs.json"
}






