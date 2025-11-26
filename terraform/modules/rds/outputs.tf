output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}


output "port" { 
    value = aws_db_instance.postgres.port
}