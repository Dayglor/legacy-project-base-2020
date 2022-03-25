#!/bin/bash

# Login
aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin 119120169187.dkr.ecr.sa-east-1.amazonaws.com

# Build (Na pasta do projeto)
docker build -t crm-consultores-message-consumers -f docker/MessageConsumer.Dockerfile .

# Tag
docker tag crm-consultores-message-consumers:latest 119120169187.dkr.ecr.sa-east-1.amazonaws.com/crm-consultores-message-consumers:latest

# Push
docker push 119120169187.dkr.ecr.sa-east-1.amazonaws.com/crm-consultores-message-consumers:latest