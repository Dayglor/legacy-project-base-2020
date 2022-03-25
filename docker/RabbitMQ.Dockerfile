FROM bitnami/rabbitmq:3.8
COPY ./docker/elixir-1.8.2.ez /opt/bitnami/rabbitmq/plugins/
COPY ./docker/rabbitmq_message_deduplication-v3.8.x_0.4.5.ez /opt/bitnami/rabbitmq/plugins/
RUN rabbitmq-plugins enable rabbitmq_management
RUN rabbitmq-plugins enable rabbitmq_management_agent
RUN rabbitmq-plugins enable rabbitmq_message_deduplication