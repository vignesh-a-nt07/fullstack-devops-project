resource "aws_lb" "alb" {
  name               = "${var.project}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = []
  subnets            = var.public_subnets
  tags = { Name = "${var.project}-alb" }
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "${var.project}-tg"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check {
    path = "/"
    matcher = "200-399"
    interval = 30
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

# register backend private IP as a target
resource "aws_lb_target_group_attachment" "backend_attach" {
  target_group_arn = aws_lb_target_group.backend_tg.arn
  target_id        = var.backend_private_ip
  port             = 8000
}
