resource "aws_security_group" "frontend_sg" {
  name        = "${var.project}-frontend-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "backend_sg" {
  name        = "${var.project}-backend-sg"
  vpc_id      = var.vpc_id
  description = "Allow internal traffic from ALB and optional SSH"

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # VPC internal range
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # temporary while practicing
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "frontend" {
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.public_subnet_id
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.frontend_sg.id,
  ]

  tags = {
    Name = "${var.project}-frontend"
  }
}

resource "aws_instance" "backend" {
  ami                         = var.ami
  instance_type               = var.instance_type
  subnet_id                   = var.private_subnet_id
  key_name                    = var.key_name
  associate_public_ip_address = false

  vpc_security_group_ids = [
    aws_security_group.backend_sg.id,
  ]

  tags = {
    Name = "${var.project}-backend"
  }
}
