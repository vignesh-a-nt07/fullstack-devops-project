# Fullstack DevOps Project — Option B (ALB + Frontend EC2 + Backend EC2 + RDS)

## Overview
This repository provisions AWS infra (VPC, subnets, ALB, EC2, RDS) using Terraform, configures servers with Ansible, and uses GitHub Actions as CI/CD.

Frontend: React (dist served by Nginx on frontend EC2)  
Backend: FastAPI running under systemd on backend EC2  
DB: RDS PostgreSQL in private subnet  
ALB: public load balancer routing to backend

Screenshots (for reference):
- Frontend: /mnt/data/5239cd20-d2ff-4c88-9413-110768ac0def.png
- Backend: /mnt/data/a759735f-947a-493a-a52c-25f27c96e3b4.png

## Pre-requisites
- Terraform >= 1.4
- An AWS account + credentials
- GitHub repo with secrets:
  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
  - SSH_PRIVATE_KEY (PEM)
  - PUBLIC_KEY_PATH & PRIVATE_KEY_PATH values if used
  - TFSTATE_BUCKET, TFSTATE_LOCK_TABLE (if using remote state)
  - DB_PASSWORD, DB_USER, DB_NAME (optional)

## Local quick-run (manual)
1. Edit `terraform/variables.tf` or `terraform/dev.tfvars` with your region/AMI.
2. `make tf-init`
3. `make tf-apply PUBLIC_KEY_PATH=~/.ssh/id_rsa.pub PRIVATE_KEY_PATH=~/.ssh/id_rsa DB_PASSWORD=ChangeMe123!`
4. `make tf-output`
5. Render inventory (use the python snippet from workflows or:
   - open terraform-outputs.json, copy `frontend_public_ip` and `backend_private_ip` into ansible/inventory/dev.ini)
6. `make ansible-backend`
7. `make ansible-frontend`

## CI/CD
1. Push Terraform changes → `.github/workflows/terraform-deploy.yml` will run.
2. Push backend changes → `.github/workflows/backend-deploy.yml` runs.
3. Push frontend changes → `.github/workflows/frontend-deploy.yml` runs.

## Notes / Next steps
- Adjust AMI for your region.
- Tighten security groups (allow SSH from limited IPs or use SSM).
- Use ACM + ALB for HTTPS if you add certs.
- Consider baking AMI with Packer for production.
