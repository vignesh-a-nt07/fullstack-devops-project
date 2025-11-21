resource "aws_db_subnet_group" "this" {
  name = "${var.project}-subnet-group"
  subnet_ids = var.private_subnet_ids
}

resource "aws_db_instance" "postgres" {
  identifier = "${var.project}-db"
  engine = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  name = var.db_name
  username = var.db_username
  password = var.db_password
  skip_final_snapshot = true
  publicly_accessible = false
  db_subnet_group_name = aws_db_subnet_group.this.name
  vpc_security_group_ids = []
}
