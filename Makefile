
SSH_HOST := coolify-server
COOLIFY_N8N_DIR := /data/coolify/shared/n8n
LOCAL_N8N_DIR := ./

.PHONY: n8n-push n8n-dry-run

n8n-push:
	ssh $(SSH_HOST) "mkdir -p $(COOLIFY_N8N_DIR)"
	rsync -avz --progress \
		$(LOCAL_N8N_DIR) \
		$(SSH_HOST):$(COOLIFY_N8N_DIR)/

n8n-dry-run:
	rsync -avzn --itemize-changes \
		$(LOCAL_N8N_DIR) \
		$(SSH_HOST):$(COOLIFY_N8N_DIR)/

