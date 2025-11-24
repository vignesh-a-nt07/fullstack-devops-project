# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "${var.project}-alb-sg"
  description = "Allow HTTP to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-alb-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "alb" {
  name               = "${var.project}-alb"
  internal           = false
  load_balancer_type = "application"

  # ⭐ FIXED — assign SG
  security_groups = [aws_security_group.alb_sg.id]

  # public subnets from VPC module (must be 2 AZs)
  subnets = var.public_subnets

  tags = {
    Name = "${var.project}-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "backend_tg" {
  name        = "${var.project}-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/"
    matcher  = "200-399"
    interval = 30
  }
}

# Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

# Attach Backend EC2 to Target Group using INSTANCE ID (not IP)
resource "aws_lb_target_group_attachment" "backend_attach" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = var.backend_instance_id    # ⭐ CORRECT
  port             = 8000
}
