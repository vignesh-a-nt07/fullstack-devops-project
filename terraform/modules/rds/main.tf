resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "postgres" {
  identifier           = "${var.project}-db"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = var.db_username
  username             = var.db_username
  password             = var.db_password
  skip_final_snapshot  = true
  publicly_accessible  = false

  db_subnet_group_name = aws_db_subnet_group.this.name

  # You need this too if you plan SG later
  # vpc_security_group_ids = [aws_security_group.db_sg.id]

  tags = {
    Name = "${var.project}-rds"
  }
}
