output "frontend_public_ip" { value = module.ec2.frontend_public_ip }
output "backend_private_ip" { value = module.ec2.backend_private_ip }
output "alb_dns_name" { value = module.alb.dns_name }
output "rds_endpoint" { value = module.rds.endpoint }
output "key_name" { value = aws_key_pair.deployer.key_name }
