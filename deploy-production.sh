#!/bin/bash

# Login
aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin 119120169187.dkr.ecr.sa-east-1.amazonaws.com

# Build (Na pasta do projeto)
docker build -t crm-consultores-api -f docker/CRMConsultoresApiProduction.Dockerfile .

# Tag
docker tag crm-consultores-api:latest 119120169187.dkr.ecr.sa-east-1.amazonaws.com/crm-consultores-api:production

# Push
docker push 119120169187.dkr.ecr.sa-east-1.amazonaws.com/crm-consultores-api:production