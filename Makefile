.PHONY: tf-init tf-apply tf-output ansible-backend ansible-frontend

tf-init:
	cd terraform && terraform init

tf-apply:
	cd terraform && terraform apply -auto-approve \
	 -var="public_key_path=$(PUBLIC_KEY_PATH)" \
	 -var="private_key_path=$(PRIVATE_KEY_PATH)" \
	 -var="db_password=$(DB_PASSWORD)"

tf-output:
	cd terraform && terraform output -json > ../terraform-outputs.json

ansible-backend:
	ansible-playbook -i ansible/inventory/dev.ini ansible/playbooks/setup_backend.yml

ansible-frontend:
	ansible-playbook -i ansible/inventory/dev.ini ansible/playbooks/setup_frontend.yml
