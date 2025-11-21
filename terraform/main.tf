module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16"
  azs    = ["${var.aws_region}a","${var.aws_region}b"]
  public_subnets_cidrs = ["10.0.1.0/24"]
  private_subnets_cidrs = ["10.0.2.0/24"]
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.project}-key"
  public_key = file(var.public_key_path)
}

module "ec2" {
  source = "./modules/ec2"
  vpc_id = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_ids[0]
  private_subnet_id = module.vpc.private_subnet_ids[0]
  ami = var.ami
  instance_type = var.instance_type
  key_name = aws_key_pair.deployer.key_name
}

module "alb" {
  source = "./modules/alb"
  vpc_id = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids
  backend_private_ip = module.ec2.backend_private_ip
}

module "rds" {
  source = "./modules/rds"
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  db_username = var.db_username
  db_password = var.db_password
}
