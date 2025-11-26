output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "backend_private_ip" {
  value = module.ec2.backend_private_ip
}

output "frontend_public_ip" {
  value = module.ec2.frontend_public_ip
}

output "key_name" {
  value = aws_key_pair.deployer.key_name
}

output "rds_endpoint" {
  value = module.rds.rds_endpoint
}
